import React from 'react'
import { PatternEditor } from './patterneditor'
import { ACDayPickerInput } from '../utils/acdaypickerinput'
import { CategorySelector } from '../utils/categoryselector'
import { Template } from '../utils/dtos'
import { MatchStyleSelector } from '../utils/matchstyleselector'
import { myParseJson, label } from '../utils/misc'
import { TimeRangeEditor, TimeRangeData } from './timerangeeditor'
import * as css from '../css/index.css'



type OnChangeCallback = () => void;


interface TemplateEditorProps {
	onDetach: OnChangeCallback;
	accountRecordId?: number;
}

interface IState {
	template: Template;
	message: string;
	patternEdit: boolean;
}


export class TemplateEditor extends React.Component<TemplateEditorProps, IState> {

	template: Template = this.createNewTemplate();

	constructor(props: TemplateEditorProps) {
		super(props);
		this.state = { template: this.template, message: '', patternEdit: false };
		this.clear = this.clear.bind(this);
		this.save = this.save.bind(this);
		this.delete = this.delete.bind(this);
		this.copy = this.copy.bind(this);
		this.setAnswer = this.setAnswer.bind(this);
		this.setTemplate = this.setTemplate.bind(this);
		this.saveRange = this.saveRange.bind(this);
	}

	componentDidMount() {
		if (this.props.accountRecordId != undefined) {
			var self = this;
			fetch('templates/accountrecord/' + this.props.accountRecordId)
				.then(response => response.text())
				.then(t => {
					if (t) {
						let template: Template = myParseJson(t);
						self.createDesc(template);
						self.setTemplate(template)
					}
				});
		}
	}

	createNewTemplate(): Template {
		var template = new Template();
		this.createDesc(template);
		return template;
	}

	createDesc(template: Template): void {
		template.description = label("templates.newdescription");
		template.shortdescription = label("templates.newshortdescription");
	}

	resetEditor(): void {
		this.template = this.createNewTemplate();
		this.setState({ template: this.template });
	}

	setTemplate(template: Template): void {
		if (template == undefined) {
			this.resetEditor();
		}
		else {
			this.template = template;
			this.setState({ template: this.template });
		}
	}

	save(): void {
		var self = this;
		var jsonbody = JSON.stringify(self.state.template);
		fetch('templates/save', {
			method: 'post',
			body: jsonbody,
			headers: {
				"Content-Type": "application/json"
			}
		}).then(function (response) {
			self.setAnswer(response.json());
		});
	}

	setAnswer(data: any): void {
		var msg: string = label("templates.saved");
		this.setState({ message: msg });
		if (!data.error) {
			this.clear();
		}
		this.props.onDetach();
	}

	clear(): void {
		this.props.onDetach();
		this.resetEditor();
	}

	delete(): void {
		if (this.state.template.id != undefined && this.state.template.id != 0) {
			var self = this;
			fetch('templates/delete/' + this.state.template.id, { method: 'get' })
				.then(function (response) { self.setAnswer(response.json()); });
		}
	}

	copy(): void {
		this.template.id = undefined;
		this.template.shortdescription = "copy of " + this.template.shortdescription;
		this.setTemplateState();
		this.props.onDetach();
	}

	setTemplateState(): void {
		this.setState({ patternEdit: false, template: this.template, message: '' });
	}

	setSubCategory(sub: number, cat: number) {
		if (this.template.category != cat || this.template.subcategory != sub) {
			this.template.category = cat;
			this.template.subcategory = sub;
			this.setTemplateState();
		}
	}

	renderButton(): React.JSX.Element {
		if (this.props.accountRecordId == undefined) {
			return (
				<div>
					<button className={css.addonbutton} onClick={this.save}>{label("save")}</button>
					<button className={css.addonbutton} onClick={this.clear}>{label("new")}</button>
					<button className={css.addonbutton} onClick={this.copy}>{label("copy")}</button>
					<button className={css.addonbutton} onClick={this.delete}>{label("delete")}</button>
				</div>
			);
		}
		else {
			return (
				<div>
					<button className={css.addonbutton} onClick={this.save}>{label("save")}</button>
					<button className={css.addonbutton} onClick={this.clear}>{label("back")}</button>
				</div>
			);
		}
	}

	saveRange(timerangedata: TimeRangeData): void {
		this.template.repeatcount = timerangedata.repeatcount;
		this.template.repeatunit = timerangedata.repeatunit;
		this.template.variance = timerangedata.variance;
		this.template.start = timerangedata.startdate;
	}

	render(): React.JSX.Element {

		var timerange: TimeRangeData = {
			repeatcount: this.template.repeatcount,
			repeatunit: this.template.repeatunit,
			variance: this.template.variance,
			startdate: this.template.start
		}
		return (
			<div>
				<label>{this.state.message}</label>
				<div className={css.boxborder} >
					<div className={css.boxinnerpart} >
						<label className={css.boxlabel} > {label("templates.templatedata")}</label>
						<table>
							<tbody style={{ verticalAlign: 'top' }} >
								<tr><td>{label("shortdescription")}</td>
									<td colSpan={3} >
										<input className={css.stringinput}
											value={this.state.template.shortdescription} type='text'
											onChange={(e) => { this.template.shortdescription = e.target.value; this.setTemplateState() }} />
									</td>
								</tr>
								<tr><td>{label("description")}</td>
									<td colSpan={3} ><textarea cols={38} rows={3}
										className={css.stringinput}
										value={this.state.template.description}
										onChange={(e) => { this.template.description = e.target.value; this.setTemplateState() }} />
									</td>
								</tr>
								<tr><td>{label("templates.validfrom")}</td>
									<td><ACDayPickerInput
										onChange={(d) => { this.template.validFrom = d; this.setTemplateState() }}
										startdate={this.state.template.validFrom} />
									</td>
									<td>{label("templates.validuntil")}</td>
									<td><ACDayPickerInput
										onChange={(d) => { this.template.validUntil = d; this.setTemplateState() }}
										startdate={this.state.template.validUntil} />
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div className={css.boxborder} >
					<div className={css.boxinnerpart} >
						<label className={css.boxlabel} > {label("templates.timerange")}</label>
						<TimeRangeEditor rangedata={timerange}
							sendRange={this.saveRange}
						/>
					</div>
				</div >
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
							<tbody>
								<tr><td>{label("plan.position")}</td>
									<td><input value={this.state.template.position}
										type='number'
										className={css.numbersmallinput}
										onChange={(e) => { this.template.position = e.target.valueAsNumber; this.setTemplateState() }} />
									</td>
								</tr>
								<tr><td>{label("category")}</td>
									<td colSpan={3}><CategorySelector
										horiz={true}
										onChange={(s, c) => this.setSubCategory(s, c)}
										subcategory={this.state.template.subcategory} />
									</td>
								</tr>
								<tr>
									<td>{label("value")}</td>
									<td><input step="0.01" value={this.state.template.value / 100}
										type='number'
										className={css.numbersmallinput}
										onChange={(e) => { this.template.value = e.target.valueAsNumber * 100; this.setTemplateState() }} />
									</td>
									<td>{label("plan.matchstyle")}</td>
									<td>
										<MatchStyleSelector
											curvalue={this.state.template.matchstyle}
											className={css.catselector3}
											onChange={(e) => { this.template.matchstyle = e; this.setTemplateState() }} />
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div style={{ textAlign: 'center' }}>
					{this.renderButton()}
					{
						this.state.patternEdit ?
							<PatternEditor
								zIndex={1}
								pattern={this.state.template.pattern}
								sendPattern={(e) => {
									if (e != undefined)
										this.template.pattern = e;
									this.setTemplateState()
								}}
							/>
							: null
					}
				</div >
			</div >
		);
	}
}