import * as React from 'react'
import { MultiSelectLister, ColumnInfo, CellInfo } from '../utils/multiselectlister'
import { CategoryTree } from './categorytree'
import { MonthSelect } from '../utils/monthselect'
import { CategorySelector } from '../utils/categoryselector'
import { Zuordnung, Template } from '../utils/dtos'
import { myParseJson } from '../utils/misc'
import * as css from './css/konten.css'
import { SendMessage, MessageID } from '../utils/messageid'

interface CategoriesProps {
    sendmessage: SendMessage;
}

interface IState {
    selectedSubCategory: number;
    selectedCategory: number;
    month: number;
    year: number;
}

export class Categories extends React.Component<CategoriesProps, IState> {

    columns: ColumnInfo<Zuordnung>[];
    lister: React.RefObject<MultiSelectLister<Zuordnung>>;

    constructor( props: CategoriesProps ) {
        super( props );
        var currentTime = new Date();
        this.state = {
            selectedSubCategory: undefined,
            selectedCategory: undefined,
            month: currentTime.getMonth() + 1,
            year: currentTime.getFullYear()
        };
        this.lister = React.createRef();
        this.columns = [
            {
                header: 'Beschreibung',
                getdata: ( z: Zuordnung ) => { return z.detail }
            },
            {
                header: 'Soll',
                cellrender: ( cell: CellInfo<Zuordnung> ) => {
                    if ( cell.data.sollwert == 0 ) {
                        return null;
                    }
                    else {
                        return (
                            <div style={{ textAlign: 'right' }}>
                                {( cell.data.sollwert / 100 ).toFixed( 2 )}
                            </div>
                        )
                    }
                }
            },
            {
                header: 'Ist',
                cellrender: ( cell: CellInfo<Zuordnung> ) => {
                    return (
                        <div style={{ textAlign: 'right', backgroundColor: this.getColor( cell.data ) }}>
                            {( cell.data.accountrecord == 0 ) ? '--' : ( cell.data.istwert / 100 ).toFixed( 2 )}
                        </div>
                    )
                },
            },
            {
                header: 'ok',
                cellrender: ( cell: CellInfo<Zuordnung> ) => {
                    if ( cell.data.accountrecord != 0 && cell.rownum != -1 )
                        return (
                            <input type='checkbox'
                                checked={cell.data.committed}
                                onClick={() => this.commitAssignment( cell.data )} />
                        )
                },
            }
        ];

        this.commitAssignment = this.commitAssignment.bind( this );
        this.commitSelected = this.commitSelected.bind( this );
        this.commitAll = this.commitAll.bind( this );
        this.removeAssignment = this.removeAssignment.bind( this );
        this.replanAssignment = this.replanAssignment.bind( this );
    }

    getColor( z: Zuordnung ): string {
        if ( z.accountrecord == 0 || z.plan == 0 )
            return 'lightgrey';
        else if ( z.sollwert > z.istwert )
            return 'red';
        else
            return 'green';
    }

    commit( z: Zuordnung[] ): void {
        var ids: number[] = z.map( ( za: Zuordnung ) => { return za.id; } );
        var self: Categories = this;
        fetch( '/assign/commit', {
            method: 'post',
            body: JSON.stringify( ids ),
            headers: {
                "Content-Type": "application/json"
            }
        } ).then( function( response ) {
            self.lister.current.reload();
        } );
    }

    commitAssignment( a: Zuordnung ): void {
        var self: Categories = this;
        fetch( '/assign/invertcommit/' + a.id )
            .then( function( response ) {
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
        var zuordnungen: Zuordnung[] = this.lister.current.getSelectedData();
        if ( zuordnungen.length != 1 ) {
            this.props.sendmessage( "es muss genau ein Eintrag selektiert sein", MessageID.INVALID_DATA );
        }
        else {
            var id: number = zuordnungen[0].id;
            var url: string = '/assign/replan/';

            if ( id == 0 || id == undefined ) {
                id = zuordnungen[0].plan;
                url = '/assign/endplan/';
            }

            if ( id != undefined ) {
                var self: Categories = this;
                fetch( url + id, { headers: { "Content-Type": "application/json" } } )
                    .then( ( response: Response ) => response.text() )
                    .then( () => self.lister.current.reload() );
            }
        }
    }

    removeAssignment(): void {
        var ids: number[] = this.lister.current.getSelectedData().map( ( za: Zuordnung ) => { return za.accountrecord; } );
        var self: Categories = this;
        fetch( '/assign/remove', {
            method: 'post',
            body: JSON.stringify( ids ),
            headers: {
                "Content-Type": "application/json"
            }
        } ).then( function( response ) {
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

    createFooter( z: Zuordnung[] ): Zuordnung {
        var footer: Zuordnung = new Zuordnung();
        var istwert: number = 0;
        var sollwert: number = 0;
        z.map( ( zuordnung: Zuordnung ) => { istwert += zuordnung.istwert; if ( zuordnung.sollwert != undefined ) sollwert += zuordnung.sollwert; } )
        footer.detail = 'Summe';
        footer.istwert = istwert;
        footer.sollwert = sollwert;
        return footer;
    }

    render(): JSX.Element {
        return (
            <div>
                <div style={{ border: '1px solid black' }}>

                    <button onClick={() => this.commitSelected()}> Auswahl Bestätigen </button>
                    <button onClick={() => this.commitAll()}> Alles Bestätigen </button>
                    <button onClick={() => this.removeAssignment()}> Zuordnung lösen </button>
                    <button onClick={() => this.replanAssignment()}> Plan anpassen </button>
                </div>
                <table>
                    <tbody>
                        <tr>

                            <td style={{ border: '1px solid black', verticalAlign: 'top' }}>
                                <div className={css.monthselect}>
                                    <MonthSelect label='Monat: '
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
                                <MultiSelectLister<Zuordnung>
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