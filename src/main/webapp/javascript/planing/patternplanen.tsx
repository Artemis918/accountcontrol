import * as React from 'react'
import { PlanEditor } from './planeditor'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { Plan } from '../utils/dtos'

type SendMessageCallback = ( msg: string, error: boolean ) => void;

interface PatternPlanenProps {
    sendmessage: SendMessageCallback;
}

interface IState {
    selectedRow: number
}

export class PatternPlanen extends React.Component<PatternPlanenProps, IState> {

    lister: SingleSelectLister<Plan>;
    editor: PlanEditor;
    columns: ColumnInfo<Plan>[];

    constructor( props: PatternPlanenProps ) {
        super( props );
        this.refreshlist = this.refreshlist.bind( this );
        this.refresheditor = this.refresheditor.bind( this );

        this.columns = [{
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

    refreshlist() {
        this.setState( { selectedRow: undefined } )
        this.lister.reload();
    }

    refresheditor( data: Plan ): void {
        this.editor.setPlan( data );
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
                            <SingleSelectLister ref={( ref ) => { this.lister = ref; }}
                                handleChange={( data: Plan ) => this.refresheditor( data )}
                                columns={this.columns}
                                url='plans/patternplans' />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

}