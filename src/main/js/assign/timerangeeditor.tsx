import * as React from 'react'
import { IntlShape } from 'react-intl'

import { TimeUnitSelector } from '../utils/timeunitselector'
import { ACDayPickerInput } from '../utils/acdaypickerinput'
import { Template } from '../utils/dtos'

import css from '../css/index.css'

type SendCallback = (template: Template) => void;

interface TimeRangeEditorProps {
	recorddate: Date;
	plandate: Date;
	template: Template;
	sendResult: SendCallback;
	intl: IntlShape;
	zIndex: number;
}

interface IState {
	plandate: Date;
	variance: number;
	count: number;
	unit: number;
	hovertext: string;
	hoverleft: number;
	hovertop: number;
}

export class TimeRangeEditor extends React.Component<TimeRangeEditorProps, IState> {

	constructor(props: TimeRangeEditorProps) {
		super(props);
		this.state = {
			plandate: props.plandate,
			variance: props.template.variance,
			count: props.template.repeatcount,
			unit: props.template.repeatunit,
			hovertext: undefined,
			hoverleft: 0,
			hovertop: 0
		};
		this.send = this.send.bind(this);
		this.setHovertext = this.setHovertext.bind(this);
		this.copyDate = this.copyDate.bind(this);
	}

	label(labelid: string): string { return this.props.intl.formatMessage({ id: labelid }) }

	send(): void {
		var template: Template = new Template();
		template.start = this.state.plandate;
		template.variance = this.state.variance;
		template.repeatunit = this.state.unit;
		template.repeatcount = this.state.count;
		this.props.sendResult(template);
	}

	copyDate(): void {
		this.setState({ plandate: this.props.template.start });
	}

	setHovertext(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, date: Date): void {
		var text: string = this.props.intl.formatDate(date);
		this.setState({
			hovertext: text,
			hoverleft: e.clientX + 5,
			hovertop: e.clientY + 5
		})
	}

	renderHovertext(): React.JSX.Element {
		if (this.state.hovertext != undefined) {
			return (
				<div className={css.hoverbox}
					style={{ zIndex: this.props.zIndex + 1, left: this.state.hoverleft, top: this.state.hovertop }}>
					{this.state.hovertext}
				</div>
			);
		}
		else {
			return null;
		}
	}

	render(): React.JSX.Element {
		return (
			<div style={{
				position: 'fixed',
				zIndex: this.props.zIndex,
				left: '0', top: '0', width: '100%', height: '100%'
			}}>
				<div testdata-id={'timerange.editor'}
					style={{
						margin: '15% auto',
						padding: '20px',
						border: '3px outset #888',
						width: '420px', height: '140px',
						background: 'darkgray'
					}}>
					<table>
						<tbody>
							<tr style={{ background: 'darkgray' }}><td>{this.label("templates.repetition")}</td>
								<td>
									<span style={{ width: '20%' }}>
										<input className={css.numbersmallinput}
											value={this.state.count}
											type='number'
											onChange={(e) => { this.setState({ count: e.target.valueAsNumber }) }} />
									</span>
									<span style={{ width: '20%' }}>
										<TimeUnitSelector
											className={css.catselector3}
											curvalue={this.state.unit}
											onChange={(e) => { this.setState({ unit: e }) }}
										/>
									</span>
								</td>
							</tr>
							<tr style={{ background: 'darkgray' }}><td>{this.label("templates.firstday")}</td>
								<td><ACDayPickerInput
									onChange={(d) => { this.setState({ plandate: d }) }}
									startdate={this.state.plandate}
									locale={this.props.intl.locale} />
									<button className={css.charbutton}
										onMouseEnter={(e) => this.setHovertext(e, this.props.template.start)}
										onMouseLeave={() => this.setState({ hovertext: undefined })}
										onSelect={() => this.copyDate()}>?</button>
								</td>
							</tr>
							<tr style={{ background: 'darkgray' }}><td>{this.label("templates.variance")}</td>
								<td><input value={this.state.variance}
									className={css.numbersmallinput}
									type='number'
									onChange={(e) => { this.setState({ variance: e.target.valueAsNumber }) }} />
								</td>
							</tr>
						</tbody>
					</table>
					<span>
						<button style={{ width: '47%' }} className={css.addonbutton}
							onClick={this.send}>
							{this.label("save")}
						</button>
						<button style={{ width: '47%' }}
							className={css.addonbutton}
							onClick={() => this.props.sendResult(undefined)}>
							{this.label("cancel")}
						</button>
					</span>
				</div>
				{this.renderHovertext()}
			</div >
		);
	}
}