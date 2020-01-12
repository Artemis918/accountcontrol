import * as React from 'react';
import { KSDayPickerInput } from '../utils/KSDayPickerInput'
import { MonthSelect } from '../utils/monthselect'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { RecordEditor } from './recordeditor'
import { AccountRecord } from '../utils/dtos'
import { SendMessage, MessageID } from '../utils/messageid'

interface RecordCreatorProps {
    sendmessage: SendMessage;
}

interface IState {
    month: number;
    year: number;
}

export class RecordCreator extends React.Component<RecordCreatorProps, IState> {

    lister: SingleSelectLister<AccountRecord>;
    editor: RecordEditor;
    columns: ColumnInfo<AccountRecord>[] = [{
        header: 'Datum',
        getdata: ( data: AccountRecord ): string => { return data.wertstellung.toLocaleDateString( 'de-DE', { day: '2-digit', month: '2-digit' } ) }
    }, {
        header: 'Absender',
        getdata: ( data: AccountRecord ): string => { return data.absender },
    }, {
        header: 'Empfänger',
        getdata: ( data: AccountRecord ): string => { return data.empfaenger },
    }, {
        header: 'Details',
        getdata: ( data: AccountRecord ): string => { return data.details },
    }, {
        header: 'Betrag',
        cellrender: ( cellinfo: CellInfo<AccountRecord> ) => (

            <div style={{
                color: cellinfo.data.wert >= 0 ? 'green' : 'red',
                textAlign: 'right'
            }}>
                {( cellinfo.data.wert / 100 ).toFixed( 2 )}
            </div>

        )
    }];

    constructor( props: RecordCreatorProps ) {
        super( props );
        var currentTime = new Date();
        this.state = { month: currentTime.getMonth() + 1, year: currentTime.getFullYear() };
        this.refreshlist = this.refreshlist.bind( this );
        this.refresheditor = this.refresheditor.bind( this );
        this.setFilter = this.setFilter.bind( this );
        this.lister = undefined;
        this.editor = undefined;
    }


    setFilter( m: number, y: number ): void {
        this.setState( { year: y, month: m } )
        this.editor.setRecord( undefined );
    }

    refreshlist(): void {
        this.editor.setRecord( undefined );
        this.lister.reload();
    }

    refresheditor( record: AccountRecord ): void {
        this.editor.setRecord( record );
    }

    render(): JSX.Element {
        return (
            <table style={{ border: '1px solid black' }}>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid black', verticalAlign: 'top' }}>
                            <div style={{ fontSize: '20px', borderBottom: '1px solid black', margin: '5px' }}> Belegdaten </div>
                            <RecordEditor ref={( ref ) => { this.editor = ref; }} onChange={this.refreshlist} />
                        </td>
                        <td >
                            <div style={{ borderBottom: '1px solid black', padding: '3px' }} >
                                <MonthSelect label='Monat:'
                                    year={this.state.year}
                                    month={this.state.month}
                                    onChange={this.setFilter} />
                            </div>
                            <SingleSelectLister<AccountRecord> ref={( ref ) => { this.lister = ref; }}
                                ext={this.state.year + '/' + this.state.month}
                                handleChange={this.refresheditor}
                                url='record/manlist/'
                                lines={28}
                                columns={this.columns} />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}