import * as React from 'react'

import { PatternEditor } from './patterneditor'
import { ACDayPickerInput } from '../utils/acdaypickerinput'
import { CategorySelector } from '../utils/categoryselector'
import { Pattern, Plan } from '../utils/dtos'
import { MatchStyleSelector } from '../utils/matchstyleselector'
import { label } from '../utils/misc'
import * as css from '../css/index.css'
import { DescData, DescEditor } from './desceditor'
import { PatternEditorButton } from './patterneditorpopup'


type OnChangeCallback = () => void;

interface PlanEditorProps {
    onDetach: OnChangeCallback;
    plan?: Plan;
}

interface IState {
    message: string;
    position: number;
    subCategory: number | undefined;
    matchstyle: number;
    pattern: Pattern;
    value: number;
}

export class PlanEditor extends React.Component<PlanEditorProps, IState> {

    plan: Plan;
    subcategory: number | undefined
    canSave: boolean = false;
    changed: boolean = true;
    resetcat: boolean = true;

    constructor(props: PlanEditorProps) {
        super(props);

        this.clear = this.clear.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.copy = this.copy.bind(this);
        this.setAnswer = this.setAnswer.bind(this);
        this.createNewPlan = this.createNewPlan.bind(this);
        this.changeDescData = this.changeDescData.bind(this);
        this.createStateFromPlan = this.createStateFromPlan.bind(this);
        this.setPlan = this.setPlan.bind(this);

        this.plan = this.createNewPlan();
        this.setPlan(props.plan || this.plan);
        this.canSave = props.plan == undefined;
    }



    componentDidUpdate(prevProps: Readonly<PlanEditorProps>): void {
        if (prevProps.plan != this.props.plan) {
            if (this.props.plan != undefined) {
                this.canSave = false;
                this.setPlan(this.props.plan);
            }
            else {
                this.resetEditor();
            }
        }
    }

    private createNewPlan(): Plan {
        var plan: Plan = new Plan();
        plan.description = label("plan.newdescription");
        plan.shortdescription = label("plan.newshortdescription");
        this.subcategory = undefined;
        return plan;
    }

    private setPlan(plan: Plan) {
        this.plan = plan;
        this.subcategory = this.plan.subcategory==-1 ? undefined : this.plan.subcategory;
        this.state = this.createStateFromPlan();
    }

    private createStateFromPlan(): IState {
        return {
            position: this.plan.position,
            subCategory: this.subcategory,
            matchstyle: this.plan.matchstyle ? this.plan.matchstyle : 0,
            value: this.plan.value,
            pattern: this.plan.pattern,
            message: ''
        };
    }
    private setStateFromPlan(): void {
        this.setState(this.createStateFromPlan());
    }

    private resetEditor(): void {
        this.canSave = true;
        this.resetcat = true;
        this.setPlan(this.createNewPlan());
    }

    private save() {
        if (this.canSave) {
            var self = this;
            var jsonbody = JSON.stringify(this.plan);
            fetch('plans/save', {
                method: 'post',
                body: jsonbody,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response) {
                self.setAnswer(response.json());
            });
        }
    }

    setAnswer(data: any): void {
        var msg: string = data.error;
        if (!data.error) {
            this.clear();
            this.props.onDetach();
            var msg: string = label("plan.saved");
        }
        this.setState({ message: msg });

    }

    clear(): void {
        this.props.onDetach();
        this.resetEditor();
    }

    delete(): void {
        if (this.plan.id !== undefined && this.plan.id != 0) {
            var self = this;
            fetch('plans/delete/' + this.plan.id, { method: 'get' })
                .then(function (response) { self.setAnswer(response.json()); });
        }
    }

    copy(): void {
        this.plan.id = undefined;
        this.plan.shortdescription = "copy of " + this.plan.shortdescription;
        this.checkCanSave();
        this.props.onDetach();
    }

    changeSubCategory(sub: number | undefined): void {
        this.resetcat = false;
        if (this.subcategory != sub) {
            this.subcategory = sub;
            this.checkCanSave()
        }
    }

    private changeDescData(descdata: DescData): void {
        this.plan.shortdescription = descdata.short;
        this.plan.description = descdata.desc;
        this.checkCanSave()
    }

    private changePattern(p: Pattern | undefined): void {
        if (p != undefined)
            this.plan.pattern = p;
        this.setStateFromPlan();
    }

    private checkCanSave() {
        this.changed = true;
        this.setStateFromPlan();
        this.canSave =
            this.plan.subcategory != undefined;
    }

    private renderButton(name: string, func: () => void, disabled: boolean): React.JSX.Element {
        return (
            <button testdata-id={name + "button"}
                className={css.addonbutton}
                onClick={func}
                disabled={disabled}>
                {label(name)}
            </button>
        );
    }
    renderButtons(): React.JSX.Element {
        return (
            <div>
                {this.renderButton("save", this.save, !this.canSave || !this.changed)}
                {this.renderButton("new", this.clear, false)}
                {this.renderButton("copy", this.copy, this.plan.id == undefined)}
                {this.renderButton("delete", this.delete, this.plan.id == undefined || this.plan.id != 0)}
            </div>
        );
    }

    render(): React.JSX.Element {

        var descData: DescData = {
            short: this.plan.shortdescription,
            desc: this.plan.description,
        };
        return (
            <div testdata-id={"planeditor"}>
                <label>{this.state.message}</label>
                <DescEditor data={descData} sendData={this.changeDescData} />
                <div className={css.boxborder} >
                    <div className={css.boxinnerpart} >
                        <label className={css.boxlabel} > {label("templates.timerange")}</label>
                        <table>
                            <tbody style={{ verticalAlign: 'top' }} >
                                <tr>
                                    <td>{label("plan.firstday")}</td>
                                    <td><ACDayPickerInput
                                        testdataid="firstday"
                                        onChange={(d) => { this.plan.startdate = d; this.setStateFromPlan() }}
                                        startdate={this.plan.startdate} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>{label("plan.planedday")}</td>
                                    <td><ACDayPickerInput
                                        testdataid="planday"
                                        onChange={(d) => { this.plan.plandate = d; this.setStateFromPlan() }}
                                        startdate={this.plan.plandate} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>{label("plan.endday")}</td>
                                    <td><ACDayPickerInput
                                        testdataid="endday"
                                        onChange={(d) => { this.plan.enddate = d; this.setStateFromPlan() }}
                                        startdate={this.plan.enddate} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <PatternEditorButton pattern={this.state.pattern} sendPattern={this.changePattern} />
                <div className={css.boxborder} >
                    <div className={css.boxinnerpart} >
                        <label className={css.boxlabel} > {label("templates.rating")}</label>
                        <table>
                            <tbody style={{ verticalAlign: 'top' }} >
                                <tr>
                                    <td>{label("plan.position")}</td>
                                    <td><input className={css.numbersmallinput}
                                        value={this.plan.position}
                                        type='number'
                                        onChange={(e) => { this.plan.position = e.target.valueAsNumber; this.setStateFromPlan() }} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>{label("category")}</td>
                                    <td colSpan={3}>
                                        <CategorySelector
                                            horiz={true}
                                            clearCategory={this.resetcat}
                                            onChange={(sub) => this.changeSubCategory(sub)}
                                            subcategory={this.subcategory} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>{label("value")}</td>
                                    <td><input className={css.numberinput}
                                        value={this.state.value / 100}
                                        type='number'
                                        step='0.01'
                                        onChange={(e) => { this.plan.value = e.target.valueAsNumber * 100; this.setStateFromPlan() }} />
                                    </td>
                                    <td>{label("plan.matchstyle")}</td>
                                    <td><MatchStyleSelector
                                        className={css.catselector3}
                                        curvalue={this.plan.matchstyle}
                                        onChange={(e) => { this.plan.matchstyle = e; this.setStateFromPlan() }} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}