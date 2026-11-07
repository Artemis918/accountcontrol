import * as React from 'react'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { MonthSelect } from '../utils/monthselect'
import { Plan, Pattern, Template, postRequest, AccountRecord, fetchJson } from '../utils/dtos'
import { PatternEditor } from '../planing/patterneditor'
import { TimeRangePopupEditor } from './timerangepopupeditor'
import { label } from '../utils/misc'

import * as css from '../css/index.css'
import * as pcss from './css/planselect.css'
import { TimeRangeData } from '../planing/timerangeeditor'
import { PatternEditorButton } from '../planing/patterneditorpopup'
import { format } from 'date-fns'

export type OnPlanChange = (plan: Plan) => void;

export interface PlanSelectProps {
	onChange: OnPlanChange;
	record: AccountRecord;
	planId?: number;
}

interface IState {
	patternfailed: boolean;
	timerangefailed: boolean;
	patterneditor: boolean;
	propsPlan: Plan | undefined;
	month: number;
	year: number
}

export class PlanSelect extends React.Component<PlanSelectProps, IState> {

	columns: ColumnInfo<Plan>[];
	lister: SingleSelectLister<Plan> | null;
	currentPlan: Plan | undefined = undefined;
	currentTemplate: Template | undefined = undefined;

	constructor(props: PlanSelectProps) {
		super(props);


		var date: Date = new Date();
		if (this.props.record != undefined) {
			date = this.props.record.executed;
		}

		this.state = {
			patternfailed: false,
			timerangefailed: false,
			patterneditor: false,
			propsPlan: undefined,
			year: date.getFullYear(),
			month: date.getMonth() + 1,
		};

		this.lister = null;
		this.setFilter = this.setFilter.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.setPattern = this.setPattern.bind(this);
		this.settimerange = this.settimerange.bind(this);
		this.getPropsPlanArray = this.getPropsPlanArray.bind(this);

		this.columns = [{
			header: label("date"),
			getdata: (p: Plan): string => { return p.plandate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) }
		}, {
			header: label("details"),
			getdata: (p: Plan): string => { return p.shortdescription }
		}, {
			header: label("value"),
			cellrender: (cell: CellInfo<Plan>): React.JSX.Element => {
				return (
					<div style={{
						color: cell.data.value >= 0 ? 'green' : 'red',
						textAlign: 'right'
					}}>
						{(cell.data.value / 100).toFixed(2)}
					</div>
				)
			}
		}]
	}

	componentDidMount(): void {
		var date: Date = new Date();
		if (this.props.planId != undefined) {
			var self = this;
			fetchJson('plans/id/' + this.props.planId,
				(plan: Plan) => {
					var date = plan.plandate
					self.setState({
						year: date.getFullYear(),
						month: date.getMonth() + 1,
						propsPlan: plan
					});
					this.handleChange(plan);
				}
			)
		}
	}

	setFilter(m: number, y: number): void {
		this.setState({ year: y, month: m })
	}

	setAnaylzeData(template: Template): void {
		this.currentTemplate = template;
		this.setState({
			timerangefailed: template.additional[1] == '1',
			patternfailed: template.additional[0] == '1',
		})
	}

	handleChange(plan: Plan): void {
		var self: PlanSelect = this;
		this.currentPlan = plan;
		if (this.props.onChange)
			this.props.onChange(plan);

		fetchJson("assign/analyze/" + this.props.record.id + "/" + plan.id,
			(r) => { self.setAnaylzeData(r) })
	}

	setPattern(p: Pattern | undefined): void {
		if (this.currentPlan != undefined && p != undefined) {
			this.currentPlan.pattern = p;
			postRequest('templates/changepattern', this.currentPlan, () => { });
		}
		this.setState({ patterneditor: false });
	}

	getPropsPlanArray(): Plan[] {
		console.log("planselect getPropsPlanArray: " + this.state.propsPlan?.id);
		if (this.state.propsPlan == undefined)
			return [];

		var curdate: Date = this.state.propsPlan.plandate;
		if (curdate.getFullYear() != this.state.year || curdate.getMonth() + 1 != this.state.month) {
			return [];
		}
		console.log("planselect getPropsPlanArray delivered: " + this.state.propsPlan?.id);
		return [this.state.propsPlan];
	}

	settimerange(timerangedata: TimeRangeData): void {
		var timestring: string = format(timerangedata.startdate, "ddMMyyyy");
		fetch('templates/changetimerange/' + this.currentPlan?.id + '/' + timestring + '/' + timerangedata.variance);
	}


	renderAdjustButtons(): React.JSX.Element | null {
		if (this.currentPlan && this.currentTemplate) {
			return (
				<p className={pcss.adjustbody}>
					<table>
						<tbody>
							<tr>
								<td className={pcss.adjustlabel}> {label("assign.adjust")}  </td>
								<td>
									<PatternEditorButton 
										hidden={!this.state.patternfailed}
										pattern={this.currentPlan.pattern}
										sendPattern={(p: Pattern | undefined) => this.setPattern(p)}
										decorateButton={false}
										label={label("assign.adjustpattern")}/>
								</td>
								<td>
									<TimeRangePopupEditor
										recorddate={this.currentTemplate.start}
										plandate={this.currentPlan.plandate}
										template={this.currentTemplate}
										sendResult={this.settimerange}
										hidden={!this.state.timerangefailed} />
								</td>
							</tr>
						</tbody>
					</table>
				</p>
			)
		}
		else
			return null;
	}

	render(): React.JSX.Element {

		return (
			<div testdata-id={"planselect"}>
				<MonthSelect label='' year={this.state.year} month={this.state.month} onChange={this.setFilter} />
				<div className={pcss.planselectbody}>
					<SingleSelectLister<Plan>
						ext={this.state.year + '/' + this.state.month}
						testdata-id={'planlister'}
						url='plans/unassigned/'
						extendedData={this.getPropsPlanArray().length > 0 ? this.getPropsPlanArray : undefined}
						lines={12}
						handleChange={this.handleChange}
						columns={this.columns}
						value={this.state.propsPlan}
						isEqualValue={(p1: Plan, p2: Plan) => { return p1.id == p2.id }}
						ref={(ref) => { this.lister = ref }} />
					{this.renderAdjustButtons()}
				</div>
			</div>
		)
	}
}