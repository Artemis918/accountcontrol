import * as React from 'react'
import { useIntl, WrappedComponentProps } from 'react-intl';
import { MonthSelect } from '../utils/monthselect';
import { StatsDTO } from '../utils/dtos';
import { CatStatsDTO } from '../utils/dtos';
import { myParseJson } from '../utils/misc'
import * as mcss from './css/overviewtab.css'

type Create = (props:OverviewTabProps) => JSX.Element;
export const OverviewTab:Create = (p) => {return (<_OverviewTab {...p} intl={useIntl()}/>); }

export interface OverviewTabProps {
}

interface CatDataset {
	name: string;
	id: number;
	datasets: Dataset[]; 
}

interface Dataset {
	plan: number
	real: number
}

interface IState {
	startYear: number;
	endYear: number;
	startMonth: number;
	endMonth: number;
	sumdata: Dataset[];
	catdata: CatDataset[];
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
			sumdata: [],
			catdata:[] 
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
			</table>
			<table>
			<thead>
				<tr>
					{this.renderHeader(this.state.startMonth,this.state.startYear, this.state.endMonth,this.state.endYear,this.props.intl.locale)}
				</tr>
			</thead>
			<tbody>
				<tr>
					{this.renderValues(this.label("overview.overall"),this.state.sumdata)}
				</tr>
				{this.renderCatValues(this.state.catdata)}
			</tbody>
			</table>
		</div>	
		)
	}
	
	private renderHeader(startmonth: number, startyear: number, endmonth: number, endyear: number, locale: string): JSX.Element[] {
		var header: JSX.Element[]= [];
		var curmonth = startmonth;
		var curyear = startyear;
		header.push(
			<th>{this.label("category")}</th>
		)
			
		while ( curyear < endyear || (curyear == endyear && curmonth <= endmonth)) {
			const date:Date = new Date(curyear,curmonth-1,1);
			const month:string = date.toLocaleString(locale, { month: 'short'});
			const year = curyear % 100;
			header.push(
				<th>
					{month}.{year}
				</th>
			)
			curmonth++;
			if (curmonth > 12 ) {
				curmonth = 1;
				curyear++;
			}
		}
		return header;
	}
	
	private renderValue(value: Dataset): JSX.Element {
		var style:string = ((value.real - value.plan) >= 0 || (value.plan == 0 ) || (value.real == 0)) ? mcss.positiv: mcss.negative;
		return (
			<td className={style}>
			<div>
			  <span className={mcss.plantext}>{value.plan}</span> / <span className={mcss.realtext}>{value.real}</span>
			</div>
			<div className={mcss.sumtext}> {value.real - value.plan} </div>
			</td>
		)
	}
	
	private renderValues(label:string, data: Dataset[]): JSX.Element[] {
		var values: JSX.Element[]= [];
		values.push(<td>{label}</td>);
		for (var i: number = 0; i < data.length; i++) {
			values.push(this.renderValue(data[i]));
		} 
		return values;
	}
	
	private renderCatValues(catdata:CatDataset[]) : JSX.Element[] {
		return catdata.map((c)=>{
			return ( <tr> {this.renderValues(c.name,c.datasets)} </tr>);
		})
	}
	
	private reload(startYear: number, startMonth: number, endYear: number, endMonth: number): void {

		this.setState({ endYear: endYear, endMonth: endMonth, startYear: startYear, startMonth: startMonth });
		var self: _OverviewTab = this;
		var time: string = startYear + "/" + startMonth + "/" + endYear + "/" + endMonth;

		fetch("stats/real/" + time + "/false")
			.then((response: Response) => response.text())
			.then((text) => { self.setData(myParseJson(text)) })

		fetch("stats/catstats/" + time + "/false")
			.then((response: Response) => response.text())
			.then((text) => { self.setCatData(myParseJson(text)) })			
	}

	private setData(stats: StatsDTO): void {
		this.setState({ sumdata:
			stats.data.map(
				(s) => { 
					return {
						plan:Math.trunc(s.planvalue/100), 
						real: Math.trunc(s.value/100)
					}
				}
			)
		})
	}	

	private setCatData(stats: CatStatsDTO[]): void {
		this.setState({catdata: 
			stats.map(
				(c) => { 
					return {
						name: c.catName,
			  			id: c.catID,
			 			datasets: c.estimated.map(
							(d,i)=>{ 
								return {
									plan: Math.trunc(d/100), 
									real: Math.trunc(c.real[i]/100)
								}
							}
						)
					}
				}
			)
		})
	}

	private changeStart(month: number, year: number): void {
		this.reload(year, month, this.state.endYear, this.state.endMonth);
	}

	private changeEnd(month: number, year: number): void {
		this.reload(this.state.startYear, this.state.startMonth, year, month);
	}
}