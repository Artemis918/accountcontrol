import React from 'react'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import DateUtils from 'react-day-picker';
import DropdownService from 'utils/dropdownservice.jsx'
import PatternEditor from 'patterneditor.jsx'

import 'react-day-picker/lib/style.css';



export default class TemplateEditor extends React.Component {

    constructor( props ) {
        super( props );
        this.state = { template: undefined, message: '', reset: true };
        this.clear = this.clear.bind( this );
        this.delete = this.delete.bind( this );
        this.copy = this.copy.bind( this );
        this.setAnswer = this.setAnswer.bind( this );
        this.kontoselect = undefined;
    }

    componentWillMount() {
        this.state.template = this.createNewTemplate();
    }

    setTemplate( id ) {
        var self = this;
        fetch( 'http://localhost:8080/templates/id/' + id )
            .then( response => response.json() )
            .then( t => { self.copyTemplate(t) ;self.setState( { reset: this.state.reset }) } ) ;
    }

    createNewTemplate() {
        var date = new Date();
        return {
            id: undefined,
            gueltigVon: date,
            gueltigBis: undefined,
            start: date,
            vardays: 4,
            anzahl: 1,
            rythmus: 1,
            description: 'Neue Vorlage',
            kontogroup: 1,
            konto: 1,
            position: 1,
            wert: 0,
            pattern: {
                sender: '',
                receiver: '',
                referenceID: '',
                details: '',
                mandat: '',
            },
            shortdescription: 'neu',
            matchStyle: 0,
            previous: undefined
        }
    }

    copyTemplate( t ) {
        this.state.template.id = t.id;
        this.state.template.gueltigVon = t.gueltigVon;
        this.state.template.gueltigBis = t.gueltigBis;
        this.state.template.start = t.start;
        this.state.template.vardays = t.vardays;
        this.state.template.anzahl = t.anzahl;
        this.state.template.rythmus = t.rythmus;
        this.state.template.description = t.description;
        this.state.template.kontogroup = t.kontogroup;
        this.state.template.konto = t.konto;
        this.state.template.position = t.position;
        this.state.template.wert = t.wert;
        this.state.template.pattern = t.pattern;
        this.state.template.shortdescription = t.shortdescription;
        this.state.template.matchStyle = t.matchstyle;
        this.state.template.previous = t.previous;
    }

    save() {
        var self = this;
        var jsonbody = JSON.stringify( self.state.template );
        fetch( '/templates/save', {
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
        this.setState( { reset: true } );
    }

    delete() {
        var self = this;
        fetch( '/templates/delete/' + this.state.template.id, { method: 'get' } )
            .then( function( response ) { self.setAnswer( response.json() ); } );
    }

    copy() {
        this.state.template.id = undefined;
        this.state.template.shortdescription = "copy of " + this.state.template.shortdescription;
        this.setState( { reset: this.state.reset } );
        this.props.onChange();
    }

    setValue( index, value ) {
        this.state.template[index] = value;
        this.setState( { message: '' } );
    }

    formatDate( date, format, locale ) {
        return dateFnsFormat( date, format, { locale } );
    }

    parseDate( str, format, locale ) {
        const parsed = dateFnsParse( str, format, { locale } );
        if ( !isNaN( parsed ) ) {
            return parsed;
        }

        return undefined;
    }

    render() {
        const FORMAT = "dd.MM.YYYY";
        if ( this.state.reset ) {
            this.state.template = this.createNewTemplate();
            this.state.reset = false;
        }
        return (
            <div>
                <label>{this.state.message}</label>
                <table>
                    <tbody style={{ verticalAlign: 'top' }} >
                        <tr><td>Name</td>
                            <td><input value={this.state.template.shortdescription} type='text' onChange={( e ) => this.setValue( 'shortdescription', e.target.value )} />
                            </td>
                        </tr>
                        <tr><td>gültig ab</td>
                            <td><DayPickerInput
                                onDayChange={( d ) => this.setValue( 'gueltigVon', d )}
                                value={this.state.template.gueltigVon}
                                formatDate={this.formatDate}
                                format={FORMAT}
                                parseDate={this.parseDate} /></td>

                        </tr>
                        <tr><td>gültig bis</td>
                            <td><DayPickerInput
                                onDayChange={( d ) => this.setValue( 'gueltigBis', d )}
                                formatDate={this.formatDate}
                                value={this.state.template.gueltigBis}
                                format={FORMAT}
                                parseDate={this.parseDate} /></td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}><td>Rythmus</td>
                            <td>
                                <DropdownService value={this.state.template.rythmus}
                                    onChange={( e ) => this.setValue( 'rythmus', e )}
                                    url='collections/rythmus'
                                    textfield='text'
                                    valuefield='value' />
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}><td>Erste Buchung</td>
                            <td><DayPickerInput
                                onDayChange={( d ) => this.setValue( 'start', d )}
                                formatDate={this.formatDate}
                                value={this.state.template.gueltigBis}
                                format={FORMAT}
                                parseDate={this.parseDate} /></td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}><td>Anzahl</td>
                            <td><input value={this.state.template.anzahl}
                                type='number'
                                onChange={( e ) => this.setValue( 'anzahl', e.target.value )} />
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}><td>VarDays</td>
                            <td><input value={this.state.template.vardays}
                                type='number'
                                onChange={( e ) => this.setValue( 'vardays', e.target.value )} />
                            </td>
                        </tr>
                        <tr><td>Position</td>
                            <td><input value={this.state.template.position}
                                type='number'
                                onChange={( e ) => this.setValue( 'position', e.target.value )} />
                            </td>
                        </tr>
                        <tr><td>Konto</td>
                            <td>
                                <DropdownService key="kontogroupselect" value={this.state.template.kontogroup}
                                    onChange={( e ) => { this.setValue( 'kontogroup', e ); this.kontoselect.setparam( e ); }}
                                    url='collections/kontogroups'
                                    textfield='text'
                                    valuefield='value' />
                            </td>
                        </tr>
                        <tr><td></td>
                            <td>
                                <DropdownService value={this.state.template.konto}
                                    onChange={( e ) => this.setValue( 'konto', e )}
                                    url='collections/konto'
                                    param={this.state.template.kontogroup}
                                    textfield='text'
                                    valuefield='value'
                                    ref={c => this.kontoselect = c} />
                            </td>
                        </tr>
                        <tr><td>MatchArt</td>
                            <td>
                                <DropdownService value={this.state.template.matchStyle}
                                    onChange={( e ) => this.setValue( 'art', e )}
                                    url='collections/matchstyle'
                                    textfield='text'
                                    valuefield='value' />
                            </td>
                        </tr>
                        <tr><td>Wert</td>
                            <td><input value={this.state.template.wert}
                                type='number'
                                onChange={( e ) => this.setValue( 'wert', e.target.value )} />
                            </td>
                        </tr>
                        <tr><td>Beschreibung</td>
                            <td><textarea cols='20' rows='3'
                                value={this.state.template.description}
                                onChange={( e ) => this.setValue( 'description', e.target.value )} />
                            </td>
                        </tr>
                        <tr><td>Pattern</td>
                            <td><button onClick={() => this.setState( { patternEdit: true } )}>Editieren</button></td>
                        </tr>

                        <tr><td><button onClick={this.save.bind( this )}>Save</button></td>
                            <td><button onClick={this.clear}>New</button></td>
                            <td><button onClick={this.copy}>Copy</button></td>
                            <td><button onClick={this.delete}>Delete</button></td>
                        </tr>
                    </tbody>
                </table>
                {this.state.patternEdit ?
                    <PatternEditor cols='20' rows='3'
                        pattern={this.state.template.pattern}
                        sendPattern={( e ) => { this.state.template.pattern = e; this.setState( { patternEdit: false } ) }}
                    />
                    : null
                }
            </div >
        );
    }
}