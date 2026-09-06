import React, { createRef } from 'react'
import { DayPicker } from 'react-day-picker';
import Popup from 'reactjs-popup';
import { parse, format, Locale } from 'date-fns';
import { enGB, de } from 'date-fns/locale'
import * as css from '../css/index.css';
import * as dpcss from './css/acdaypicker.css'
import { PopupActions } from 'reactjs-popup/dist/types';
import { getIntl } from './misc';


export type OnACDayPickerCallback = (date: Date) => void;

export interface ACDayPickerProps {
	startdate?: Date;
	onChange: OnACDayPickerCallback;
}

interface IState {
	date?: Date;
	dateString: string;

}

export class ACDayPickerInput extends React.Component<ACDayPickerProps, IState> {

	locale: Locale;
	popupRef: React.RefObject<PopupActions | null> = createRef<PopupActions>()

	constructor(props: ACDayPickerProps) {
		super(props);
		this.locale = getIntl().locale == 'de' ? de : enGB;
		this.state = { date: props.startdate, dateString: "" };
		
		this.renderDayPicker = this.renderDayPicker.bind(this);
		this.parseNewDate = this.parseNewDate.bind(this);
		this.setNewDate = this.setNewDate.bind(this);
		this.setStateDate = this.setStateDate.bind(this);

		this.setStateDate(this.props.startdate);
	}

	componentDidUpdate(prevProps: Readonly<ACDayPickerProps>, prevState: Readonly<IState>): void {
			this.setStateDate(this.props.startdate);
	}

	parseNewDate(newdate: string): void {
		const parsed: Date = parse(newdate, 'P', new Date(), { locale: this.locale });
		if (parsed == undefined || isNaN(parsed.getTime()) || parsed.getFullYear() < 1970) {
			return undefined;
		}
		if (parsed != this.state.date) {
			this.setState({ date: parsed })
			this.props.onChange(parsed);
		}
	}

	setStateDate(d: Date | undefined): boolean {
		var datestring: string = "--.--.----";
		if (d != undefined) {
			datestring = format(d, 'P', { locale: this.locale })
		}

		if (datestring != this.state.dateString) {
			this.setState({ dateString: datestring });
			return true;
		}
		return false;
	}

	setNewDate(d: Date): void {
		if (this.setStateDate(d)) {
			this.props.onChange(d);
		}
	}

	renderDayPicker(): React.JSX.Element {
		return (
			<div className={dpcss.overlay}>
				<DayPicker
					mode='single'
					required={true}
					onSelect={(d: Date) => { this.setNewDate(d); this.popupRef.current?.close() }}
					selected={this.state.date}
				/>
			</div>)

	}

	render(): React.JSX.Element {
		return (
			<div>
				<input
					value={this.state.dateString}
					onChange={(e) => this.parseNewDate(e.target.value)}
					className={css.stringinput}
					size={11}
				/>
				<Popup
					trigger={<button>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar3" viewBox="0 0 16 16">
							<path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
							<path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
						</svg>
					</button>}
					position="bottom right"
					ref={this.popupRef}
				>
					{this.renderDayPicker()}
				</Popup>
			</div>
		);
	}
}