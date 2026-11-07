import * as React from 'react'

import { TimeUnitSelector } from '../utils/timeunitselector'
import { ACDayPickerInput } from '../utils/acdaypickerinput'
import { Template } from '../utils/dtos'
import { label, getIntl } from '../utils/misc'

import * as css from '../css/index.css'
import { TimeRangeData, TimeRangeEditor } from '../planing/timerangeeditor'

type SendCallback = (template: TimeRangeData) => void;

interface TimeRangeEditorProps {
	recorddate: Date;
	plandate: Date;
	template: Template;
	sendResult: SendCallback;
	hidden: boolean;
}

interface IState {
	open: boolean
}

export class TimeRangePopupEditor extends React.Component<TimeRangeEditorProps, IState> {

	timeRangeData: TimeRangeData;

	constructor(props: TimeRangeEditorProps) {
		super(props);

		this.createTimeRangeData = this.createTimeRangeData.bind(this);
		this.state = { open: false };
		this.timeRangeData = this.createTimeRangeData()
	}

	componentDidUpdate(prevProps: Readonly<TimeRangeEditorProps>): void {
		if (prevProps.template != this.props.template) {
			this.timeRangeData = this.createTimeRangeData()
			this.setState({ open: false });
		}
	}

	createTimeRangeData(): TimeRangeData {
		return {
			startdate: this.props.plandate,
			variance: this.props.template.variance,
			repeatcount: this.props.template.repeatunit,
			repeatunit: this.props.template.repeatunit
		}
	}

	renderPopup(): React.JSX.Element | null {
		if (this.state.open) {
			return (
				<div style={{
					position: 'fixed',
					zIndex: 4,
					left: '0', top: '0', width: '100%', height: '100%'
				}}>
					<div testdata-id={'timerange.editor'}
						style={{
							margin: '15% auto',
							padding: '20px',
							border: '3px outset #888',
							width: '460px', height: '180px',
							background: 'darkgray'
						}}>
						<TimeRangeEditor rangedata={this.timeRangeData} sendRange={(d: TimeRangeData) => this.timeRangeData = d} />
						<span>
							<button
								style={{ width: '47%' }}
								testdata-id={'timerange.save'}
								className={css.addonbutton}
								onClick={() => { this.setState({ open: false }); this.props.sendResult(this.timeRangeData) }}>
								{label("save")}
							</button>
							<button
								style={{ width: '47%' }}
								testdata-id={'timerange.cancel'}
								className={css.addonbutton}
								onClick={() => { this.setState({ open: false }); }}>
								{label("cancel")}
							</button>
						</span>
					</div>
				</div >)
		}
		else
			return null;
	}

	render(): React.JSX.Element {
		return <div>
			<button onClick={() => this.setState({ open: true })}
				testdata-id={'timerangepopup'}
				className={css.addonbutton}
				hidden={this.props.hidden} >
				{label('assign.adjusttime')}
			</button>
			{this.renderPopup()}
		</div>
	}
}