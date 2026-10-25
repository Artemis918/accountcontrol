import React from 'react'

import { PatternEditor } from './patterneditor'
import { CategorySelector } from '../utils/categoryselector'
import { Pattern, Plan, postRequest } from '../utils/dtos'
import { label } from '../utils/misc'

import * as css from '../css/index.css'
import { DescData, DescEditor } from './desceditor'
import { PatternEditorButton } from './patterneditorpopup'
import { RatingData, RatingEditor } from './ratingeditor'

type OnChangeCallback = () => void;

interface PatternPlanEditorProps {
    plan?: Plan;
    onDetach: OnChangeCallback;
}

interface IState {
    message: string;
}

export class PatternPlanEditor extends React.Component<PatternPlanEditorProps, IState> {

    plan: Plan;
    subcategory: number | undefined
    canSave: boolean = false;
    changed: boolean = true;

    constructor(props: PatternPlanEditorProps) {
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

        this.plan = this.createNewPlan();
        this.state = { message: '' };
    }

    componentDidUpdate(prevProps: Readonly<PatternPlanEditorProps>): void {
        if (prevProps.plan != this.props.plan) {
            if (this.props.plan != undefined) {
                this.plan = this.props.plan;
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
        plan.plandate = new Date();
        plan.description = label("plan.newdescription");
        plan.shortdescription = label("plan.newshortdescription");
        return plan
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
            var self: PatternPlanEditor = this;
            this.plan.subcategory = this.subcategory;
            postRequest('plans/savePattern', self.plan, self.setAnswer);
        }
    }

    private setAnswer(data: any): void {
        var msg: string = data.error;
        if (!data.error) {
            this.clear();
            var msg: string = label("plan.saved");
        }
        this.setMessage(msg);
    }

    private clear(): void {
        this.props.onDetach();
        this.resetEditor();
    }

    private delete(): void {
        if (this.plan.id !== undefined && this.plan.id != 0) {
            var self = this;
            fetch('plans/delete/' + this.plan.id, { method: 'get' })
                .then(function (response) { self.setAnswer(response.json()); });
        }
    }

    private copy(): void {
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

    private renderButtons(): React.JSX.Element {
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
            <div testdata-id={"patternplaneditor"}>
                <label>{this.state.message}</label>
                <DescEditor data={descData} sendData={this.changeDescData} />
                <PatternEditorButton pattern={this.plan.pattern} sendPattern={this.changePattern} />
                <RatingEditor data={ratingData} sendData={this.changeRatingData} novalue={true} />
                <div style={{ textAlign: 'center' }}>
                    {this.renderButtons()}
                </div >
            </div >
        );
    }
}