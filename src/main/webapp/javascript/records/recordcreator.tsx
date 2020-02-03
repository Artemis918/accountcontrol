import * as React from 'react';
import { useIntl, WrappedComponentProps } from'react-intl'
import { MonthSelect } from '../utils/monthselect'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { RecordEditor } from './recordeditor'
import { AccountRecord } from '../utils/dtos'
import { SendMessage } from '../utils/messageid'
import css from '../css/index.css'

type Create = (props:RecordCreatorProps) => JSX.Element;
export const RecordCreator:Create = (p) => {return (<_RecordCreator {...p} intl={useIntl()}/>);}

interface RecordCreatorProps {
    sendmessage: SendMessage;
}

interface IState {
    month: number;
    year: number;
}


class _RecordCreator extends React.Component<RecordCreatorProps & WrappedComponentProps, IState> {

    lister: SingleSelectLister<AccountRecord>;
    editor: RecordEditor;
    columns: ColumnInfo<AccountRecord>[] = [{
        header: this.label("date"),
        getdata: ( data: AccountRecord ): string => { return data.executed.toLocaleDateString( 'de-DE', { day: '2-digit', month: '2-digit' } ) }
    }, {
        header: this.label("sender"),
        getdata: ( data: AccountRecord ): string => { return data.sender },
    }, {
        header: this.label("receiver"),
        getdata: ( data: AccountRecord ): string => { return data.receiver },
    }, {
        header: this.label("details"),
        getdata: ( data: AccountRecord ): string => { return data.details },
    }, {
        header: this.label("value"),
        cellrender: ( cellinfo: CellInfo<AccountRecord> ) => (

            <div style={{
                color: cellinfo.data.value >= 0 ? 'green' : 'red',
                textAlign: 'right'
            }}>
                {( cellinfo.data.value / 100 ).toFixed( 2 )}
            </div>

        )
    }];

    constructor( props: RecordCreatorProps & WrappedComponentProps) {
        super( props);
        var currentTime = new Date();
        this.state = { month: currentTime.getMonth() + 1, year: currentTime.getFullYear() };
        this.refreshlist = this.refreshlist.bind( this );
        this.refresheditor = this.refresheditor.bind( this );
        this.setFilter = this.setFilter.bind( this );
        this.lister = undefined;
        this.editor = undefined;
    }

	label(labelid:string):string {return this.props.intl.formatMessage({id: labelid}) }

    setFilter( m: number, y: number ): void {
        this.setState( { year: y, month: m } )
        this.editor.setRecord( undefined );
    }

    refreshlist(): void {
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
                            <div className={css.editortitle}> 
								{this.label("records.recorddata")}
						    </div>
                            <RecordEditor ref={( ref ) => { this.editor = ref; }} 
                                          onChange={this.refreshlist}
                                          intl={this.props.intl} />
                        </td>
                        <td >
                            <div style={{ borderBottom: '1px solid black', padding: '3px' }} >
                                <MonthSelect label={this.label("month")+":"}
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