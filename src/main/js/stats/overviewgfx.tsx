import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from 'recharts';
import { MonthSelect } from '../utils/monthselect'
import { StatsDTO, StatsMonthDTO } from '../utils/dtos'
import { myParseJson } from '../utils/misc'
import { useIntl, WrappedComponentProps } from 'react-intl';

type Create = (props: OverviewGFXProps) => JSX.Element;
export const OverviewGFX: Create = (p) => { return (<_OverviewGFX {...p} intl={useIntl()} />); }

export interface OverviewGFXProps { }

interface GraphData {
	month: string;
	value: number;
}

interface GraphSeries {
	name: string;
	color: string;
	data: GraphData[];
}

interface IState {
	startYear: number;
	endYear: number;
	startMonth: number;
	endMonth: number;
	rangemin: number;
	rangemax: number;
	graphdata: GraphSeries[];
}

export class _OverviewGFX extends React.Component<OverviewGFXProps & WrappedComponentProps, IState> {

	constructor(props: OverviewGFXProps & WrappedComponentProps) {
		super(props);
		var today: Date = new Date();
		this.state = {
			startYear: today.getFullYear(),
			endYear: today.getFullYear(),
			startMonth: 1,
			endMonth: 12,
			graphdata: [],
			rangemin: -2000,
			rangemax: 4000
		}
		this.reload = this.reload.bind(this);
		this.setData = this.setData.bind(this);
		this.changeEnd = this.changeEnd.bind(this);
		this.changeStart = this.changeStart.bind(this);
	}

	label(labelid: string): string { return this.props.intl.formatMessage({ id: labelid }) }

	public componentDidMount(): void {
		this.reload(this.state.startYear, this.state.startMonth, this.state.endYear, this.state.endMonth);
	}

	public render(): JSX.Element {
		return (<div>
			<table>
				<tr>
					<td>
						<table >
						<tbody>
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
						</tbody>
						</table >
						<LineChart
							width={1000}
							height={500}
							margin={{
								top: 5, right: 30, left: 20, bottom: 5,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="month" type="category" allowDuplicatedCategory={false} />
							<YAxis />
							<Tooltip />
							<Legend />
							{this.state.graphdata.map(s => (
								<Line type="monotone" stroke={s.color} activeDot={{ r: 8 }} dataKey="value" data={s.data} name={s.name} key={s.name} />
							))}
						</LineChart>
					</td>
				</tr>
			</table>
		</div>
		)
	}

	private reload(startYear: number, startMonth: number, endYear: number, endMonth: number): void {

		this.setState({ endYear: endYear, endMonth: endMonth, startYear: startYear, startMonth: startMonth });
		var self: _OverviewGFX = this;
		var url: string = "stats/real/" + startYear + "/" + startMonth + "/" + endYear + "/" + endMonth + "/true";

		fetch(url)
			.then((response: Response) => response.text())
			.then((text) => { self.setData(myParseJson(text)) })
	}

	private setData(stats: StatsDTO): void {
		var plandata: GraphData[] = [];
		var forecastdata: GraphData[] = [];
		var realdata: GraphData[] = [];
		var statsdata: StatsMonthDTO[] = stats.data;

		for (var i: number = 0; i < statsdata.length; i++) {

			var stat = statsdata[i];
			var month: string = stat.day.toLocaleDateString(undefined, { year: "2-digit", month: "short" });

			if (stat.forecast != 0) {
				forecastdata.push({ month: month, value: stat.forecast / 100 })
			}

			plandata.push({ month: month, value: stat.planvalue / 100 });
			if (stat.value != 0) {
				realdata.push({ month: month, value: stat.value / 100 });
			}
		}

		var minval: number = Math.floor(stats.min / 10000) * 100;
		var maxval: number = Math.ceil(stats.max / 10000) * 100;
		this.setState({
			graphdata: [
				{ name: "Plan", data: plandata, color: "black" },
				{ name: "Forecast", data: forecastdata, color: "green" },
				{ name: "Real", data: realdata, color: "red" }
			],
			rangemin: minval,
			rangemax: maxval
		}
		);
	}

	private changeStart(month: number, year: number): void {
		this.reload(year, month, this.state.endYear, this.state.endMonth);
	}

	private changeEnd(month: number, year: number): void {
		this.reload(this.state.startYear, this.state.startMonth, year, month);
	}
}