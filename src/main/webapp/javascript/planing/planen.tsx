import * as React from 'react'
import { PlanEditor } from './planeditor'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { MonthSelect } from '../utils//monthselect'
import { Plan } from '../utils/dtos'
import * as css from './css/planing.css'

type SendMessageCallback = ( msg: string, error: boolean ) => void;

interface PlanenProps {
    sendmessage: SendMessageCallback;
}

interface IState {
    month: number;
    year: number;
    creationMonth: number;
    creationYear: number;
    erstellenPopup: boolean;
}

export class Planen extends React.Component<PlanenProps, IState> {

    lister: SingleSelectLister<Plan>;
    editor: PlanEditor;
    columns: ColumnInfo<Plan>[];

    constructor( props: PlanenProps ) {
        super( props );
        var currentTime = new Date();

        this.state = {
            month: currentTime.getMonth() + 1, year: currentTime.getFullYear(),
            creationMonth: currentTime.getMonth() + 1, creationYear: currentTime.getFullYear(),
            erstellenPopup: false
        };
        this.refreshlist = this.refreshlist.bind( this );
        this.setFilter = this.setFilter.bind( this );
        this.refresheditor = this.refresheditor.bind( this );
        this.changeCreationDate = this.changeCreationDate.bind( this );
        this.createPlans = this.createPlans.bind( this );
        this.openCreatePopup = this.openCreatePopup.bind( this );
        this.columns = [{
            header: 'Datum',
            getdata: ( data: Plan ): string => { return data.plandate.toLocaleDateString( 'de-DE', { day: '2-digit', month: '2-digit' } ) }
        }, {
            header: 'Beschreibung',
            getdata: ( data: Plan ): string => { return data.shortdescription }
        }, {
            header: 'Kategorie',
            getdata: ( data: Plan ): string => { return data.categoryname + "/" + data.subcategoryname }
        }, {
            header: 'Betrag',
            cellrender: ( cell: CellInfo<Plan> ): JSX.Element => (

                <div style={{
                    color: cell.data.wert >= 0 ? 'green' : 'red',
                    textAlign: 'right'
                }}>
                    {( cell.data.wert / 100 ).toFixed( 2 )}
                </div>
            )
        }]
    }

    setFilter( m: number, y: number ): void {
        this.setState( { year: y, month: m } );
        this.editor.setPlan( undefined );
    }

    refreshlist() {
        this.editor.setPlan( undefined );
        this.lister.reload();
    }

    refresheditor( data: Plan ): void {
        this.editor.setPlan( data );
    }

    createPlans() {
        var self: Planen = this;
        fetch( "plans/createFromTemplates/" + this.state.creationMonth + "/" + this.state.creationYear )
            .then( ( response: Response ) => response.text() )
            .then( ( json ) => { self.openCreatePopup( false ); self.props.sendmessage( "Pläne erzeugt", false );  } );
    }

    renderCreation(): JSX.Element {
        if ( this.state.erstellenPopup ) {
            return (
                <div className={css.creationFrame}>
                    <div className={css.creationPopup}>
                        <div>Pläne erstellen bis:</div>
                        <div className={css.creationPopupMonthSelect}>
                            <MonthSelect label=''
                                year={this.state.creationYear}
                                month={this.state.creationMonth}
                                onChange={this.changeCreationDate} />
                        </div>
                        <span style={{ margin: '5px' }} >
                            <button className={css.creationButton} onClick={() => this.openCreatePopup( false )}>Cancel</button>
                            <button className={css.creationButton} onClick={this.createPlans}>Erstellen</button>
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
        this.setState( { erstellenPopup: visible } );
    }

    render(): JSX.Element {
        return (
            <div>
                <table style={{ border: '1px solid black' }}>
                    <tbody>
                        <tr>
                            <td style={{ verticalAlign: 'top'}} >
                                <div style={{ border: '1px solid black', verticalAlign: 'top', paddingBottom: '160px'}}>
                                    <div style={{ fontSize: '20px', borderBottom: '1px solid black', margin: '5px' }}> Planungsdaten </div>
                                    <PlanEditor ref={( ref ) => { this.editor = ref }} onChange={this.refreshlist} />
                                </div>
                                <div style={{ border: '1px solid black', marginTop: '5px', padding: '30px', textAlign: 'center'}}>
                                    <button onClick={() => this.openCreatePopup( true )}>Aus Vorlagen erstellen</button>
                                </div>
                            </td>
                            <td style={{ verticalAlign: 'top' }}>
                                <div style={{ padding: '3px', borderBottom: '1px solid black' }}>
                                    <MonthSelect label='Pläne für:' year={this.state.year} month={this.state.month} onChange={this.setFilter} />
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