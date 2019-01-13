import React from 'react'
import DropdownService from 'utils/dropdownservice.jsx'
import PatternEditor from 'patterneditor.jsx'
import {KSDayPickerInput} from 'utils/KSDayPickerInput'

import 'react-day-picker/lib/style.css';



export default class PlanEditor extends React.Component {

    constructor( props ) {
        super( props );
        this.state = { plan: {}, message: ''};
        this.clear = this.clear.bind( this );
        this.delete = this.delete.bind( this );
        this.copy = this.copy.bind( this );
        this.setAnswer = this.setAnswer.bind( this );
        this.setPlan = this.setPlan.bind( this );
        this.kontoselect = undefined;
    }

    componentWillMount() {
        this.state.plan = this.createNewPlan();
    }
    
    resetEditor() {
        this.setState( { plan: this.createNewPlan()  } );
    }

    setPlan( id ) {
        if ( id == undefined ) {
            this.resetEditor();
        }
        else {
            var self = this;
            fetch( 'http://localhost:8080/plans/id/' + id )
                .then( response => response.json() )
                .then( p => { self.setState( { plan: p } ) } );
        }
    }
    
    createNewPlan() {
        var date = new Date();
        return {
            id: undefined,
            startdate: date,
            plandate: date,
            enddate: date,
            position: 0,
            description: 'Neuer Plan',
            shortdescription: 'neu',
            idkontogroup: 1,
            idkonto: 1,
            wert: 0,
            patterndto: {
                sender: '',
                senderID: '',
                receiver: '',
                referenceID: '',
                details: '',
                mandat: '',
            },
            matchstyle: 0,
        }
    }

    save() {
        var self = this;
        var jsonbody = JSON.stringify( self.state.plan );
        fetch( '/plans/save', {
            method: 'post',
            body: jsonbody,
            headers: {
                "Content-Type": "application/json"
            }
        } ).then( function( response ) {
            self.setAnswer( response.json() );
        } );
    }

    setAnswer( data ) {
        this.setState( { message: data.message } );
        if ( !data.error ) {
            this.clear();
        }
    }

    clear() {
        this.props.onChange();
        this.resetEditor();
    }

    delete() {
        if ( this.state.plan.id !== undefined ) {
            var self = this;
            fetch( '/plans/delete/' + this.state.plan.id, { method: 'get' } )
                .then( function( response ) { self.setAnswer( response.json() ); } );
        }
    }

    copy() {
        this.state.plan.id = undefined;
        this.state.plan.shortdescription = "copy of " + this.state.plan.shortdescription;
        this.setState( { reset: this.state.reset } );
        this.props.onChange();
    }

    setValue( index, value ) {
        this.state.plan[index] = value;
        this.setState( { message: '' } );
    }

    renderButton() {
        return (
            <div>
                <button onClick={this.save.bind( this )}>Save</button>
                <button onClick={this.clear}>New</button>
                <button onClick={this.copy}>Copy</button>
                <button onClick={this.delete}>Del</button>
            </div>
        );
    }


    render() {
        const FORMAT = "dd.MM.YYYY";

        return (
            <div>
                <label>{this.state.message}</label>
                <table>
                    <tbody style={{ verticalAlign: 'top' }} >
                        <tr style={{ background: 'darkgray' }}>
                            <td>Name</td>
                            <td><input value={this.state.plan.shortdescription} type='text' onChange={( e ) => this.setValue( 'shortdescription', e.target.value )} />
                            </td>
                        </tr>
                        <tr>
                            <td>Stardatum</td>
                            <td><KSDayPickerInput
                                onChange={( d ) => this.setValue( 'startdate', d )}
                                startdate={this.state.plan.startdate} /></td>

                        </tr>
                        <tr style={{ background: 'darkgray' }}>
                            <td>Plandatum</td>
                            <td><KSDayPickerInput
                                onChange={( d ) => this.setValue( 'plandate', d )}
                                startdate={this.state.plan.plandate} /></td>
                        </tr>
                        <tr> <td>Enddatum</td>
                            <td><KSDayPickerInput
                                onChange={( d ) => this.setValue( 'enddate', d )}
                                startdate={this.state.plan.enddate} /></td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}>
                            <td>Position</td>
                            <td><input value={this.state.plan.position}
                                type='number'
                                onChange={( e ) => this.setValue( 'position', e.target.value )} />
                            </td>
                        </tr>
                        <tr>

                            <td>Konto</td>
                            <td>
                                <DropdownService key="kontogroupselect" value={this.state.plan.idkontogroup}
                                    onChange={( e ) => { this.setValue( 'idkontogroup', e ); this.kontoselect.setparam( e ); }}
                                    url='collections/kontogroups'
                                    textfield='text'
                                    valuefield='value' />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <DropdownService value={this.state.plan.idkonto}
                                    onChange={( e ) => this.setValue( 'idkonto', e )}
                                    url='collections/konto'
                                    param={this.state.plan.idkontogroup}
                                    textfield='text'
                                    valuefield='value'
                                    ref={c => this.kontoselect = c} />
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}>
                            <td>MatchArt</td>
                            <td>
                                <DropdownService value={this.state.plan.matchStyle}
                                    onChange={( e ) => this.setValue( 'art', e )}
                                    url='collections/matchstyle'
                                    textfield='text'
                                    valuefield='value' />
                            </td>
                        </tr>
                        <tr>
                            <td>Wert</td>
                            <td><input value={this.state.plan.wert / 100}
                                type='number'
                                step='0.01'
                                onChange={( e ) => this.setValue( 'wert', e.target.value * 100 )} />
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}>
                            <td>Beschreibung</td>
                            <td><textarea cols='20' rows='3'
                                value={this.state.plan.description}
                                onChange={( e ) => this.setValue( 'description', e.target.value )} />
                            </td>
                        </tr>
                        <tr>
                            <td>Pattern</td>
                            <td><button onClick={() => this.setState( { patternEdit: true } )}>Editieren</button></td>
                        </tr>

                    </tbody>
                </table>
                <p />
                {this.renderButton()}
                {this.state.patternEdit ?
                    <PatternEditor cols='20' rows='3'
                        pattern={this.state.plan.patterndto}
                        sendPattern={( e ) => { this.state.plan.patterndto = e; this.setState( { patternEdit: false } ) }}
                    />
                    : null
                }
            </div >
        );
    }
}