import * as React from 'react'
import {useIntl,WrappedComponentProps} from 'react-intl'
import { MultiSelectLister, ColumnInfo, CellInfo } from '../utils/multiselectlister'
import { CategoryTree } from './categorytree'
import { MonthSelect } from '../utils/monthselect'
import { Assignment } from '../utils/dtos'
import acss from './css/account.css'
import css from '../css/index.css'
import { SendMessage, MessageID } from '../utils/messageid'

type Create = (props:CategoriesProps) => JSX.Element;
export const Categories:Create = (p) => {return (<_Categories {...p} intl={useIntl()}/>);}

interface CategoriesProps {
    sendmessage: SendMessage;
}

interface IState {
    selectedSubCategory: number;
    selectedCategory: number;
    month: number;
    year: number;
}

export class _Categories extends React.Component<CategoriesProps & WrappedComponentProps, IState> {

    columns: ColumnInfo<Assignment>[];
    lister: React.RefObject<MultiSelectLister<Assignment>>;

    constructor( props: CategoriesProps & WrappedComponentProps ) {
        super( props );
        var currentTime = new Date();
        this.state = {
            selectedSubCategory: undefined,
            selectedCategory: undefined,
            month: currentTime.getMonth() + 1,
            year: currentTime.getFullYear()
        };
        this.lister = React.createRef();


        this.commitAssignment = this.commitAssignment.bind( this );
        this.commitSelected = this.commitSelected.bind( this );
        this.commitAll = this.commitAll.bind( this );
        this.removeAssignment = this.removeAssignment.bind( this );
        this.replanAssignment = this.replanAssignment.bind( this );
		this.createFooter = this.createFooter.bind(this);
    }

	label(labelid:string):string {return this.props.intl.formatMessage({id: labelid}) }

	createColumns():void {
        this.columns = [
            {
                header: this.label("shortdescription"),
                getdata: ( z: Assignment ) => { return z.detail }
            },
            {
                header: this.label("check.plan"),
                cellrender: ( cell: CellInfo<Assignment> ) => {
                    if ( cell.data.planed == 0 ) {
                        return null;
                    }
                    else {
                        return (
                            <div style={{ textAlign: 'right' }}>
                                {( cell.data.planed / 100 ).toFixed( 2 )}
                            </div>
                        )
                    }
                }
            },
            {
                header: this.label("check.real"),
                cellrender: ( cell: CellInfo<Assignment> ) => {
                    return (
                        <div style={{ textAlign: 'right', backgroundColor: this.getColor( cell.data ) }}>
                            {( cell.data.accountrecord == 0 ) ? '--' : ( cell.data.real / 100 ).toFixed( 2 )}
                        </div>
                    )
                },
            },
            {
                header: 'ok',
                cellrender: ( cell: CellInfo<Assignment> ) => {
                    if ( cell.data.accountrecord != 0 && cell.rownum != -1 )
                        return (
                            <input type='checkbox'
                                checked={cell.data.committed}
                                onClick={() => this.commitAssignment( cell.data )} />
                        )
                },
            }
        ];
	}
	
    getColor( a: Assignment ): string {
        if ( a.accountrecord == 0 || a.plan == 0 )
            return 'lightgrey';
        else if ( a.planed > a.real )
            return 'red';
        else
            return 'green';
    }

    commit( alist: Assignment[] ): void {
        var ids: number[] = alist.map( ( a: Assignment ) => { return a.id; } );
        var self: _Categories = this;
        fetch( '/assign/commit', {
            method: 'post',
            body: JSON.stringify( ids ),
            headers: {
                "Content-Type": "application/json"
            }
        } ).then( function() {
            self.lister.current.reload();
        } );
    }

    commitAssignment( a: Assignment ): void {
        var self: _Categories = this;
        fetch( '/assign/invertcommit/' + a.id )
            .then( function() {
                self.lister.current.reload();
            } );
    }

    commitSelected(): void {
        this.commit( this.lister.current.getSelectedData() );
        this.lister.current.reload();
    }

    commitAll(): void {
        this.commit( this.lister.current.getDataAll() );
        this.lister.current.reload();
    }

    replanAssignment(): void {
        var assignments: Assignment[] = this.lister.current.getSelectedData();
        if ( assignments.length != 1 ) {
            this.props.sendmessage( "es muss genau ein Eintrag selektiert sein", MessageID.INVALID_DATA );
        }
        else {
            var id: number = assignments[0].id;
            var url: string = '/assign/replan/';

            if ( id == 0 || id == undefined ) {
                id = assignments[0].plan;
                url = '/assign/endplan/';
            }

            if ( id != undefined ) {
                var self: _Categories = this;
                fetch( url + id, { headers: { "Content-Type": "application/json" } } )
                    .then( ( response: Response ) => response.text() )
                    .then( () => self.lister.current.reload() );
            }
        }
    }

    removeAssignment(): void {
        var ids: number[] = this.lister.current.getSelectedData().map( ( assign: Assignment ) => { return assign.accountrecord; } );
        var self: _Categories = this;
        fetch( '/assign/remove', {
            method: 'post',
            body: JSON.stringify( ids ),
            headers: {
                "Content-Type": "application/json"
            }
        } ).then( function() {
            self.lister.current.reload();
        } );
    }

    createExt(): string {
        var date: string = '/' + this.state.year + '/' + this.state.month + '/';
        if ( this.state.selectedSubCategory != undefined ) {
            return '/getsubcategory' + date + this.state.selectedSubCategory;
        }
        else if ( this.state.selectedCategory != undefined ) {
            return '/getcategory' + date + this.state.selectedCategory;
        }
        else {
            return '/getcategory' + date + '1';
        }
    }

    createFooter( z: Assignment[] ): Assignment {
        var footer: Assignment = new Assignment();
        var real: number = 0;
        var planed: number = 0;
        z.map( ( assignment: Assignment ) => { real += assignment.real; if ( assignment.planed != undefined ) planed += assignment.planed; } )
        footer.detail = this.label("check.sum");
        footer.real = real;
        footer.planed = planed;
        return footer;
    }

    render(): JSX.Element {
		this.createColumns();
        return (
            <div>
                <div style={{ border: '1px solid black' }}>

                    <button className={css.actionbutton} 
                            onClick={() => this.commitSelected()}>
							{this.label("check.commitselected")}
					 </button>
                    <button className={css.actionbutton} 
                            onClick={() => this.commitAll()}>
							{this.label("check.commitall")}
                    </button>
                    <button className={css.actionbutton} 
                            onClick={() => this.removeAssignment()}>
							{this.label("check.removeassign")}
							</button>
                    <button className={css.actionbutton} 
                            onClick={() => this.replanAssignment()}>
							{this.label("check.replan")}
                            </button>
                </div>
                <table>
                    <tbody>
                        <tr>

                            <td style={{ border: '1px solid black', verticalAlign: 'top' }}>
                                <div className={acss.monthselect}>
                                    <MonthSelect label={this.label("month")}
                                        onChange={( m: number, y: number ) => this.setState( { month: m, year: y } )}
                                        month={this.state.month}
                                        year={this.state.year} />
                                </div>
                                <CategoryTree
                                    handleCatSelect={( kg: number ) => this.setState( { selectedCategory: kg, selectedSubCategory: undefined } )}
                                    handleSubSelect={( k: number ) => this.setState( { selectedCategory: undefined, selectedSubCategory: k } )}
                                />
                            </td>
                            <td style={{ border: '1px solid black' }}>
                                <MultiSelectLister<Assignment>
                                    createFooter={this.createFooter}
                                    url='assign/'
                                    lines={28}
                                    ext={this.createExt()}
                                    columns={this.columns}
                                    ref={this.lister} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}