import * as React from 'react'
import { IntlShape} from 'react-intl'
import { PatternEditor } from './patterneditor'
import { KSDayPickerInput } from '../utils/KSDayPickerInput'
import { DropdownService } from '../utils/dropdownservice'
import { CategorySelector } from '../utils/categoryselector'
import { Template } from '../utils/dtos'
import { TimeRangeSelector } from '../utils/timerangeselector'

import css from '../css/index.css'
import { MatchStyleSelector } from '../utils/matchstyleselector'


type OnChangeCallback = () => void;


interface TemplateEditorProps {
    onChange: OnChangeCallback;
    accountRecord?: number;
	intl?: IntlShape;
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
        this.createNewTemplate();
        this.state = { template: this.template, message: '', patternEdit: false };
        this.clear = this.clear.bind( this );
        this.save = this.save.bind( this );
        this.delete = this.delete.bind( this );
        this.copy = this.copy.bind( this );
        this.setAnswer = this.setAnswer.bind( this );
        this.setTemplate = this.setTemplate.bind( this );
    }

	label(labelid:string):string {return this.props.intl.formatMessage({id: labelid}) }

	componentDidUpdate() {
        if ( this.props.accountRecord != undefined ) {
			this.template.description=this.label("templates.newdescription");
			this.template.shortdescription=this.label("templates.newshortdescription");
		}		
	}

    componentDidMount() {
        if ( this.props.accountRecord != undefined ) {
            var self = this;
            fetch( 'templates/accountrecord/' + this.props.accountRecord )
                .then( response => response.json() )
                .then( t => { self.template = t; self.setState( { template: self.template } ) } );
        }
    }

    createNewTemplate(): void {
        this.template = new Template();
		this.template.description=this.label("templates.newdescription");
		this.template.shortdescription=this.label("templates.newshortdescription");
    }

    resetEditor(): void {
		this.createNewTemplate();
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
        var msg:string = this.label("templates.saved");
        this.setState( { message: msg } );
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
        if ( this.props.accountRecord == undefined ) {
            return (
                <div>
                    <button className={css.addonbutton} onClick={this.save}>{this.label("save")}</button>
                    <button className={css.addonbutton} onClick={this.clear}>{this.label("new")}</button>
                    <button className={css.addonbutton} onClick={this.copy}>{this.label("copy")}</button>
                    <button className={css.addonbutton} onClick={this.delete}>{this.label("delete")}</button>
                </div>
            );
        }
        else {
            return (
                <div>
                    <button className={css.addonbutton} onClick={this.save}>{this.label("save")}</button>
                    <button className={css.addonbutton} onClick={this.clear}>{this.label("back")}</button>
                </div>
            );
        }
    }

    render(): JSX.Element {
        return (
            <div>

                <table>
                    <tbody style={{ verticalAlign: 'top' }} >
                        <tr><td>{this.label("shortdescription")}</td>
                            <td><input className={css.stringinput} 
                                value={this.state.template.shortdescription} type='text'
                                onChange={( e ) => { this.template.shortdescription = e.target.value; this.setTemplateState() }} />
                            </td>
                        </tr>
                        <tr><td>{this.label("templates.validfrom")}</td>
                            <td><KSDayPickerInput
                                onChange={( d ) => { this.template.validFrom = d; this.setTemplateState() }}
                                startdate={this.state.template.validFrom} 
            					locale={this.props.intl.locale} />
                            </td>
                        </tr>
                        <tr><td>{this.label("templates.validuntil")}</td>
                            <td><KSDayPickerInput
                                onChange={( d ) => { this.template.validUntil = d; this.setTemplateState() }}
                                startdate={this.state.template.validUntil}
								locale={this.props.intl.locale}  />
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}><td>{this.label("templates.repetition")}</td>
                            <td>
                                <span style={{ width: '20%' }}>
                                    <input className={css.numbersmallinput} value={this.state.template.anzahl}
                                        type='number'
                                        onChange={( e ) => { this.template.anzahl = e.target.valueAsNumber; this.setTemplateState() }} />
                                </span>
                                <span style={{ width: '20%' }}>
                                    <TimeRangeSelector 
                                        className={css.catselector3} 
                                        curvalue={this.state.template.rythmus}
                                        onChange={( e ) => { this.template.rythmus = e; this.setTemplateState() }}
                                    />
                                </span>
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}><td>{this.label("templates.firstday")}</td>
                            <td><KSDayPickerInput
                                onChange={( d ) => { this.template.start = d; this.setTemplateState() }}
                                startdate={this.state.template.start} 
								locale={this.props.intl.locale} />
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}><td>{this.label("templates.variance")}</td>
                            <td><input value={this.state.template.vardays}
          						className={css.numbersmallinput}
                                type='number'
                                onChange={( e ) => { this.template.vardays = e.target.valueAsNumber; this.setTemplateState() }} />
                            </td>
                        </tr>
                        <tr><td>{this.label("templates.position")}</td>
                            <td><input value={this.state.template.position}
                                type='number'
          						className={css.numbersmallinput}
                                onChange={( e ) => { this.template.position = e.target.valueAsNumber; this.setTemplateState() }} />
                            </td>
                        </tr>
                        <tr><td>{this.label("category")}</td>
                            <td><CategorySelector
								horiz={false}
                                onChange={( k, g ) => this.setSubCategory( k, g )}
                                subcategory={this.state.template.subcategory}
                                category={this.state.template.category} /></td>
                        </tr>
                        <tr><td>{this.label("templates.matchstyle")}</td>
                            <td>
                                <MatchStyleSelector
                                    curvalue={this.state.template.matchstyle}
									className={css.catselector3}
                                    onChange={( e ) => { this.template.matchstyle = e; this.setTemplateState() }} />
                            </td>
                        </tr>
                        <tr><td>{this.label("value")}</td>
                            <td><input step="0.01" value={this.state.template.value / 100}
                                type='number'
          						className={css.numbersmallinput}
                                onChange={( e ) => { this.template.value = e.target.valueAsNumber * 100; this.setTemplateState() }} />
                            </td>
                        </tr>
                        <tr><td>{this.label("description")}</td>
                            <td><textarea cols={20} rows={3}
                                className={css.stringinput}
                                value={this.state.template.description}
                                onChange={( e ) => { this.template.description = e.target.value; this.setTemplateState() }} />
                            </td>
                        </tr>
                        <tr><td>{this.label("templates.pattern")}</td>
                            <td><button 
                                onClick={() => this.setState( { patternEdit: true } )}
                                className={css.addonbutton}>
                                {this.label("templates.edit")}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {this.renderButton()}
                <label>{this.state.message}</label>
                {this.state.patternEdit ?
                    <PatternEditor
                        intl={this.props.intl}
                        pattern={this.state.template.pattern}
                        sendPattern={( e ) => { this.template.pattern = e; this.setTemplateState() }}
                    />
                    : null
                }
            </div >
        );
    }
}