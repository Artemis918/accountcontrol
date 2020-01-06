import * as React from 'react'
import { KSDayPickerInput } from '../utils/KSDayPickerInput'
import { AccountRecord } from '../utils/dtos'

type OnChangeCallback = () => void;
type SendMessage = ( message: string, error: boolean ) => void;

interface RecordEditorProps {
    onChange: OnChangeCallback;
}

interface IState {
    record: AccountRecord;
}


export class RecordEditor extends React.Component<RecordEditorProps, IState> {

    record: AccountRecord;

    constructor( props: RecordEditorProps ) {
        super( props );
        this.record = this.createEmptyRecord();
        this.state = { record: this.record };
        this.cleanup = this.cleanup.bind( this );
        this.save = this.save.bind( this );
        this.delete = this.delete.bind( this );
        this.copy = this.copy.bind( this );
        this.setAnswer = this.setAnswer.bind( this );
    }

    createEmptyRecord(): AccountRecord {
        return new AccountRecord();
    }
    
    setRecord( record: AccountRecord ): void {
        if ( record == undefined )
            this.record = this.createEmptyRecord();
        else
            this.record = record;
        this.setState( { record: this.record } );
    }

    save(): void {
        var self = this;
        var jsonbody = JSON.stringify( self.state.record );
        fetch( '/record/save', {
            method: 'post',
            body: jsonbody,
            headers: {
                "Content-Type": "application/json"
            }
        } ).then( function( response ) {
            self.setAnswer( response.json() );
        } );
    }

    setAnswer( data: any ): void {
        this.props.onChange();
    }

    cleanup(): void {
        this.record = this.createEmptyRecord();
        this.props.onChange();
        this.setState( { record: this.record } );
    }

    delete(): void {
        var self = this;
        fetch( '/recorde/delete/' + this.state.record.id, { method: 'get' } )
            .then( function( response ) { self.setAnswer( response.json() ); } );
    }

    copy(): void {
        this.record.id = undefined;
        this.record.details = "copy of " + this.record.details;
        var currecord = this.record;
        this.props.onChange();
        this.record=currecord;
        this.setState( { record: this.record } );
    }

    render(): JSX.Element {
        return (
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>Absender</td>
                            <td>
                                <input value={this.state.record.absender}
                                    onChange={( e ) => { this.record.absender = e.target.value; this.setState( { record: this.record } ) }} />
                            </td>
                        </tr>
                        <tr>
                            <td>Empfänger</td>
                            <td>
                                <input value={this.state.record.empfaenger}
                                    onChange={( e ) => { this.record.empfaenger = e.target.value; this.setState( { record: this.record } ) }} />
                            </td>
                        </tr>
                        <tr>
                            <td>Beschreibung</td>
                            <td>
                                <input value={this.state.record.details}
                                    onChange={( e ) => { this.record.details = e.target.value; this.setState( { record: this.record } ) }} />
                            </td>
                        </tr>
                        <tr>
                            <td>Wert</td>
                            <td>
                                <input step="0.01" value={this.state.record.wert / 100}
                                    type='number'
                                    onChange={( e ) => { this.record.wert = e.target.valueAsNumber * 100; this.setState( { record: this.record } ) }} />
                            </td>
                        </tr>
                        <tr>
                            <td>WertStellung</td>
                            <td><KSDayPickerInput
                                onChange={( d ) => { this.record.wertstellung = d; this.setState( { record: this.record } ) }}
                                startdate={this.state.record.wertstellung} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <button onClick={this.save}>Save</button>
                    <button onClick={this.cleanup}>New</button>
                    <button onClick={this.copy}>Copy</button>
                    <button onClick={this.delete}>Del</button>
                </div>
            </div>
        );
    }
}
