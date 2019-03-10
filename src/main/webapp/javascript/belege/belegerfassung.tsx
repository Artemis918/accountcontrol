import * as React from 'react';
import { KSDayPickerInput } from '../utils/KSDayPickerInput'
import { MonthSelect } from '../utils/monthselect'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { BelegEditor } from './belegeditor'
import { BuchungsBeleg } from '../utils/dtos'

type SendMessageCallback = ( msg: string, error: boolean ) => void;

interface BelegErfassungProps {
    sendmessage: SendMessageCallback;
}

interface IState {
    month: number;
    year: number;
}

export class BelegErfassung extends React.Component<BelegErfassungProps, IState> {

    lister: SingleSelectLister<BuchungsBeleg>;
    editor: BelegEditor;
    columns: ColumnInfo<BuchungsBeleg>[] = [{
        header: 'Datum',
        getdata: ( data: BuchungsBeleg ): string => { return data.wertstellung.toLocaleDateString( 'de-DE', { day: '2-digit', month: '2-digit' } ) }
    }, {
        header: 'Absender',
        getdata: ( data: BuchungsBeleg ): string => { return data.absender },
    }, {
        header: 'Empfänger',
        getdata: ( data: BuchungsBeleg ): string => { return data.empfaenger },
    }, {
        header: 'Details',
        getdata: ( data: BuchungsBeleg ): string => { return data.details },
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
        this.editor.setBeleg( undefined );
    }

    refreshlist(): void {
        this.editor.setBeleg( undefined );
        this.lister.reload();
    }

    refresheditor( beleg: BuchungsBeleg ): void {
        this.editor.setBeleg( beleg );
    }

    render(): JSX.Element {
        return (
            <table style={{ border: '1px solid black' }}>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid black', verticalAlign: 'top' }}>
                            <div style={{ fontSize: '20px', borderBottom: '1px solid black', margin: '5px' }}> Belegdaten </div>
                            <BelegEditor ref={( ref ) => { this.editor = ref; }} onChange={this.refreshlist} />
                        </td>
                        <td >
                            <div style={{ borderBottom: '1px solid black', padding: '3px' }} >
                                <MonthSelect label='Monat:'
                                    year={this.state.year}
                                    month={this.state.month}
                                    onChange={this.setFilter} />
                            </div>
                            <SingleSelectLister<BuchungsBeleg> ref={( ref ) => { this.lister = ref; }}
                                ext={this.state.year + '/' + this.state.month}
                                handleChange={this.refresheditor}
                                url='belege/manlist/'
                                lines={28}
                                columns={this.columns} />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}