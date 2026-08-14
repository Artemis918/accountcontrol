import React from 'react';
import { label } from '../utils/misc'
import { MonthSelect } from '../utils/monthselect'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { RecordEditor } from './recordeditor'
import { AccountRecord } from '../utils/dtos'
import { SendMessage } from '../utils/messageid'
import * as css from '../css/index.css'

interface RecordCreatorProps {
    sendmessage: SendMessage;
}

interface IState {
    month: number;
    year: number;
}


export class RecordCreator extends React.Component<RecordCreatorProps, IState> {

    lister: SingleSelectLister<AccountRecord> | null = null;
    editor: RecordEditor | null = null;

    columns: ColumnInfo<AccountRecord>[] = [{
        header: label("date"),
        getdata: ( data: AccountRecord ): string => { return data.executed.toLocaleDateString( 'de-DE', { day: '2-digit', month: '2-digit' } ) }
    }, {
        header: label("sender"),
        getdata: ( data: AccountRecord ): string => { return data.sender },
    }, {
        header: label("receiver"),
        getdata: ( data: AccountRecord ): string => { return data.receiver },
    }, {
        header: label("details"),
        getdata: ( data: AccountRecord ): string => { return data.details },
    }, {
        header: label("value"),
        cellrender: ( cellinfo: CellInfo<AccountRecord> ) => (

            <div style={{
                color: cellinfo.data.value >= 0 ? 'green' : 'red',
                textAlign: 'right'
            }}>
                {( cellinfo.data.value / 100 ).toFixed( 2 )}
            </div>

        )
    }];

    constructor( props: RecordCreatorProps) {
        super( props);
        var currentTime = new Date();
        this.state = { month: currentTime.getMonth() + 1, year: currentTime.getFullYear() };
        this.refreshlist = this.refreshlist.bind( this );
        this.refresheditor = this.refresheditor.bind( this );
        this.setFilter = this.setFilter.bind( this );
    }

    setFilter( m: number, y: number ): void {
        this.setState( { year: y, month: m } )
        this.editor?.setRecord( undefined );
    }

    refreshlist(): void {
        this.lister?.reload();
    }

    refresheditor( record: AccountRecord ): void {
        this.editor?.setRecord( record );
    }

    render(): React.JSX.Element {
        return (
            <table style={{ border: '1px solid black' }}>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid black', verticalAlign: 'top' }}>
                            <div className={css.editortitle}> 
								{label("records.recorddata")}
						    </div>
                            <RecordEditor ref={( ref ) => { this.editor = ref; }} 
                                          onChange={this.refreshlist} />
                        </td>
                        <td >
                            <div style={{ borderBottom: '1px solid black', padding: '3px' }} >
                                <MonthSelect label={label("month")+":"}
                                    year={this.state.year}
                                    month={this.state.month}
                                    onChange={this.setFilter} />
                            </div>
                            <SingleSelectLister<AccountRecord> ref={( ref ) => { this.lister = ref; }}
                                ext={this.state.year + '/' + this.state.month}
                                handleChange={this.refresheditor}
                                url='accountrecord/manlist/'
                                lines={28}
                                columns={this.columns} />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}