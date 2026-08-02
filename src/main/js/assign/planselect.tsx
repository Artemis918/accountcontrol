import * as React from 'react'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { MonthSelect } from '../utils/monthselect'
import { Plan, Pattern, Template, postRequest, AccountRecord, fetchJson } from '../utils/dtos'
import { useIntl, WrappedComponentProps } from 'react-intl'
import { PatternEditor } from '../planing/patterneditor'
import { TimeRangeEditor } from './timerangeeditor'

import * as css from '../css/index.css'
import * as pcss from './css/planselect.css'


type Create = (props: PlanSelectProps) => React.JSX.Element;
export const PlanSelect: Create = (p) => { return (<_PlanSelect {...p} intl={useIntl()} />); }

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
	timerangeeditor: boolean;
	propsPlan: Plan | undefined;
	month: number;
	year: number
}

export class _PlanSelect extends React.Component<PlanSelectProps & WrappedComponentProps, IState> {

	columns: ColumnInfo<Plan>[];
	lister: SingleSelectLister<Plan> | null;
	currentPlan: Plan | undefined = undefined;
	currentTemplate: Template | undefined = undefined;

	constructor(props: PlanSelectProps & WrappedComponentProps) {
		super(props);

		
		var date: Date = new Date();
		if (this.props.record != undefined) {
			date = this.props.record.executed;
		}

		this.state = {
			patternfailed: false,
			timerangefailed: false,
			patterneditor: false,
			timerangeeditor: false,
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
			header: this.label("date"),
			getdata: (p: Plan): string => { return p.plandate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) }
		}, {
			header: this.label("details"),
			getdata: (p: Plan): string => { return p.shortdescription }
		}, {
			header: this.label("value"),
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
					console.log("planselect propsplan arrived: " + plan.id);
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

	label(labelid: string): string { return this.props.intl.formatMessage({ id: labelid }); }

	setFilter(m: number, y: number): void {
		this.setState({ year: y, month: m })
	}

	setAnaylzeData(template: Template): void {
		this.currentTemplate = template;
		console.log("planselect analyze: " + (template?.additional[0] == '1'));
		this.setState({
			// TODO implemtn backend	timerangefailed: template.additional[1] == '1',
			timerangefailed: false,
			patternfailed: template.additional[0] == '1',
		})
	}

	handleChange(plan: Plan): void {
		var self: _PlanSelect = this;
		console.log("planselect handlechange: " + plan.id);
		this.currentPlan = plan;
		if (this.props.onChange)
			this.props.onChange(plan);

		fetchJson("assign/analyze/" + this.props.record.id + "/" + plan.id,
			(r) => { self.setAnaylzeData(r) })
	}

	setPattern(p: Pattern): void {
		if (this.currentPlan != undefined && p != undefined) {
			this.currentPlan.patterndto = p;
			postRequest('templates/changepattern', this.currentPlan, () => { });
		}
		this.setState({ patterneditor: false });
	}

	getPropsPlanArray() : Plan[] {
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

	settimerange(template: Template): void {
		// TODO implemtn backend
		// fetch('templates/changetimerange/{planId}/{timestring}/{variance}');
		// this.setState({ timerangeeditor: false });
	}


	renderAdjustButtons(): React.JSX.Element {
		return (
			<p className={pcss.adjustbody}>
				<table>
					<tbody>
						<tr>
							<td className={pcss.adjustlabel}> {this.label("assign.adjust")}  </td>
							<td>
								<button onClick={() => this.setState({ patterneditor: true })}
									testdata-id={'assign.adjustpattern'}
									className={css.addonbutton}
									hidden={!this.state.patternfailed}>
									{this.label('assign.adjustpattern')}
								</button>
							</td>
							<td>
								<button onClick={() => this.setState({ timerangeeditor: true })}
									testdata-id={'assign.adjusttime'}
									className={css.addonbutton}
									hidden={!this.state.timerangefailed}>
									{this.label("assign.adjusttime")}
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</p>
		);
	}


	renderPatternEditor(): React.JSX.Element {
		if (this.state.patterneditor && this.currentPlan) {
			return (<PatternEditor intl={this.props.intl}
				pattern={this.currentPlan.patterndto}
				sendPattern={(p: Pattern) => this.setPattern(p)}
				zIndex={4} />);
		}
		else {
			return <></>;
		}
	}

	renderTimRangeEditor(): React.JSX.Element {
		if (this.state.timerangeeditor && this.currentTemplate && this.currentPlan) {
			return (<TimeRangeEditor
				recorddate={this.currentTemplate.start}
				plandate={this.currentPlan.plandate}
				template={this.currentTemplate}
				sendResult={this.settimerange}
				intl={this.props.intl}
				zIndex={4} />);
		}
		else {
			return <></>;
		}
	}

	render(): React.JSX.Element {
		console.log("planselect render: " + this.currentPlan?.id);
		return (
			<div testdata-id={"planselect"}>
				<MonthSelect label='' year={this.state.year} month={this.state.month} onChange={this.setFilter} />
				<div className={pcss.planselectbody}>
					<SingleSelectLister<Plan>
						ext={this.state.year + '/' + this.state.month}
						testdata-id={'planlister'}
						url='plans/unassigned/'
						extendedData= {this.getPropsPlanArray().length > 0 ? this.getPropsPlanArray : undefined}
						lines={12}
						handleChange={this.handleChange}
						columns={this.columns}
						value={this.state.propsPlan}
						isEqualValue={(p1: Plan, p2: Plan) => { return p1.id == p2.id }}
						ref={(ref) => { this.lister = ref }} />
					{this.renderAdjustButtons()}
				</div>
				{this.renderPatternEditor()}
				{this.renderTimRangeEditor()}
			</div>
		)
	}
}