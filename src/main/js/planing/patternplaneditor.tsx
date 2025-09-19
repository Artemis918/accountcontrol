import React from 'react'
import { IntlShape } from 'react-intl'

import { PatternEditor } from './patterneditor'
import { CategorySelector } from '../utils/categoryselector'
import { Plan, postRequest } from '../utils/dtos'
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

export class PatternPlanEditor extends React.Component<PlanEditorProps, IState> {

    plan: Plan;

    constructor( props: PlanEditorProps ) {
        super( props );
        this.createNewPlan();
        this.state = { plan: this.plan, message: '', patternEdit: false };
        this.clear = this.clear.bind( this );
        this.save = this.save.bind( this );
        this.delete = this.delete.bind( this );
        this.copy = this.copy.bind( this );
        this.setAnswer = this.setAnswer.bind( this );
        this.setPlan = this.setPlan.bind( this );
    }

	label(labelid:string):string {return this.props.intl.formatMessage({id: labelid}) }

    resetEditor(): void {
        this.createNewPlan();
        this.setState( { plan: this.plan } );
    }


    createNewPlan(): void {
        this.plan = new Plan();
		this.plan.plandate = undefined;
		this.plan.description=this.label("plan.newdescription");
		this.plan.shortdescription=this.label("plan.newshortdescription");
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
        var self:PatternPlanEditor = this;
		postRequest('plans/savePattern', self.state.plan, self.setAnswer);
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

    setSubCategory( subcategory: number, category: number ): void {
        this.plan.category = category;
        this.plan.subcategory = subcategory;
        this.setState( { plan: this.plan, message: '' } );
    }

    renderButton(): React.JSX.Element {
        return (
                <div>
                    <button className={css.addonbutton} onClick={this.save}>{this.label("save")}</button>
                    <button className={css.addonbutton} onClick={this.clear}>{this.label("new")}</button>
                    <button className={css.addonbutton} onClick={this.copy}>{this.label("copy")}</button>
                    <button className={css.addonbutton} onClick={this.delete}>{this.label("delete")}</button>
                </div>
        );
    }

    render(): React.JSX.Element {
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
                                onChange={( s, c ) => this.setSubCategory( s, c )}
                                subcategory={this.state.plan.subcategory} />
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