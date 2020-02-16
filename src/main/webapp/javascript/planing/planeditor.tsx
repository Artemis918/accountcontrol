import * as React from 'react'
import { IntlShape } from 'react-intl'
import { PatternEditor } from './patterneditor'
import { KSDayPickerInput } from '../utils/KSDayPickerInput'
import { CategorySelector } from '../utils/categoryselector'
import { Plan } from '../utils/dtos'
import { MatchStyleSelector } from '../utils/matchstyleselector'

import css from '../css/index.css'


type OnChangeCallback = () => void;

interface PlanEditorProps {
    onChange: OnChangeCallback;
	intl: IntlShape;
}

interface IState {
    plan: Plan;
    message: string;
    patternEdit: boolean;
}

export class PlanEditor extends React.Component<PlanEditorProps, IState> {

    plan: Plan;

    constructor( props: PlanEditorProps ) {
        super( props );
        this.plan = new Plan();
        this.state = { plan: this.plan, message: '', patternEdit: false };
        this.clear = this.clear.bind( this );
        this.save = this.save.bind( this );
        this.delete = this.delete.bind( this );
        this.copy = this.copy.bind( this );
        this.setAnswer = this.setAnswer.bind( this );
        this.setPlan = this.setPlan.bind( this );
    }

	label(labelid:string):string {return this.props.intl.formatMessage({id: labelid}) }

    createNewPlan(): void {
        this.plan = new Plan();
		this.plan.description=this.label("plan.newdescription");
		this.plan.shortdescription=this.label("plan.newshortdescription");
    }

    resetEditor(): void {
		this.createNewPlan();
        this.setState( { plan: this.plan } );
    }

    setPlan( plan: Plan ) {
        if ( plan == undefined ) {
            this.resetEditor();
        }
        else {
            this.plan = plan;
            this.setState( { plan: this.plan } );
        }
    }

    save() {
        var self = this;
        var jsonbody = JSON.stringify( self.state.plan );
        fetch( 'plans/save', {
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
        if ( this.state.plan.id !== undefined ) {
            var self = this;
            fetch( 'plans/delete/' + this.state.plan.id, { method: 'get' } )
                .then( function( response ) { self.setAnswer( response.json() ); } );
        }
    }

    copy(): void {
        this.plan.id = undefined;
        this.plan.shortdescription = "copy of " + this.state.plan.shortdescription;
        this.setState( { plan: this.plan } );
        this.props.onChange();
    }

    setPlanState(): void {
        this.setState( { plan: this.plan, message: '' } );
    }

    setSubCategory( sub: number, cat: number ): void {
        this.plan.category = cat;
        this.plan.subcategory = sub;
        this.setState( { plan: this.plan, message: '' } );
    }

    renderButton(): JSX.Element {
        return (
            <div>
                <button className={css.addonbutton} onClick={this.save}>{this.label("save")}</button>
                <button className={css.addonbutton} onClick={this.clear}>{this.label("new")}</button>
                <button className={css.addonbutton} onClick={this.copy}>{this.label("copy")}</button>
                <button className={css.addonbutton} onClick={this.delete}>{this.label("delete")}</button>
            </div>
        );
    }

    render(): JSX.Element {
        return (
            <div>
                <label>{this.state.message}</label>
                <table>
                    <tbody style={{ verticalAlign: 'top' }} >
                        <tr style={{ background: 'darkgray' }}>
                            <td>{this.label("shortdescription")}</td>
                            <td><input className={css.stringinput}
                                value={this.state.plan.shortdescription} 
                                type='text'
                                onChange={( e ) => { this.plan.shortdescription = e.target.value; this.setPlanState() }} />
                            </td>
                        </tr>
                        <tr>
                            <td>{this.label("plan.firstday")}</td>
                            <td><KSDayPickerInput
                                onChange={( d ) => { this.plan.startdate = d; this.setPlanState() }}
                                startdate={this.state.plan.startdate}
								locale={this.props.intl.locale} />
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}>
                            <td>{this.label("plan.planedday")}</td>
                            <td><KSDayPickerInput
                                onChange={( d ) => { this.plan.plandate = d; this.setPlanState() }}
                                startdate={this.state.plan.plandate}
								locale={this.props.intl.locale}  />
                            </td>
                        </tr>
                        <tr>
                            <td>{this.label("plan.firstday")}</td>
                            <td><KSDayPickerInput
                                onChange={( d ) => { this.plan.enddate = d; this.setPlanState() }}
                                startdate={this.state.plan.enddate}
  								locale={this.props.intl.locale}  />
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}>
                            <td>{this.label("plan.position")}</td>
                            <td><input className={css.numbersmallinput}
                                value={this.state.plan.position}
                                type='number'
                                onChange={( e ) => { this.plan.position = e.target.valueAsNumber; this.setPlanState() }} />
                            </td>
                        </tr>
                        <tr>
                            <td>{this.label("category")}</td>
                            <td><CategorySelector
								horiz={false}
                                onChange={( k, g ) => this.setSubCategory( k, g )}
                                subcategory={this.state.plan.subcategory}
                                category={this.state.plan.category} />
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}>
                            <td>{this.label("plan.matchstyle")}</td>
                            <td><MatchStyleSelector 
                                    className={css.catselector3}
                                    curvalue={this.state.plan.matchstyle}
                                    onChange={( e ) => { this.plan.matchstyle = e; this.setPlanState() }} />
                            </td>
                        </tr>
                        <tr>
                            <td>{this.label("value")}</td>
                            <td><input className={css.numberinput} 
                                value={this.state.plan.value / 100}
                                type='number'
                                step='0.01'
                                onChange={( e ) => { this.plan.value = e.target.valueAsNumber * 100; this.setPlanState() }} />
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}>
                            <td>{this.label("description")}</td>
                            <td><textarea className={css.stringinput}
                                cols={20} rows={3}
                                value={this.state.plan.description}
                                onChange={( e ) => { this.plan.description = e.target.value; this.setPlanState() }} />
                            </td>
                        </tr>
                        <tr>
                            <td>{this.label("plan.pattern")}</td>
                            <td><button className={css.addonbutton} 
                                onClick={() => this.setState( { patternEdit: true } )}>
								{this.label("plan.edit")}
								</button>
						    </td>
                        </tr>
                    </tbody>
                </table>
                <p />
                {this.renderButton()}
                {this.state.patternEdit ?
                    <PatternEditor
                        zIndex={1}
						intl={this.props.intl}
                        pattern={this.state.plan.patterndto}
                        sendPattern={( e ) => { this.plan.patterndto = e; this.setState( { patternEdit: false, plan: this.plan, message: "" } ) }}
                    />
                    : null
                }
            </div >
        );
    }
}