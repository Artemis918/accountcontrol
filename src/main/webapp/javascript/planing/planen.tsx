import * as React from 'react'
import { PlanEditor } from './planeditor'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { MonthSelect } from '../utils//monthselect'
import { Plan } from '../utils/dtos'

type SendMessageCallback = ( msg: string, error: boolean ) => void;

interface PlanenProps {
    sendmessage: SendMessageCallback;
}

interface IState {
    month: number;
    year: number;
    creationMonth: number;
    creationYear: number;
}

export class Planen extends React.Component<PlanenProps, IState> {

    lister: SingleSelectLister<Plan>;
    editor: PlanEditor;
    columns: ColumnInfo<Plan>[];

    constructor( props: PlanenProps ) {
        super( props );
        var currentTime = new Date();

        this.state = { month: currentTime.getMonth() + 1, year: currentTime.getFullYear(),
                       creationMonth: currentTime.getMonth() + 1, creationYear: currentTime.getFullYear() };
        this.refreshlist = this.refreshlist.bind( this );
        this.setFilter = this.setFilter.bind( this );
        this.refresheditor = this.refresheditor.bind( this );
        this.changeCreationDate = this.changeCreationDate.bind( this );
        this.createPlans = this.createPlans.bind( this );
        this.columns = [{
            header: 'Datum',
            getdata: ( data: Plan ): string => { return data.plandate.toLocaleDateString( 'de-DE', { day: '2-digit', month: '2-digit' } ) }
        }, {
            header: 'Beschreibung',
            getdata: ( data: Plan ): string => { return data.shortdescription }
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
        this.setState( { year: y, month: m });
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
        fetch( "plans/createFromTemplates/" + this.state.creationMonth + "/" + this.state.creationYear)
        .then( ( response: Response ) => response.text() )
        .then( (json)=> self.props.sendmessage("Pläne erzeugt", false) )
    }

    changeCreationDate( month: number, year: number ) {
        this.setState( { creationMonth: month, creationYear: year } )
    }

    render(): JSX.Element {
        return (
            <table style={{ width: '100%', border: '1px solid black' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '20%', border: '1px solid black' }}>
                            <PlanEditor ref={( ref ) => { this.editor = ref }} onChange={this.refreshlist} />
                        </td>
                        <td style={{ width: '80%' }}>
                            <div style={{ border: '1px solid black' }}>
                                <MonthSelect label='Pläne erstellen bis:'
                                    year={this.state.creationYear}
                                    month={this.state.creationMonth}
                                    onChange={this.changeCreationDate} />
                                <button onClick={this.createPlans}>Erstellen</button>
                            </div>
                            <div>
                                <MonthSelect label='Pläne für:' year={this.state.year} month={this.state.month} onChange={this.setFilter} />
                            </div>
                            <div>
                                <SingleSelectLister ref={( ref ) => { this.lister = ref; }}
                                    ext={this.state.year + '/' + this.state.month}
                                    handleChange={( data: Plan ) => this.refresheditor( data )}
                                    columns={this.columns}
                                    url='plans/list/' />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

}