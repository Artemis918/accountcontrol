import * as React from 'react'
import { PatternEditor } from './patterneditor'
import { KSDayPickerInput } from '../utils/KSDayPickerInput'
import { DropdownService } from '../utils/dropdownservice'
import { CategorySelector } from '../utils/categoryselector'
import { Template, Pattern } from '../utils/dtos'

type OnChangeCallback = () => void;


interface TemplateEditorProps {
    onChange: OnChangeCallback;
    beleg?: number;
}

interface IState {
    template: Template;
    message: string;
    patternEdit: boolean;
}


export class TemplateEditor extends React.Component<TemplateEditorProps, IState> {

    template: Template;

    constructor( props: TemplateEditorProps ) {
        super( props );
        this.template = new Template();
        this.state = { template: this.template, message: '', patternEdit: false };
        this.clear = this.clear.bind( this );
        this.save = this.save.bind( this );
        this.delete = this.delete.bind( this );
        this.copy = this.copy.bind( this );
        this.setAnswer = this.setAnswer.bind( this );
        this.setTemplate = this.setTemplate.bind( this );
    }

    componentDidMount() {
        if ( this.props.beleg != undefined ) {
            var self = this;
            fetch( 'templates/beleg/' + this.props.beleg )
                .then( response => response.json() )
                .then( t => { self.template = t; self.setState( { template: self.template } ) } );
        }
    }


    resetEditor(): void {
        this.template = new Template();
        this.setState( { template: this.template } );
    }

    setTemplate( template: Template ): void {
        if ( template == undefined ) {
            this.resetEditor();
        }
        else {
            this.template = template;
            this.setState( { template: this.template } );
        }
    }

    save(): void {
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

    setAnswer( data: any ): void {
        this.setState( { message: data.message } );
        if ( !data.error ) {
            this.clear();
        }
        this.props.onChange();
    }

    clear(): void {
        this.props.onChange();
        this.resetEditor();
    }

    delete(): void {
        if ( this.state.template.id != undefined && this.state.template.id != 0 ) {
            var self = this;
            fetch( '/templates/delete/' + this.state.template.id, { method: 'get' } )
                .then( function( response ) { self.setAnswer( response.json() ); } );
        }
    }

    copy(): void {
        this.template.id = undefined;
        this.template.shortdescription = "copy of " + this.template.shortdescription;
        this.setTemplateState();
        this.props.onChange();
    }

    setTemplateState(): void {
        this.setState( { patternEdit: false, template: this.template, message: '' } );
    }

    setSubCategory( sub: number, cat: number ) {
        this.template.category = cat;
        this.template.subcategory = sub;
        this.setTemplateState();
    }

    renderButton(): JSX.Element {
        if ( this.props.beleg == undefined ) {
            return (
                <div>
                    <button onClick={this.save}>Save</button>
                    <button onClick={this.clear}>New</button>
                    <button onClick={this.copy}>Copy</button>
                    <button onClick={this.delete}>Del</button>
                </div>
            );
        }
        else {
            return (
                <div>
                    <button onClick={this.save.bind( this )}>Save</button>
                    <button onClick={this.clear}>Back</button>
                </div>
            );
        }
    }

    render(): JSX.Element {
        return (
            <div>
                <label>{this.state.message}</label>
                <table>
                    <tbody style={{ verticalAlign: 'top' }} >
                        <tr><td>Name</td>
                            <td><input value={this.state.template.shortdescription} type='text'
                                onChange={( e ) => { this.template.shortdescription = e.target.value; this.setTemplateState() }} />
                            </td>
                        </tr>
                        <tr><td>gültig ab</td>
                            <td><KSDayPickerInput
                                onChange={( d ) => { this.template.validFrom = d; this.setTemplateState() }}
                                startdate={this.state.template.validFrom} />
                            </td>
                        </tr>
                        <tr><td>gültig bis</td>
                            <td><KSDayPickerInput
                                onChange={( d ) => { this.template.validUntil = d; this.setTemplateState() }}
                                startdate={this.state.template.validUntil} />
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}><td>Rythmus</td>
                            <td>
                                <span style={{ width: '30%' }}>
                                    <input style={{ width: '40px' }} value={this.state.template.anzahl}
                                        type='number'
                                        onChange={( e ) => { this.template.anzahl = e.target.valueAsNumber; this.setTemplateState() }} />
                                </span>
                                <span style={{ width: '70%' }}>
                                    <DropdownService value={this.state.template.rythmus}
                                        onChange={( e ) => { this.template.rythmus = e; this.setTemplateState() }}
                                        url='collections/rythmus' />
                                </span>
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}><td>Erste Buchung</td>
                            <td><KSDayPickerInput
                                onChange={( d ) => { this.template.start = d; this.setTemplateState() }}
                                startdate={this.state.template.start} />
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}><td>Vardays</td>
                            <td><input value={this.state.template.vardays}
                                type='number'
                                onChange={( e ) => { this.template.vardays = e.target.valueAsNumber; this.setTemplateState() }} />
                            </td>
                        </tr>
                        <tr><td>Position</td>
                            <td><input value={this.state.template.position}
                                type='number'
                                onChange={( e ) => { this.template.position = e.target.valueAsNumber; this.setTemplateState() }} />
                            </td>
                        </tr>
                        <tr><td>Kategorie</td>
                            <td><CategorySelector
                                onChange={( k, g ) => this.setSubCategory( k, g )}
                                subcategory={this.state.template.subcategory}
                                category={this.state.template.category} /></td>
                        </tr>
                        <tr><td>MatchArt</td>
                            <td>
                                <DropdownService value={this.state.template.matchstyle}
                                    onChange={( e ) => { this.template.matchstyle = e; this.setTemplateState() }}
                                    url='collections/matchstyle' />
                            </td>
                        </tr>
                        <tr><td>Wert</td>
                            <td><input step="0.01" value={this.state.template.value / 100}
                                type='number'
                                onChange={( e ) => { this.template.value = e.target.valueAsNumber * 100; this.setTemplateState() }} />
                            </td>
                        </tr>
                        <tr><td>Beschreibung</td>
                            <td><textarea cols={20} rows={3}
                                value={this.state.template.description}
                                onChange={( e ) => { this.template.description = e.target.value; this.setTemplateState() }} />
                            </td>
                        </tr>
                        <tr><td>Pattern</td>
                            <td><button onClick={() => this.setState( { patternEdit: true } )}>Editieren</button></td>
                        </tr>
                    </tbody>
                </table>
                {this.renderButton()}
                {this.state.patternEdit ?
                    <PatternEditor
                        pattern={this.state.template.pattern}
                        sendPattern={( e ) => { this.template.pattern = e; this.setTemplateState() }}
                    />
                    : null
                }
            </div >
        );
    }
}