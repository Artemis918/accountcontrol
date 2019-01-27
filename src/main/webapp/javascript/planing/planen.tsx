import * as React from 'react'
import { PlanEditor} from './planeditor'
import { SingleSelectLister } from '../utils/singleselectlister'
import { MonthSelect } from '../utils//monthselect'
import {Plan} from '../utils/dtos'

type SendMessageCallback = ( msg: string, error: boolean ) => void;

interface PlanenProps {
    sendmessage: SendMessageCallback;
}

interface IState {
    month: number;
    year: number
    selectedRow: number
}

export class Planen extends React.Component<PlanenProps, IState> {

    lister: SingleSelectLister<Plan>;
    editor: PlanEditor;
    columns: any[];

    constructor( props: PlanenProps ) {
        super( props );
        var currentTime = new Date();

        this.state = { month: currentTime.getMonth() + 1, year: currentTime.getFullYear(), selectedRow: undefined };
        this.refreshlist = this.refreshlist.bind( this );
        this.setFilter = this.setFilter.bind( this );
        this.refresheditor = this.refresheditor.bind( this );

        this.columns = [{
            Header: 'Datum',
            accessor: 'plandate',
            width: '100px'
        }, {
            Header: 'Beschreibung',
            accessor: 'shortdescription',
            width: '50%'
        }, {
            Header: 'Betrag',
            accessor: 'wert',
            width: '100px',
            Cell: ( row: any ) => (

                <div style={{
                    color: row.value >= 0 ? 'green' : 'red',
                    textAlign: 'right'
                }}>
                    {( row.value / 100 ).toFixed( 2 )}
                </div>
            )
        }]
    }

    setFilter( m: number, y: number ): void {
        this.lister.setUrlExtension( y + "/" + m );
        this.setState( { year: y, month: m, selectedRow: undefined } )
        this.editor.setPlan( undefined );

    }

    refreshlist() {
        this.setState( { selectedRow: undefined } )
        this.lister.reload();
    }

    refresheditor( data: Plan ): void {
        this.editor.setPlan( data.id );
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
                                <MonthSelect label='Pläne erstellen bis:' year={2018} month={12} />
                                <button> Erstellen </button>
                            </div>
                            <div>
                                <MonthSelect label='Pläne für:' year={this.state.year} month={this.state.month} onChange={this.setFilter} />
                            </div>
                            <div>
                                <SingleSelectLister ref={( ref ) => { this.lister = ref; }}
                                    ext={this.state.year + '/' + this.state.month}
                                    handleChange={( data: Plan ) => this.refresheditor( data )}
                                    columns={this.columns}
                                    url='http://localhost:8080/plans/list/' />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

}