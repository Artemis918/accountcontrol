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
	testdataid?: string;
}

interface IState {
	dateString: string;
	date: Date | undefined;
}

export class ACDayPickerInput extends React.Component<ACDayPickerProps, IState> {

	locale: Locale;
	popupRef: React.RefObject<PopupActions | null> = createRef<PopupActions>()

	constructor(props: ACDayPickerProps) {
		super(props);
		this.locale = getIntl().locale == 'de' ? de : enGB;
		this.state = { dateString: this.formatDate(props.startdate), date: props.startdate };

		this.renderDayPicker = this.renderDayPicker.bind(this);
		this.parseNewDate = this.parseNewDate.bind(this);
		this.setNewDate = this.setNewDate.bind(this);
	}

	componentDidUpdate(prevProps: Readonly<ACDayPickerProps>, prevState: Readonly<IState>): void {
		if (prevProps.startdate != this.props.startdate) {
			this.setState({ dateString: this.formatDate(this.props.startdate), date: this.props.startdate });
		}
	}

    private formatDate(d: Date | undefined): string {
		if (d == undefined) {
			return "--.--.----";
		}
		else {
			return format(d, 'P', { locale: this.locale });
		}
	}

	parseNewDate(): void {
		var parsed: Date | undefined= parse(this.state.dateString, 'P', new Date(), { locale: this.locale });
		if (parsed == undefined || isNaN(parsed.getTime()) || parsed.getFullYear() < 1970) {
			this.setState({ dateString: this.formatDate(this.props.startdate), date: this.props.startdate });
		}
		else if ( parsed != this.state.date ) {
			this.setState({ date: parsed });
			this.props.onChange(parsed);
		}
	}

	setNewDate(d: Date ): void {
		if (d != this.state.date) {
			this.setState({ dateString: this.formatDate(d), date: d });
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
					testdata-id={this.props.testdataid}
					type="text"
					value={this.state.dateString}
					onChange={(e) => this.setState({ dateString: e.target.value })}
					onBlur={() => this.parseNewDate()}
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