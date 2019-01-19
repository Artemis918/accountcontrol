import React from 'react'


export default class PatternEditor extends React.Component {

    constructor( props ) {
        super( props );
        this.state = {pattern: props.pattern }
    }

    componentWillMount() {

    }
    
    setValue( index, event ) {
        this.state.pattern[index] = event.target.value;
        this.setState( { pattern: this.state.pattern } );
    }

    sendPattern() {
        this.props.sendPattern( this.state.pattern );
    }

    render() {
        return (
            <div style={{
                position: 'fixed',
                zIndex: '1',
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