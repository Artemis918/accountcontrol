import * as React from 'react';
import { KSDayPickerInput } from '../utils/KSDayPickerInput'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { BelegEditor } from './belegeditor'
import { BuchungsBeleg } from '../utils/dtos'

type SendMessageCallback = ( msg: string, error: boolean ) => void;

interface BelegErfassungProps {
    sendmessage: SendMessageCallback;
}

interface IState {
}

export class BelegErfassung extends React.Component<BelegErfassungProps, IState> {

    lister: SingleSelectLister<BuchungsBeleg>;
    editor: BelegEditor;
    columns: ColumnInfo<BuchungsBeleg>[] = [ {
        header: 'Datum',
        getdata: ( data: BuchungsBeleg ):string => { return data.wertstellung.toLocaleDateString('de-DE',{day: '2-digit', month: '2-digit'}) }
    }, {
        header: 'Absender',
        getdata: ( data: BuchungsBeleg ):string => { return data.absender },
    }, {
        header: 'Empfänger',
        getdata: ( data: BuchungsBeleg ):string => { return data.empfaenger },
    }, {
        header: 'Details',
        getdata: ( data: BuchungsBeleg ):string => { return data.details },
    }, {
        header: 'Betrag',
        cellrender: ( cellinfo: CellInfo<BuchungsBeleg> ) => (

            <div style={{
                color: cellinfo.data.wert >= 0 ? 'green' : 'red',
                textAlign: 'right'
            }}>
                {( cellinfo.data.wert / 100 ).toFixed( 2 )}
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

    refresheditor( beleg: BuchungsBeleg ): void {
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
                            <SingleSelectLister<BuchungsBeleg> ref={( ref ) => { this.lister = ref; }}
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