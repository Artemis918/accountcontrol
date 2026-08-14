import React from 'react'

import { PlanEditor } from './planeditor'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { MonthSelect } from '../utils//monthselect'
import { Plan } from '../utils/dtos'
import { SendMessage, MessageID } from '../utils/messageid'
import { label } from '../utils/misc'
import * as pcss from './css/planing.css'
import * as css from '../css/index.css'


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

export class Planing extends React.Component<PlaningProps, IState> {

    lister: SingleSelectLister<Plan> | null = null;
    editor: PlanEditor | null = null;

    constructor( props: PlaningProps) {
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
	
	createColums():ColumnInfo<Plan>[] {
	    return [{
            header: label("date"),
            getdata: ( data: Plan ): string => { return data.plandate.toLocaleDateString( 'de-DE', { day: '2-digit', month: '2-digit' } ) }
        }, {
            header: label("shortdescription"),
            getdata: ( data: Plan ): string => { return data.shortdescription }
        }, {
            header: label("category"),
            getdata: ( data: Plan ): string => { return data.categoryname + "/" + data.subcategoryname }
        }, {
            header: label("value"),
            cellrender: ( cell: CellInfo<Plan> ): React.JSX.Element => (

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
        this.lister?.reload();
    }

    refresheditor( data: Plan ): void {
        this.editor?.setPlan( data );
    }

    createPlans() {
        var self: Planing = this;
        fetch( "plans/createFromTemplates/" + this.state.creationMonth + "/" + this.state.creationYear )
            .then( ( response: Response ) => response.text() )
            .then( () => { self.openCreatePopup( false ); 
                           self.props.sendmessage( label("plan.planscreated"),  MessageID.OK);  } );
    }

    renderCreation(): React.JSX.Element | null {
        if ( this.state.creationPopup ) {
            return (
                <div className={pcss.creationFrame}>
                    <div className={pcss.creationPopup}>
                        <div>{label("plan.createplans")}</div>
                        <div className={pcss.creationPopupMonthSelect}>
                            <MonthSelect label=''
                                year={this.state.creationYear}
                                month={this.state.creationMonth}
                                onChange={this.changeCreationDate} />
                        </div>
                        <span style={{ margin: '5px' }} >
                            <button className={pcss.creationButton} onClick={() => this.openCreatePopup( false )}>
								{label("cancel")}
							</button>
                            <button className={pcss.creationButton} onClick={this.createPlans}>
								{label("create")}</button>
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

    render(): React.JSX.Element {
        return (
            <div>
                <table style={{ border: '1px solid black' }}>
                    <tbody>
                        <tr>
                            <td style={{ verticalAlign: 'top'}} >
                                <div style={{ border: '1px solid black', verticalAlign: 'top', paddingBottom: '160px'}}>
                                    <div className={css.editortitle}> {label("plan.plandata")} </div>
                                    <PlanEditor ref={( ref ) => { this.editor = ref }} onChange={this.refreshlist} />
                                </div>
                                <div style={{ border: '1px solid black', marginTop: '5px', padding: '30px', textAlign: 'center'}}>
                                    <button onClick={() => this.openCreatePopup( true )} className={css.addonbutton} >
										{label("plan.fromtemplates")}</button>
                                </div>
                            </td>
                            <td style={{ verticalAlign: 'top' }}>
                                <div style={{ padding: '3px', borderBottom: '1px solid black' }}>
                                    <MonthSelect label={label("plan.plansfor")} year={this.state.year} month={this.state.month} onChange={this.setFilter} />
                                </div>
                                <SingleSelectLister ref={( ref ) => { this.lister = ref; }}
                                    lines={28}
                                    ext={this.state.year + '/' + this.state.month}
                                    handleChange={( data: Plan ) => this.refresheditor( data )}
                                    columns={this.createColums()}
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