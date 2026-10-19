import * as React from 'react'

import { ACDayPickerInput } from '../utils/acdaypickerinput'
import { Pattern, Plan, postRequest } from '../utils/dtos'
import { label, myStringify } from '../utils/misc'
import * as css from '../css/index.css'
import { DescData, DescEditor } from './desceditor'
import { PatternEditorButton } from './patterneditorpopup'
import { RatingData, RatingEditor } from './ratingeditor'


type OnChangeCallback = () => void;

interface PlanEditorProps {
    plan?: Plan;
    onDetach: OnChangeCallback;
}

interface IState {
    message: string;
}

export class PlanEditor extends React.Component<PlanEditorProps, IState> {

    plan: Plan;
    subcategory: number | undefined
    canSave: boolean = false;
    changed: boolean = true;

    constructor(props: PlanEditorProps) {
        super(props);

        this.clear = this.clear.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.copy = this.copy.bind(this);
        this.setAnswer = this.setAnswer.bind(this);
        this.createNewPlan = this.createNewPlan.bind(this);
        this.changeDescData = this.changeDescData.bind(this);
        this.changeRatingData = this.changeRatingData.bind(this);
        this.changePattern = this.changePattern.bind(this);
        this.setMessage = this.setMessage.bind(this);
        this.setPlan = this.setPlan.bind(this);

        this.state = { message: "" };
        this.plan = props.plan || this.createNewPlan();
        this.subcategory = this.plan.subcategory == -1 ? undefined : this.plan.subcategory;
        this.changed = props.plan == undefined;
    }

    componentDidUpdate(prevProps: Readonly<PlanEditorProps>): void {
        if (prevProps.plan != this.props.plan) {
            if (this.props.plan != undefined) {
                this.canSave = false;
                this.changed = false;
                this.setPlan(this.props.plan);
                this.setMessage("");
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
        return plan;
    }

    private setPlan(plan: Plan) {
        this.plan = plan;
        this.subcategory = this.plan.subcategory == -1 ? undefined : this.plan.subcategory;
        this.setMessage("");
    }

    private setMessage(msg: string): void {
        this.setState({ message: msg })
    }

    private resetEditor(): void {
        this.canSave = true;
        this.changed = true;
        this.setPlan(this.createNewPlan());
    }

    private save() {
        if (this.canSave && this.subcategory != undefined) {
            var self = this;
            this.plan.subcategory = this.subcategory;
            postRequest('plans/save', self.plan, self.setAnswer);
        }
    }

    setAnswer(data: any): void {
        var msg: string = data.error;
        if (!data.error) {
            this.clear();
            var msg: string = label("plan.saved");
        }
        this.setMessage(msg);

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

    private changeRatingData(data: RatingData): void {
        this.plan.position = data.position;
        this.plan.value = data.value;
        this.plan.matchstyle = data.matchstyle
        this.subcategory = data.subCategory;
        this.checkCanSave()
    }

    private changeDescData(descdata: DescData): void {
        this.plan.shortdescription = descdata.short;
        this.plan.description = descdata.desc;
        this.checkCanSave()
    }

    private changePattern(p: Pattern | undefined): void {
        if (p != undefined)
            this.plan.pattern = p;
        this.checkCanSave()
    }

    private checkCanSave() {
        var oldCanSave = this.canSave;
        this.canSave = this.subcategory != undefined;
        if (!this.changed || oldCanSave != this.canSave) {
            this.setMessage("");
        }
        this.changed = true;
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
                {this.renderButton("delete", this.delete, this.plan.id == undefined || this.plan.id == 0)}
            </div>
        );
    }

    render(): React.JSX.Element {

        var descData: DescData = {
            short: this.plan.shortdescription,
            desc: this.plan.description,
        };
        var ratingData: RatingData = {
            position: this.plan.position,
            subCategory: this.subcategory,
            value: this.plan.value,
            matchstyle: this.plan.matchstyle
        }
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
                                        onChange={(d) => { this.plan.startdate = d; this.checkCanSave(); }}
                                        startdate={this.plan.startdate} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>{label("plan.planedday")}</td>
                                    <td><ACDayPickerInput
                                        testdataid="planday"
                                        onChange={(d) => { this.plan.plandate = d; this.checkCanSave(); }}
                                        startdate={this.plan.plandate} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>{label("plan.endday")}</td>
                                    <td><ACDayPickerInput
                                        testdataid="endday"
                                        onChange={(d) => { this.plan.enddate = d; this.checkCanSave(); }}
                                        startdate={this.plan.enddate} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <PatternEditorButton pattern={this.plan.pattern} sendPattern={this.changePattern} />
                <RatingEditor data={ratingData} sendData={this.changeRatingData} />
                <div style={{ textAlign: 'center' }}>
                    {this.renderButtons()}
                </div >
            </div >
        );
    }
}