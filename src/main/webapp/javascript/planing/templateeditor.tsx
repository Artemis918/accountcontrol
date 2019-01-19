import * as React from 'react'
import { PatternEditor, Pattern } from './patterneditor'
import { KSDayPickerInput } from '../utils/KSDayPickerInput'
import { DropdownService } from '../utils/dropdownservice'
import { KontenSelector } from '../konten/kontenselector'

type OnChangeCallback = ()=>void;

export class Template {
    id?: number;
    gueltigVon: Date;
    gueltigBis: Date;
    start: Date;
    vardays: number;
    anzahl: number;
    rythmus : number;
    description: string;
    kontogroup: number;
    konto: number ;
    position: number;
    wert: number;
    pattern: Pattern;
    shortdescription: string;
    matchstyle: number;
    previous: number;  
}

interface TemplateEditorProps {
     onChange: OnChangeCallback;
     beleg?: number;
    }

    interface IState {
        template: Template;
        message: string;
        patternEdit: boolean;
    }   


export class TemplateEditor extends React.Component<TemplateEditorProps,IState> {

    template : Template;
    
    constructor( props : TemplateEditorProps ) {
        super( props );
        this.template = this.createNewTemplate();
        this.state = { template: this.template, message: '', patternEdit: false };
        this.clear = this.clear.bind( this );
        this.delete = this.delete.bind( this );
        this.copy = this.copy.bind( this );
        this.setAnswer = this.setAnswer.bind( this );
    }

    componentWillMount() {
        if ( this.props.beleg != undefined ) {
            var self = this;
            fetch( 'templates/beleg/' + this.props.beleg )
                .then( response => response.json() )
                .then( t => { self.template = t; self.setState( { template: self.template } ) } );
        }
    }

    setTemplate( id: number ) :void {
        if ( id == undefined ) {
            this.template = this.createNewTemplate();
            this.setState( { template: this.template } );
        }
        else {
            var self = this;
            fetch( 'templates/id/' + id )
                .then( response => response.json() )
                .then( t => { self.template = t; self.setState( { template: self.template } ) } );
        }
    }

    createNewTemplate() : Template {
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
                senderID: '',
                receiver: '',
                referenceID: '',
                details: '',
                mandat: '',
            },
            shortdescription: 'neu',
            matchstyle: 0,
            previous: undefined
        }
    }

    save() :void {
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

    setAnswer( data: any ):void {
        this.setState( { message: data.message } );
        if ( !data.error ) {
            this.clear();
        }
    }

    clear() :void {
        this.template = this.createNewTemplate();
        this.props.onChange();
        this.setState( { template: this.template } );
    }

    delete() :void {
        var self = this;
        fetch( '/templates/delete/' + this.state.template.id, { method: 'get' } )
            .then( function( response ) { self.setAnswer( response.json() ); } );
    }

    copy() :void {
        this.template.id = undefined;
        this.template.shortdescription = "copy of " + this.template.shortdescription;
        this.setTemplateState();
        this.props.onChange();
    }

    setTemplateState() :void {
        this.setState( { patternEdit: false, template: this.template, message: '' } );
    }

    setKonto( konto: number, group: number ) {
        this.template.kontogroup = group;
        this.template.konto = konto;
        this.setTemplateState();
    }

    renderButton() :JSX.Element {
        if ( this.props.beleg == undefined ) {
            return (
                <div>
                    <button onClick={this.save.bind( this )}>Save</button>
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

    render() : JSX.Element{
        const FORMAT = "dd.MM.YYYY";
        
        return (
            <div>
                <label>{this.state.message}</label>
                <table>
                    <tbody style={{ verticalAlign: 'top' }} >
                        <tr><td>Name</td>
                            <td><input value={this.state.template.shortdescription} type='text' 
                                onChange={( e ) => {this.template.shortdescription=e.target.value; this.setTemplateState()}} />
                            </td>
                        </tr>
                        <tr><td>gültig ab</td>
                            <td><KSDayPickerInput
                                onChange={( d ) => {this.template.gueltigVon=d; this.setTemplateState() }}
                                startdate={this.state.template.gueltigVon} />
                            </td>
                        </tr>
                        <tr><td>gültig bis</td>
                            <td><KSDayPickerInput
                                onChange={( d ) => {this.template.gueltigBis=d; this.setTemplateState() }}
                                startdate={this.state.template.gueltigBis} />
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}><td>Rythmus</td>
                          <td>
                                    <span style={{width: '30%'}}>
                                                <input style={{ width: '40px' }} value={this.state.template.anzahl}
                                                    type='number'
                                                    onChange={( e ) => {this.template.anzahl=e.target.valueAsNumber;this.setTemplateState() } } />
                                            </span>
                                            <span style={{ width: '70%' }}>
                                                <DropdownService value={this.state.template.rythmus}
                                                    onChange={( e ) => { this.template.rythmus=e;this.setTemplateState() }}
                                                    url='collections/rythmus' />
                                            </span>
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}><td>Erste Buchung</td>
                            <td><KSDayPickerInput
                                onChange={( d ) => {this.template.start=d; this.setTemplateState()}}
                                startdate={this.state.template.start} />
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}><td>Vardays</td>
                            <td><input value={this.state.template.vardays}
                                type='number'
                                onChange={( e ) => {this.template.vardays=e.target.valueAsNumber; this.setTemplateState()}} />
                            </td>
                        </tr>
                        <tr><td>Position</td>
                            <td><input value={this.state.template.position}
                                type='number'
                                onChange={( e ) => {this.template.position=e.target.valueAsNumber; this.setTemplateState()}} />
                            </td>
                        </tr>
                        <tr><td>Konto</td>
                            <td><KontenSelector
                                onChange={( k, g ) => this.setKonto( k, g )}
                                konto={this.state.template.konto}
                                group={this.state.template.kontogroup} /></td>
                        </tr>
                        <tr><td>MatchArt</td>
                            <td>
                                <DropdownService value={this.state.template.matchstyle}
                                    onChange={( e ) => {this.template.matchstyle=e; this.setTemplateState()}}
                                    url='collections/matchstyle' />
                            </td>
                        </tr>
                        <tr><td>Wert</td>
                            <td><input step="0.01" value={this.state.template.wert / 100}
                                type='number'
                                onChange={( e ) => {this.template.wert=e.target.valueAsNumber * 100; this.setTemplateState()}} />
                            </td>
                        </tr>
                        <tr><td>Beschreibung</td>
                            <td><textarea cols={20} rows={3} 
                                value={this.state.template.description}
                                onChange={( e ) => {this.template.description=e.target.value; this.setTemplateState()}} />
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