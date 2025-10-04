import * as React from 'react'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { MonthSelect } from '../utils/monthselect'
import { Plan, Pattern, Template, postRequest, AccountRecord } from '../utils/dtos'
import { useIntl, WrappedComponentProps } from 'react-intl'
import { PatternEditor } from '../planing/patterneditor'
import { TimeRangeEditor } from './timerangeeditor'
import { myParseJson } from '../utils/misc'

import css from '../css/index.css'



type Create = (props: PlanSelectProps) => React.JSX.Element;
export const PlanSelect: Create = (p) => { return (<_PlanSelect {...p} intl={useIntl()} />); }

export type OnPlanChange = (plan: Plan | undefined) => void;

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
	template: Template | null;
	currentPlan: Plan | undefined;
	month: number;
	year: number
}

export class _PlanSelect extends React.Component<PlanSelectProps & WrappedComponentProps, IState> {

	columns: ColumnInfo<Plan>[];
	lister: SingleSelectLister<Plan> | null;

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
			template: null,
			currentPlan: undefined,
			year: date.getFullYear(),
			month: date.getMonth() + 1,
		};

		this.lister = null;
		this.setFilter = this.setFilter.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.setPattern = this.setPattern.bind(this);
		this.settimerange = this.settimerange.bind(this);

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
			fetch('plans/id/' + this.props.planId)
				.then((response: Response) => response.text())
				.then((text: string) => {
					var plan: Plan = myParseJson(text);
					var date = plan.plandate
					self.setState({
						year: date.getFullYear(),
						month: date.getMonth() + 1
					});
					this.handleChange(plan);
				})
		}
	}

	label(labelid: string): string { return this.props.intl.formatMessage({ id: labelid }); }

	setFilter(m: number, y: number): void {
		this.setState({ year: y, month: m })
	}

	setAnaylzeData(template: Template): void {
		this.setState({
			timerangefailed: template.additional[1] == '1',
			patternfailed: template.additional[0] == '1',
			template: template
		})
	}

	handleChange(plan: Plan): void {
		var self: _PlanSelect = this;
		this.setState({ timerangefailed: false, patternfailed: false, currentPlan: plan });
		if (this.props.onChange)
			this.props.onChange(plan);

		fetch("assign/analyze/" + this.props.record.id + "/" + plan.id)
			.then((response: Response) => response.text())
			.then((text) => { self.setAnaylzeData(myParseJson(text)) })
	}

	setPattern(p: Pattern): void {
		if (this.state.currentPlan != undefined)
			this.state.currentPlan.patterndto = p;
		postRequest('templates/changepattern', this.state.currentPlan, () => { });
		this.setState({ patterneditor: false });
	}

	settimerange(template: Template): void {
		fetch('templates/changetimerange/{planId}/{timestring}/{variance}');
		this.setState({ timerangeeditor: false });
	}


	renderAdjustButtons(): React.JSX.Element {
		return (
			<p style={{ borderStyle: 'solid' }}>
				{this.label("assign.adjust")}
				<button onClick={() => this.setState({ patterneditor: true })}
					className={css.addonbutton}
					hidden={!this.state.patternfailed}>
					{this.label("assign.adjustpattern")}
				</button>
				<button onClick={() => this.setState({ timerangeeditor: true })}
					className={css.addonbutton}
					hidden={!this.state.timerangefailed}>
					{this.label("assign.adjusttime")}
				</button>
			</p>
		);
	}


	renderPatternEditor(): React.JSX.Element {
		if (this.state.patterneditor && this.state.currentPlan) {
			return (<PatternEditor intl={this.props.intl} pattern={this.state.currentPlan.patterndto} sendPattern={(p: Pattern) => this.setPattern(p)} zIndex={4} />);
		}
		else {
			return <></>;
		}
	}

	renderTimRangeEditor(): React.JSX.Element {
		if (this.state.timerangeeditor && this.state.template && this.state.currentPlan) {
			return (<TimeRangeEditor
				recorddate={this.state.template.start}
				plandate={this.state.currentPlan.plandate}
				template={this.state.template}
				sendResult={this.settimerange}
				intl={this.props.intl}
				zIndex={4} />);
		}
		else {
			return <></>;
		}
	}

	render(): React.JSX.Element {
		return (
			<div testdata-id={"planselect"}>
				<MonthSelect label='' year={this.state.year} month={this.state.month} onChange={this.setFilter} />
				<div style={{ padding: '10px' }}>
					<SingleSelectLister<Plan>
						ext={this.state.year + '/' + this.state.month}
						url='plans/unassigned/'
						lines={12}
						handleChange={this.handleChange}
						columns={this.columns}
						ref={(ref) => { this.lister = ref }} />
					{this.renderAdjustButtons()}
				</div>
				{this.renderPatternEditor()}
				{this.renderTimRangeEditor()}
			</div>
		)
	}
}