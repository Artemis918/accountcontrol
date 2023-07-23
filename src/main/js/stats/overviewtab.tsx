import * as React from 'react'
import { useIntl, WrappedComponentProps } from 'react-intl';
import { MonthSelect } from '../utils/monthselect';
import { StatsDTO } from '../utils/dtos';
import { myParseJson } from '../utils/misc'

type Create = (props:OverviewTabProps) => JSX.Element;
export const OverviewTab:Create = (p) => {return (<_OverviewTab {...p} intl={useIntl()}/>); }

export interface OverviewTabProps {
}

interface dataset{
	plan: number
	real: number
 }

interface IState {
	startYear: number;
	endYear: number;
	startMonth: number;
	endMonth: number;
	data: dataset[]; 
}
	

class _OverviewTab extends React.Component<OverviewTabProps & WrappedComponentProps, IState> {
	constructor(props: OverviewTabProps & WrappedComponentProps) {
		super(props);
			var today: Date = new Date();
		this.state = {
			startYear: today.getFullYear(),
			endYear: today.getFullYear(),
			startMonth: 1,
			endMonth: 12,
			data: []
		};
		
		this.reload = this.reload.bind(this);
		this.setData = this.setData.bind(this);
		this.changeEnd = this.changeEnd.bind(this);
		this.changeStart = this.changeStart.bind(this);
	}
	
	label(labelid: string): string { return this.props.intl.formatMessage({ id: labelid }) }
	
    public componentDidMount(): void {
		this.reload(this.state.startYear, this.state.startMonth, this.state.endYear, this.state.endMonth);
	}

	render(): JSX.Element {
		return (
		<div>
			<table >
				<tr>
					<td>{this.label("overview.firstmonth")}</td>
					<td>
						<MonthSelect label="" onChange={this.changeStart} year={this.state.startYear} month={this.state.startMonth} />
					</td>
				</tr>
				<tr>
					<td> {this.label("overview.lastmonth")} </td>
					<td>
						<MonthSelect label="" onChange={this.changeEnd} year={this.state.endYear} month={this.state.endMonth} />
					</td>
				</tr>
			</table >
		</div>	
		)
	}
	
	private reload(startYear: number, startMonth: number, endYear: number, endMonth: number): void {

		this.setState({ endYear: endYear, endMonth: endMonth, startYear: startYear, startMonth: startMonth });
		var self: _OverviewTab = this;
		var url: string = "stats/real/" + startYear + "/" + startMonth + "/" + endYear + "/" + endMonth + "/false";

		fetch(url)
			.then((response: Response) => response.text())
			.then((text) => { self.setData(myParseJson(text)) })
	}

	private setData(stats: StatsDTO): void {
	}

	private changeStart(month: number, year: number): void {
		this.reload(year, month, this.state.endYear, this.state.endMonth);
	}

	private changeEnd(month: number, year: number): void {
		this.reload(this.state.startYear, this.state.startMonth, year, month);
	}
}