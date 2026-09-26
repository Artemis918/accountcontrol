import React from 'react'
import { PatternEditor } from './patterneditor'
import { ACDayPickerInput } from '../utils/acdaypickerinput'
import { CategorySelector } from '../utils/categoryselector'
import { Pattern, Template } from '../utils/dtos'
import { MatchStyleSelector } from '../utils/matchstyleselector'
import { myParseJson, label } from '../utils/misc'
import { TimeRangeEditor, TimeRangeData } from './timerangeeditor'
import * as css from '../css/index.css'
import { DescData, DescEditor } from './desceditor'
import { PatternEditorButton } from './patterneditorpopup'



type OnChangeCallback = () => void;


interface TemplateEditorProps {
	template?: Template;
	onDetach: OnChangeCallback;
	accountRecordId?: number;
}

interface IState {
	message: string;
	patternEdit: boolean;
	position: number;
	subCategory: number | undefined;
	matchstyle: number;
	pattern: Pattern;
	value: number;
}


export class TemplateEditor extends React.Component<TemplateEditorProps, IState> {

	template: Template;
	canSave: boolean = false;
	changed: boolean = true;
	resetcat: boolean = true;

	constructor(props: TemplateEditorProps) {
		super(props);

		this.clear = this.clear.bind(this);
		this.save = this.save.bind(this);
		this.delete = this.delete.bind(this);
		this.copy = this.copy.bind(this);
		this.fetchAccountRecord= this.fetchAccountRecord.bind(this);
		this.setAnswer = this.setAnswer.bind(this);
		this.changeRange = this.changeRange.bind(this);
		this.changePattern = this.changePattern.bind(this);
		this.createStateFromTemplate = this.createStateFromTemplate.bind(this);
		this.changeDescData = this.changeDescData.bind(this);
		this.createNewTemplate = this.createNewTemplate.bind(this);
		this.createDesc = this.createDesc.bind(this);
		this.resetEditor = this.resetEditor.bind(this);
		this.checkCanSave = this.checkCanSave.bind(this);

		this.template = props.template || this.createNewTemplate();
		this.canSave = props.template == undefined;
		this.state = this.createStateFromTemplate();
	}

	componentDidMount() {
		this.fetchAccountRecord();
	}



	componentDidUpdate(prevProps: Readonly<TemplateEditorProps>, prevState: Readonly<{}>, snapshot?: any): void {
		if (prevProps.template != this.props.template) {
			if (this.props.template != undefined) {
				this.template = this.props.template;
				this.canSave = false;
				this.fetchAccountRecord();
				this.setState(this.createStateFromTemplate());
			}
			else {
				this.resetEditor();
			}
		}
	}

	private fetchAccountRecord() :void {
		if (this.props.accountRecordId != undefined) {
			var self = this;
			fetch('templates/accountrecord/' + this.props.accountRecordId)
				.then(response => response.text())
				.then(t => {
					if (t) {
						self.template = myParseJson(t);
						this.changed = false;
						self.setState(self.createStateFromTemplate());
					}
				});
		}
	}

	private createNewTemplate(): Template {
		var template = new Template();
		this.createDesc(template);
		return template;
	}


	private createStateFromTemplate(): IState {
		return {
			patternEdit: false,
			position: this.template.position,
			subCategory: this.template.subcategory,
			matchstyle: this.template.matchstyle ? this.template.matchstyle : 0,
			value: this.template.value,
			pattern: this.template.pattern,
			message: ''
		};
	}

	private createDesc(template: Template): void {
		template.description = label("templates.newdescription");
		template.shortdescription = label("templates.newshortdescription");
	}

	private resetEditor(): void {
		this.template = this.createNewTemplate();
		this.canSave = true;
		this.resetcat = true;
		this.setState(this.createStateFromTemplate());
	}

	private save(): void {
		if (this.canSave) {
			var self = this;
			var jsonbody = JSON.stringify(this.template);
			fetch('templates/save', {
				method: 'post',
				body: jsonbody,
				headers: {
					"Content-Type": "application/json"
				}
			}).then((response) => {
				self.setAnswer(response.json());
			});
		}
	}

	private setAnswer(data: any): void {
		var msg: string = data.error;;
		if (!data.error) {
			this.clear();
			this.props.onDetach();
			var msg: string = label("templates.saved");
		}
		this.setState({ message: msg });
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
		this.checkCanSave()
		this.props.onDetach();
	}

	private changeSubCategory(sub: number | undefined) {
		this.resetcat = false;
		if (this.template.subcategory != sub) {
			this.template.subcategory = sub;
			this.checkCanSave()
		}
	}

	private changeRange(timerangedata: TimeRangeData): void {
		this.template.repeatcount = timerangedata.repeatcount;
		this.template.repeatunit = timerangedata.repeatunit;
		this.template.variance = timerangedata.variance;
		this.template.start = timerangedata.startdate;
		this.checkCanSave()
	}

	private changeDescData(descdata: DescData): void {
		this.template.shortdescription = descdata.short;
		this.template.description = descdata.desc;
		this.template.validUntil = descdata.validUntil;
		if (descdata.validFrom != undefined) {
			this.template.validFrom = descdata.validFrom;
		}
		else {
			this.template.validFrom = new Date();
		}
		this.checkCanSave()
	}

	private changePattern(p: Pattern | undefined): void {
		if (p != undefined)
			this.template.pattern = p;
		this.setState(this.createStateFromTemplate())
	}

	private checkCanSave() {
		this.changed = true;
		this.setState(this.createStateFromTemplate())
		this.canSave =
			this.template.subcategory != undefined;
	}

	private renderButton(name: string, dataid: string, func: () => void, disabled: boolean): React.JSX.Element {
		return (
			<button testdata-id={dataid}
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
					{this.renderButton("save", "savebutton", this.save, !this.canSave || !this.changed)}
					{this.renderButton("new", "newbutton", this.clear, false)}
					{this.renderButton("copy", "copybutton", this.copy, this.template.id == undefined)}
					{this.renderButton("delete", "deletebutton", this.delete,
						this.template.id == undefined || this.template.id != 0)}
				</div>
			);
		}
		else {
			return (
				<div>
					{this.renderButton("save", "savebutton",
						this.save, !this.canSave || !this.changed)}
					{this.renderButton("new", "newbutton", this.clear, false)}
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
		return (
			<div testdata-id={"templateeditor"}>
				<label>{this.state.message}</label>
				<DescEditor data={descData} sendData={this.changeDescData} />
				<TimeRangeEditor rangedata={timerange} sendRange={this.changeRange} />
				<PatternEditorButton pattern={this.state.pattern} sendPattern={this.changePattern } />

				<div className={css.boxborder} >
					<div className={css.boxinnerpart} >
						<label className={css.boxlabel} > {label("templates.rating")}</label>
						<table>
							<tbody>
								<tr><td>{label("plan.position")}</td>
									<td><input value={this.state.position}
										type='number'
										className={css.numbersmallinput}
										onChange={(e) => {
											this.template.position = e.target.valueAsNumber;
											this.setState(this.createStateFromTemplate())
										}} />
									</td>
								</tr>
								<tr><td>{label("category")}</td>
									<td colSpan={3}><CategorySelector
										horiz={true}
										clearCategory={this.resetcat}
										onChange={(sub) => this.changeSubCategory(sub)}
										subcategory={this.template.subcategory} />
									</td>
								</tr>
								<tr>
									<td>{label("value")}</td>
									<td><input step="0.01" value={this.state.value / 100}
										type='number'
										className={css.numbersmallinput}
										onChange={(e) => {
											this.template.value = e.target.valueAsNumber * 100;
											this.setState(this.createStateFromTemplate())
										}} />
									</td>
									<td>{label("plan.matchstyle")}</td>
									<td>
										<MatchStyleSelector
											curvalue={this.state.matchstyle}
											className={css.catselector3}
											onChange={(e) => {
												this.template.matchstyle = e;
												this.setState(this.createStateFromTemplate())
											}} />
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div style={{ textAlign: 'center' }}>
					{this.renderButtons()}
				</div >
			</div >
		);
	}
}