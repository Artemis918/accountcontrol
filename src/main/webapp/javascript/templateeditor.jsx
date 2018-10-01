import React from 'react'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import DateUtils from 'react-day-picker';
import DropdownService from 'utils/dropdownservice.jsx'

import 'react-day-picker/lib/style.css';



export default class TemplateEditor extends React.Component {

    constructor( props ) {
        super( props );
        var template = this.createNewTemplate();
        this.state = { template: template };
        this.clear = this.clear.bind( this );
    }

    createNewTemplate() {
        var date = new Date();
        return {
            id: undefined,
            gueltigVon: date,
            gueltigVon: undefined,
            offset: 0,
            vardays: 4,
            anzahl: 1,
            rythmus: 1,
            description: 'Neue Vorlage',
            position: 1,
            wert: 0,
            pattern: '',
            shortdescription: 'neu',
            art: 'Exact',
            previous: 0
        }
    }

    clear() {
        var template = this.createNewTemplate();
        this.setState( { template: { template } } )
    }

    setValue( index, evt ) {
        if ( evt instanceof Date )
            this.state.template[index] = evt;
        this.setState( { template: this.state.template } );
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
        return (
            <div>
                <table>
                    <tbody style={{ verticalAlign: 'top' }} >
                        <tr><td>Name</td>
                            <td><input value={this.state.template.shortdescription} type='text' onChange={( e ) => this.setValue( 'shortdescription', e )} />
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
                        <tr><td>Rythmus</td>
                            <DropdownService value={this.state.template.rythmus}
                                onChange={( e ) => this.setValue( 'rythmus', e )}
                                url='collections/rythmus'
                                textfield='text'
                                valuefield='value' />
                        </tr>
                        <tr><td>Offset</td>
                            <td><input value={this.state.template.offset}
                                type='number'
                                onChange={( e ) => this.setValue( 'offset', e.target.value )} />
                            </td>
                        </tr>
                        <tr><td>Anzahl</td>
                            <td><input value={this.state.template.anzahl}
                                type='number'
                                onChange={( e ) => this.setValue( 'anzahl', e.target.value )} />
                            </td>
                        </tr>
                        <tr><td>VarDays</td>
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
                        <tr><td>MatchArt</td>
                            <td>
                                <DropdownService value={this.state.template.art}
                                    onChange={( e ) => this.setValue( 'art', e )}
                                    url='collections/planart'
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
                            <td><textarea cols='20' rows='3' 
                                          value={this.state.template.pattern}
                                          onChange={( e ) => this.setValue( 'pattern', e.target.value )} />
                            </td>
                        </tr>

                        <tr><td><button onClick={this.setValue}>Speichern</button></td>
                            <td><button onClick={this.clear}>Neu</button></td>
                        </tr>
                    </tbody>
                </table>
            </div >
        );
    }
}