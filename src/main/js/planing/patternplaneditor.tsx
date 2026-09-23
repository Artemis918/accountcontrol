import React from 'react'

import { PatternEditor } from './patterneditor'
import { CategorySelector } from '../utils/categoryselector'
import { Plan, postRequest } from '../utils/dtos'
import { label } from '../utils/misc'

import * as css from '../css/index.css'

type OnChangeCallback = () => void;

interface PlanEditorProps {
    onChange: OnChangeCallback;
}

interface IState {
    plan: Plan;
    message: string;
    patternEdit: boolean;
}

export class PatternPlanEditor extends React.Component<PlanEditorProps, IState> {

    plan: Plan = this.createNewPlan();

    constructor(props: PlanEditorProps) {
        super(props);
        this.clear = this.clear.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.copy = this.copy.bind(this);
        this.setAnswer = this.setAnswer.bind(this);
        this.setPlan = this.setPlan.bind(this);
        this.createNewPlan = this.createNewPlan.bind(this);

        this.plan = this.createNewPlan();
        this.state = { plan: this.plan, message: '', patternEdit: false };
    }

    resetEditor(): void {
        this.plan = this.createNewPlan();
        this.setState({ plan: this.plan });
    }


    createNewPlan(): Plan {
        var plan: Plan = new Plan();
        plan.plandate = new Date();
        plan.description = label("plan.newdescription");
        plan.shortdescription = label("plan.newshortdescription");
        plan.subcategory = 0;
        return plan
    }

    setPlan(plan: Plan) {
        if (plan == undefined) {
            this.resetEditor();
        }
        else {
            this.plan = plan;
            this.setState({ plan: this.plan });
        }
    }

    save() {
        var self: PatternPlanEditor = this;
        postRequest('plans/savePattern', self.state.plan, self.setAnswer);
    }

    setAnswer(data: any): void {
        this.setState({ message: data.message });
        if (!data.error) {
            this.clear();
        }
        this.props.onChange();
    }

    clear(): void {
        this.props.onChange();
        this.resetEditor();
    }

    delete(): void {
        if (this.state.plan.id !== undefined) {
            var self = this;
            fetch('plans/delete/' + this.state.plan.id, { method: 'get' })
                .then(function (response) { self.setAnswer(response.json()); });
        }
    }

    copy(): void {
        this.plan.id = undefined;
        this.plan.shortdescription = "copy of " + this.state.plan.shortdescription;
        this.setState({ plan: this.plan });
        this.props.onChange();
    }

    setPlanState(): void {
        this.setState({ plan: this.plan, message: '' });
    }

    setSubCategory(subcategory: number | undefined): void {
        this.plan.subcategory = subcategory ? subcategory : 0; // TODO hanlde undefined correctly
        this.setState({ plan: this.plan, message: '' });
    }

    renderButton(): React.JSX.Element {
        return (
            <div>
                <button className={css.addonbutton} onClick={this.save}>{label("save")}</button>
                <button className={css.addonbutton} onClick={this.clear}>{label("new")}</button>
                <button className={css.addonbutton} onClick={this.copy}>{label("copy")}</button>
                <button className={css.addonbutton} onClick={this.delete}>{label("delete")}</button>
            </div>
        );
    }

    render(): React.JSX.Element {
        return (
            <div>
                <label>{this.state.message}</label>
                <div className={css.boxborder} >
                    <div className={css.boxinnerpart} >
                        <label className={css.boxlabel} > {label("plan.plandata")}</label>
                        <table>
                            <tbody style={{ verticalAlign: 'top' }} >
                                <tr>
                                    <td>{label("shortdescription")}</td>
                                    <td><input className={css.stringinput}
                                        value={this.state.plan.shortdescription}
                                        type='text'
                                        onChange={(e) => { this.plan.shortdescription = e.target.value; this.setPlanState() }} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>{label("description")}</td>
                                    <td><textarea className={css.stringinput}
                                        cols={38} rows={3}
                                        value={this.state.plan.description}
                                        onChange={(e) => { this.plan.description = e.target.value; this.setPlanState() }} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={css.boxborder} >
                    <div className={css.boxinnerpart} >
                        <label className={css.boxlabel} > {label("plan.pattern")}</label>
                        <br />
                        <button
                            onClick={() => this.setState({ patternEdit: true })}
                            className={css.addonbutton}>
                            {label("plan.edit")}</button>
                    </div>
                </div >
                <div className={css.boxborder} >
                    <div className={css.boxinnerpart} >
                        <label className={css.boxlabel} > {label("templates.rating")}</label>
                        <table>
                            <tbody style={{ verticalAlign: 'top' }} >
                                <tr>
                                    <td>{label("plan.position")}</td>
                                    <td><input className={css.numbersmallinput}
                                        value={this.state.plan.position}
                                        type='number'
                                        onChange={(e) => { this.plan.position = e.target.valueAsNumber; this.setPlanState() }} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>{label("category")}</td>
                                    <td style={{ width: '100%' }}>
                                        <CategorySelector
                                            horiz={true}
                                            onChange={(sub) => this.setSubCategory(sub)}
                                            subcategory={this.state.plan.subcategory} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    {this.renderButton()}
                    {this.state.patternEdit ?
                        <PatternEditor
                            zIndex={1}
                            pattern={this.state.plan.patterndto}
                            sendPattern={(e) => {
                                if (e != undefined) {
                                    this.plan.patterndto = e;
                                }
                                this.setState({ patternEdit: false, plan: this.plan, message: "" })
                            }}
                        />
                        : null
                    }
                </div>
            </div >
        );
    }
}