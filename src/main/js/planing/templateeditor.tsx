import React from 'react'
import { CategorySelector } from '../utils/categoryselector'
import { Pattern, postRequest, Template } from '../utils/dtos'
import { MatchStyleSelector } from '../utils/matchstyleselector'
import { myParseJson, label, myStringify } from '../utils/misc'
import { TimeRangeEditor, TimeRangeData } from './timerangeeditor'
import * as css from '../css/index.css'
import { DescData, DescEditor } from './desceditor'
import { PatternEditorButton } from './patterneditorpopup'
import { RatingData, RatingEditor } from './ratingeditor'



type OnChangeCallback = () => void;


interface TemplateEditorProps {
	template?: Template;
	onDetach: OnChangeCallback;
	accountRecordId?: number;
}

interface IState {
	message: string;
}


export class TemplateEditor extends React.Component<TemplateEditorProps, IState> {

	template: Template;
	canSave: boolean = false;
	changed: boolean = true;

	constructor(props: TemplateEditorProps) {
		super(props);

		this.clear = this.clear.bind(this);
		this.save = this.save.bind(this);
		this.delete = this.delete.bind(this);
		this.copy = this.copy.bind(this);
		this.fetchAccountRecord = this.fetchAccountRecord.bind(this);
		this.setAnswer = this.setAnswer.bind(this);
		this.changeRangeData = this.changeRangeData.bind(this);
		this.changeRatingData = this.changeRatingData.bind(this);
		this.changePattern = this.changePattern.bind(this);
		this.setMessage = this.setMessage.bind(this);
		this.setTemplate = this.setTemplate.bind(this);
		this.changeDescData = this.changeDescData.bind(this);
		this.createNewTemplate = this.createNewTemplate.bind(this);
		this.resetEditor = this.resetEditor.bind(this);
		this.checkCanSave = this.checkCanSave.bind(this);

		this.state = { message: "" };
		this.template = props.template || this.createNewTemplate();
		this.changed = props.template == undefined;
	}

	componentDidMount() {
		this.fetchAccountRecord();
	}

	componentDidUpdate(prevProps: Readonly<TemplateEditorProps>): void {
		if (prevProps.template != this.props.template) {
			if (this.props.template != undefined) {
				this.template = this.props.template;
				this.canSave = false;
				this.changed = false;
				this.fetchAccountRecord();
				this.setTemplate(this.props.template);
			}
			else {
				this.resetEditor();
			}
		}
	}

	private fetchAccountRecord(): void {
		if (this.props.accountRecordId != undefined) {
			var self = this;
			fetch('templates/accountrecord/' + this.props.accountRecordId)
				.then(response => response.text())
				.then(t => {
					if (t) {
						this.changed = false;
						self.setTemplate(myParseJson(t));
					}
				});
		}
	}

	private createNewTemplate(): Template {
		var template = new Template();
		template.description = label("templates.newdescription");
		template.shortdescription = label("templates.newshortdescription");
		return template;
	}

	private setTemplate(template: Template) {
		this.template = template;
		this.setMessage("");
	}

	private setMessage(msg: string): void {
		this.setState({ message: msg });
	}

	private resetEditor(): void {
		this.canSave = true;
		this.changed = true;
		this.setTemplate(this.createNewTemplate());
	}

	private save(): void {
		if (this.canSave) {
			var self = this;
			postRequest('templates/save', self.template, self.setAnswer);
		}
	}

	private setAnswer(data: any): void {
		var msg: string = data.error;
		if (!data.error) {
			this.clear();
			var msg: string = label("templates.saved");
		}
		this.setMessage(msg);
	}

	private clear(): void {
		this.props.onDetach();
		this.resetEditor();
	}

	private delete(): void {
		if (this.template.id != undefined && this.template.id != 0) {
			var self = this;
			fetch('templates/delete/' + this.template.id, { method: 'get' })
				.then(function (response) { self.setAnswer(response.json()); });
		}
	}

	private copy(): void {
		this.template.id = undefined;
		this.template.shortdescription = "copy of " + this.template.shortdescription;
		this.checkCanSave();
		this.props.onDetach();
	}

	private changeRangeData(timerangedata: TimeRangeData): void {
		this.template.repeatcount = timerangedata.repeatcount;
		this.template.repeatunit = timerangedata.repeatunit;
		this.template.variance = timerangedata.variance;
		this.template.start = timerangedata.startdate;
		this.checkCanSave()
	}

	private changeRatingData(data: RatingData): void {
		this.template.position = data.position;
		this.template.value = data.value;
		this.template.matchstyle = data.matchstyle
		this.template.subcategory = data.subCategory;
		this.checkCanSave()
	}

	private changeDescData(descdata: DescData): void {
		this.template.shortdescription = descdata.short;
		this.template.description = descdata.desc;
		this.template.validUntil = descdata.validUntil;
		this.template.validFrom = descdata.validFrom ?? new Date();
		this.checkCanSave()
	}

	private changePattern(p: Pattern | undefined): void {
		if (p != undefined)
			this.template.pattern = p;
		this.checkCanSave()
	}

	private checkCanSave() {
		var oldCanSave = this.canSave;
		this.canSave = this.template.subcategory != undefined;
		if ( !this.changed || oldCanSave != this.canSave ) {
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
		if (this.props.accountRecordId == undefined) {
			return (
				<div>
					{this.renderButton("save", this.save, !this.canSave || !this.changed)}
					{this.renderButton("new", this.clear, false)}
					{this.renderButton("copy", this.copy, this.template.id == undefined)}
					{this.renderButton("delete", this.delete,
						this.template.id == undefined || this.template.id == 0)}
				</div>
			);
		}
		else {
			return (
				<div>
					{this.renderButton("save", this.save, !this.canSave || !this.changed)}
					{this.renderButton("new", this.clear, false)}
				</div>
			);
		}
	}

	render(): React.JSX.Element {

		var timerange: TimeRangeData = {
			repeatcount: this.template.repeatcount,
			repeatunit: this.template.repeatunit,
			variance: this.template.variance,
			startdate: this.template.start
		}
		var descData: DescData = {
			short: this.template.shortdescription,
			desc: this.template.description,
			validFrom: this.template.validFrom,
			validUntil: this.template.validUntil
		};
		var ratingData: RatingData = {
			position: this.template.position,
			subCategory: this.template.subcategory,
			value: this.template.value,
			matchstyle: this.template.matchstyle
		}

		return (
			<div testdata-id={"templateeditor"}>
				<label>{this.state.message}</label>
				<DescEditor data={descData} sendData={this.changeDescData} />
				<TimeRangeEditor rangedata={timerange} sendRange={this.changeRangeData} />
				<PatternEditorButton pattern={this.template.pattern} sendPattern={this.changePattern} />
				<RatingEditor data={ratingData} sendData={this.changeRatingData} />
				<div style={{ textAlign: 'center' }}>
					{this.renderButtons()}
				</div >
			</div >
		);
	}
}