import * as React from 'react'
import { KSDayPickerInput } from '../utils/KSDayPickerInput'
import { BuchungsBeleg } from '../utils/dtos'

type OnChangeCallback = () => void;
type SendMessage = ( message: string, error: boolean ) => void;

interface BelegEditorProps {
    onChange: OnChangeCallback;
}

interface IState {
    beleg: BuchungsBeleg;
}


export class BelegEditor extends React.Component<BelegEditorProps, IState> {

    beleg: BuchungsBeleg;

    constructor( props: BelegEditorProps ) {
        super( props );
        this.beleg = this.createEmptyBeleg();
        this.state = { beleg: this.beleg };
        this.cleanup = this.cleanup.bind( this );
        this.save = this.save.bind( this );
        this.delete = this.delete.bind( this );
        this.copy = this.copy.bind( this );
        this.setAnswer = this.setAnswer.bind( this );
    }

    createEmptyBeleg(): BuchungsBeleg {
        return new BuchungsBeleg();
    }
    setBeleg( id: number ): void {
        if ( id == undefined ) {
            this.beleg = this.createEmptyBeleg();
            this.setState( { beleg: this.beleg } );
        }
        else {
            var self = this;
            fetch( 'belege/id/' + id )
                .then( response => response.json() )
                .then( b => { self.beleg = b; self.setState( { beleg: self.beleg } ) } );
        }
    }

    save(): void {
        var self = this;
        var jsonbody = JSON.stringify( self.state.beleg );
        fetch( '/belege/save', {
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
        this.beleg = this.createEmptyBeleg();
        this.props.onChange();
        this.setState( { beleg: this.beleg } );
    }

    delete(): void {
        var self = this;
        fetch( '/belege/delete/' + this.state.beleg.id, { method: 'get' } )
            .then( function( response ) { self.setAnswer( response.json() ); } );
    }

    copy(): void {
        this.beleg.id = undefined;
        this.beleg.details = "copy of " + this.beleg.details;
        this.setState( { beleg: this.beleg } );
        this.props.onChange();
    }

    render(): JSX.Element {
        return (
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>Absender</td>
                            <td>
                                <input value={this.state.beleg.absender}
                                    onChange={( e ) => { this.beleg.absender = e.target.value; this.setState( { beleg: this.beleg } ) }} />
                            </td>
                        </tr>
                        <tr>
                            <td>Empfänger</td>
                            <td>
                                <input value={this.state.beleg.empfaenger}
                                    onChange={( e ) => { this.beleg.empfaenger = e.target.value; this.setState( { beleg: this.beleg } ) }} />
                            </td>
                        </tr>
                        <tr>
                            <td>Beschreibung</td>
                            <td>
                                <input value={this.state.beleg.details}
                                    onChange={( e ) => { this.beleg.details = e.target.value; this.setState( { beleg: this.beleg } ) }} />
                            </td>
                        </tr>
                        <tr>
                            <td>Wert</td>
                            <td>
                                <input step="0.01" value={this.state.beleg.wert / 100}
                                    type='number'
                                    onChange={( e ) => { this.beleg.wert = e.target.valueAsNumber * 100; this.setState( { beleg: this.beleg } ) }} />
                            </td>
                        </tr>
                        <tr>
                            <td>WertStellung</td>
                            <td><KSDayPickerInput
                                onChange={( d ) => { this.beleg.wertstellung = d; this.setState( { beleg: this.beleg } ) }}
                                startdate={this.state.beleg.wertstellung} />
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
