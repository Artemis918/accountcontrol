import * as React from 'react';
import { KSDayPickerInput } from '../utils/KSDayPickerInput'
import { SingleSelectLister } from '../utils/singleselectlister'
import { BelegEditor, Beleg } from './belegeditor'

type SendMessageCallback = ( msg: string, error: boolean ) => void;

interface BelegErfassungProps {
    sendmessage: SendMessageCallback;
}

interface IState {
}

export class BelegErfassung extends React.Component<BelegErfassungProps, IState> {

    lister: SingleSelectLister<Beleg>;
    editor: BelegEditor;
    columns: any[] = [{
        Header: 'Datum',
        accessor: 'wertstellung',
        width: '150'
    }, {
        Header: 'Absender',
        accessor: 'absender',
        width: '400'
    }, {
        Header: 'Empfänger',
        accessor: 'empfaenger',
        width: '400'
    }, {
        Header: 'Detail',
        accessor: 'details',
        width: '30%'
    }, {
        Header: 'Betrag',
        accessor: 'wert',
        width: '150',
        Cell: ( row: any ) => (

            <div style={{
                color: row.value >= 0 ? 'green' : 'red',
                textAlign: 'right'
            }}>
                {( row.value / 100 ).toFixed( 2 )}
            </div>

        )
    }];


    constructor( props: BelegErfassungProps ) {
        super( props );
        this.state = {};
        this.refreshlist = this.refreshlist.bind( this );
        this.refresheditor = this.refresheditor.bind( this );
        this.lister = undefined;
        this.editor = undefined;
    }

    refreshlist(): void {
        this.lister.reload();
    }

    refresheditor( beleg: Beleg ): void {
        this.editor.setBeleg( beleg.id );
    }

    render(): JSX.Element {
        return (
            <table style={{ border: '1px solid black' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '20%', border: '1px solid black' }}>
                            <BelegEditor ref={( ref ) => { this.editor = ref; }} onChange={this.refreshlist} />
                        </td>
                        <td style={{ width: '80%' }}>
                            <SingleSelectLister<Beleg> ref={( ref ) => { this.lister = ref; }}
                                handleChange={this.refresheditor}
                                url='belege/manlist'
                                columns={this.columns} />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}