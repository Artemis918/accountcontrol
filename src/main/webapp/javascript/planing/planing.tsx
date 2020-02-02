import * as React from 'react'
import { useIntl, WrappedComponentProps} from 'react-intl'

import { PlanEditor } from './planeditor'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { MonthSelect } from '../utils//monthselect'
import { Plan } from '../utils/dtos'
import { SendMessage, MessageID } from '../utils/messageid'

import pcss from './css/planing.css'
import css from '../css/index.css'

type Create = (props:PlaningProps) => JSX.Element;
export const Planing:Create = (p) => {return (<_Planing {...p} intl={useIntl()}/>);}

interface PlaningProps {
    sendmessage: SendMessage;
}

interface IState {
    month: number;
    year: number;
    creationMonth: number;
    creationYear: number;
    creationPopup: boolean;
}

export class _Planing extends React.Component<PlaningProps & WrappedComponentProps, IState> {

    lister: SingleSelectLister<Plan>;
    editor: PlanEditor;
    columns: ColumnInfo<Plan>[];

    constructor( props: PlaningProps & WrappedComponentProps ) {
        super( props );
        var currentTime = new Date();

        this.state = {
            month: currentTime.getMonth() + 1, year: currentTime.getFullYear(),
            creationMonth: currentTime.getMonth() + 1, creationYear: currentTime.getFullYear(),
            creationPopup: false
        };
        this.refreshlist = this.refreshlist.bind( this );
        this.setFilter = this.setFilter.bind( this );
        this.refresheditor = this.refresheditor.bind( this );
        this.changeCreationDate = this.changeCreationDate.bind( this );
        this.createPlans = this.createPlans.bind( this );
        this.openCreatePopup = this.openCreatePopup.bind( this );

    }

	label(labelid:string):string {return this.props.intl.formatMessage({id: labelid}) }
	
	createTableData():void {
	    this.columns = [{
            header: this.label("date"),
            getdata: ( data: Plan ): string => { return data.plandate.toLocaleDateString( 'de-DE', { day: '2-digit', month: '2-digit' } ) }
        }, {
            header: this.label("shortdescription"),
            getdata: ( data: Plan ): string => { return data.shortdescription }
        }, {
            header: this.label("category"),
            getdata: ( data: Plan ): string => { return data.categoryname + "/" + data.subcategoryname }
        }, {
            header: this.label("value"),
            cellrender: ( cell: CellInfo<Plan> ): JSX.Element => (

                <div style={{
                    color: cell.data.value >= 0 ? 'green' : 'red',
                    textAlign: 'right'
                }}>
                    {( cell.data.value / 100 ).toFixed( 2 )}
                </div>
            )
        }]
	}
	
    setFilter( m: number, y: number ): void {
        this.setState( { year: y, month: m } );
    }

    refreshlist() {
        this.editor.setPlan( undefined );
        this.lister.reload();
    }

    refresheditor( data: Plan ): void {
        this.editor.setPlan( data );
    }

    createPlans() {
        var self: _Planing = this;
        fetch( "plans/createFromTemplates/" + this.state.creationMonth + "/" + this.state.creationYear )
            .then( ( response: Response ) => response.text() )
            .then( () => { self.openCreatePopup( false ); 
                           self.props.sendmessage( this.label("plan.planscreated"),  MessageID.OK);  } );
    }

    renderCreation(): JSX.Element {
        if ( this.state.creationPopup ) {
            return (
                <div className={pcss.creationFrame}>
                    <div className={pcss.creationPopup}>
                        <div>{this.label("plan.createplans")}</div>
                        <div className={pcss.creationPopupMonthSelect}>
                            <MonthSelect label=''
                                year={this.state.creationYear}
                                month={this.state.creationMonth}
                                onChange={this.changeCreationDate} />
                        </div>
                        <span style={{ margin: '5px' }} >
                            <button className={pcss.creationButton} onClick={() => this.openCreatePopup( false )}>
								{this.label("cancel")}
							</button>
                            <button className={pcss.creationButton} onClick={this.createPlans}>
								{this.label("create")}</button>
                        </span>
                    </div >
                </div >
            );
        }
        else
            return null;
    }

    changeCreationDate( month: number, year: number ) {
        this.setState( { creationMonth: month, creationYear: year } )
    }

    openCreatePopup( visible: boolean ) {
        this.setState( { creationPopup: visible } );
    }

    render(): JSX.Element {
		this.createTableData();
        return (
            <div>
                <table style={{ border: '1px solid black' }}>
                    <tbody>
                        <tr>
                            <td style={{ verticalAlign: 'top'}} >
                                <div style={{ border: '1px solid black', verticalAlign: 'top', paddingBottom: '160px'}}>
                                    <div className={css.editortitle}> {this.label("plan.plandata")} </div>
                                    <PlanEditor intl={this.props.intl} ref={( ref ) => { this.editor = ref }} onChange={this.refreshlist} />
                                </div>
                                <div style={{ border: '1px solid black', marginTop: '5px', padding: '30px', textAlign: 'center'}}>
                                    <button onClick={() => this.openCreatePopup( true )} className={css.addonbutton} >
										{this.label("plan.fromtemplates")}</button>
                                </div>
                            </td>
                            <td style={{ verticalAlign: 'top' }}>
                                <div style={{ padding: '3px', borderBottom: '1px solid black' }}>
                                    <MonthSelect label={this.label("plan.plansfor")} year={this.state.year} month={this.state.month} onChange={this.setFilter} />
                                </div>
                                <SingleSelectLister ref={( ref ) => { this.lister = ref; }}
                                    lines={28}
                                    ext={this.state.year + '/' + this.state.month}
                                    handleChange={( data: Plan ) => this.refresheditor( data )}
                                    columns={this.columns}
                                    url='plans/list/' />
                            </td>
                        </tr>
                    </tbody>
                </table>
                {this.renderCreation()}
            </div>

        );
    }

}