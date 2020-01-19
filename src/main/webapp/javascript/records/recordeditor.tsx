import * as React from 'react'
import { KSDayPickerInput } from '../utils/KSDayPickerInput'
import { AccountRecord } from '../utils/dtos'
import { IntlShape } from 'react-intl' 
import * as css from '../css/index.css'

type OnChangeCallback = () => void;

interface RecordEditorProps {
    onChange: OnChangeCallback;
	intl: IntlShape;
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

    label(labelid:string):string {return this.props.intl.formatMessage({id: labelid}) }

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
        fetch( '/record/delete/' + this.state.record.id, { method: 'get' } )
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
                            <td>{this.label("sender")}</td>
                            <td>
                                <input className={css.stringinput} value={this.state.record.absender}
                                    onChange={( e ) => { this.record.absender = e.target.value; this.setState( { record: this.record } ) }} />
                            </td>
                        </tr>
                        <tr>
                            <td>{this.label("receiver")}</td>
                            <td>
                                <input className={css.stringinput} value={this.state.record.empfaenger}
                                    onChange={( e ) => { this.record.empfaenger = e.target.value; this.setState( { record: this.record } ) }} />
                            </td>
                        </tr>
                        <tr>
                            <td>{this.label("details")}</td>
                            <td>
                                <input className={css.stringinput} value={this.state.record.details}
                                    onChange={( e ) => { this.record.details = e.target.value; this.setState( { record: this.record } ) }} />
                            </td>
                        </tr>
                        <tr>
                            <td>{this.label("value")}</td>
                            <td>
                                <input className={css.numberinput}
                                    step="0.01" value={this.state.record.wert / 100}
                                    type='number'
                                    onChange={( e ) => { this.record.wert = e.target.valueAsNumber * 100; this.setState( { record: this.record } ) }} />
                            </td>
                        </tr>
                        <tr>
                            <td>{this.label("date")}</td>
                            <td className={css.stringinput}><KSDayPickerInput
                                locale={this.props.intl.locale}
                                onChange={( d ) => { this.record.wertstellung = d; this.setState( { record: this.record } ) }}
                                startdate={this.state.record.wertstellung} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <button className={css.addonbutton} onClick={this.save}>{this.label("save")}</button>
                    <button className={css.addonbutton} onClick={this.cleanup}>{this.label("new")}</button>
                    <button className={css.addonbutton} onClick={this.copy}>{this.label("copy")}</button>
                    <button className={css.addonbutton} onClick={this.delete}>{this.label("delete")}</button>
                </div>
            </div>
        );
    }
}
