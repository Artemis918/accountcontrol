import * as React from 'react'

type SendPatternCallback= (pattern: Pattern)=>void

export interface Pattern {
    sender: string;
    receiver:string;
    referenceID: string;
    mandat: string;
    senderID: string;
    details: string;
    [key:string] : string;
} 

interface PatternEditorProps {
    pattern: Pattern;
    sendPattern: SendPatternCallback;
}

interface IState {
    pattern: Pattern;
}

export class PatternEditor extends React.Component<PatternEditorProps,IState> {

    pattern: Pattern;
    
    constructor( props: PatternEditorProps ) {
        super( props );
        this.state = {pattern: props.pattern }
        this.pattern = props.pattern;
    }
    
    setValue( index :string, event :React.ChangeEvent<HTMLInputElement> ) :void {
        this.pattern[index] = event.target.value;
        this.setState( { pattern: this.state.pattern } );
    }

    sendPattern(): void {
        this.props.sendPattern( this.state.pattern );
    }

    render() : JSX.Element {
        return (
            <div style={{
                position: 'fixed',
                zIndex: 1,
                left: '0', top: '0', width: '100%', height: '100%'
            }}>
                <div style={{
                    margin: '15% auto',
                    padding: '20px',
                    border: '1px solid #888',
                    width: '300px', height: '300px',
                    background: 'darkgray'
                }}>
                    <table>
                        <tbody>
                        <tr> <td>Absender</td> <td> <input value={this.state.pattern.sender} type='text' onChange={( e ) => this.setValue( 'sender', e )}  /></td></tr>
                        <tr> <td>Empfänger</td> <td> <input value={this.state.pattern.receiver} type='text' onChange={( e ) => this.setValue( 'receiver', e )}  /></td></tr>
                        <tr> <td>Referenzid</td> <td> <input value={this.state.pattern.referenceID} type='text' onChange={( e ) => this.setValue( 'referenceID', e )}  /></td></tr>
                        <tr> <td>Mandat</td> <td> <input value={this.state.pattern.mandat} type='text' onChange={( e ) => this.setValue( 'mandat', e )}  /></td></tr>
                        <tr> <td>Einreicher</td> <td> <input value={this.state.pattern.senderID} type='text' onChange={( e ) => this.setValue( 'senderID', e )}  /></td></tr>
                        <tr> <td>Details</td> <td> <input value={this.state.pattern.details} type='text' onChange={( e ) => this.setValue( 'details', e )}  /></td></tr>
                        </tbody>
                    </table>
                    <button onClick={() => this.sendPattern()}> OK</button>
                </div>
            </div>
        );
    }
}