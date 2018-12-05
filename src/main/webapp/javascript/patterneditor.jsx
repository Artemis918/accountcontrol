import React from 'react'


export default class PatternEditor extends React.Component {

    constructor( props ) {
        super( props );
        this.state = {pattern: props.pattern }
    }

    componentWillMount() {

    }
    
    setValue( index, value ) {
        this.state.pattern[index] = value;
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
                    width: '300', height: '300',
                    background: 'darkgray'
                }}>
                    <table>
                        <tbody>
                        <tr> <td>Referenzid</td> <td> <input value={this.state.pattern.referenceID} type='text' onChange={( e ) => this.setValue( 'referenceID', e )}  /></td></tr>
                        <tr> <td>Absender</td> <td> <input value={this.state.pattern.sender} type='text' onChange={( e ) => this.setValue( 'sender', e )}  /></td></tr>
                        <tr> <td>Empfänger</td> <td> <input value={this.state.pattern.receiver} type='text' onChange={( e ) => this.setValue( 'receiver', e )}  /></td></tr>
                        <tr> <td>Details</td> <td> <input value={this.state.pattern.details} type='text' onChange={( e ) => this.setValue( 'details', e )}  /></td></tr>
                        <tr> <td>Mandat</td> <td> <input value={this.state.pattern.mandat} type='text' onChange={( e ) => this.setValue( 'mandat', e )}  /></td></tr>
                        </tbody>
                    </table>
                    <button onClick={() => this.sendPattern()}> OK</button>
                </div>
            </div>
        );
    }

}