import React from "react";
import { AccountRecord, Assignment, Plan } from "../utils/dtos";
import { SendMessage } from "../utils/messageid";
import { useIntl, WrappedComponentProps } from "react-intl";
import { CategorySelect } from "./categoryselect";
import { PlanSelect } from "./planselect";
import { RecordInfo } from "./recordinfo";
import { myParseJson } from "../utils/misc";

import css from './css/assign.css';
import gcss from '../css/index.css';


type Create = (props: AssignEditProps) => React.JSX.Element;
export const AssignEdit: Create = (props: AssignEditProps) => { return (<_AssignEdit {...props} intl={useIntl()} />); }

export type OnAssign = (changed: boolean) => void
export type OnAssignNewCats = (newSubCat: number, comment: string) => void
export type OnAssignPlan = (plan: Plan) => void

interface AssignEditProps {
	sendMessage: SendMessage;
	recordId?: number;
	assignment?: Assignment;
	onAssign: OnAssign;
	onAssignNewCats?: OnAssignNewCats;  // only if recordID is undefined
	assignPlan?: OnAssignPlan;  // to overide default plan assign behavior
}

// use cases:
// record | assignment  | onAssignNC |  use case                           | cat | plan | expand | expanded 
// -------+-------------+------------+-------------------------------------+-----+------+--------+----------
// null   | null        |            | assign multiple rows to subcategory | on  | off  | off    | off 
//   +    |             | not set    | assign to new plan                  | off | on   | on     | off
//   +    |             | set        | assign to new category              | on  | off  | on     | off
//   +    | with plan   |            | change/show existing plan           | off | on   | on     | on
//   +    | without plan|            | change/show existing category       | on  | off  | on     | on

interface IState {
	expanded: Boolean;
	record: AccountRecord | undefined;
	planassign: Boolean;
	cur_comment: string;
	cur_subcat: number | undefined;
	cur_plan: Plan | undefined;
}

class _AssignEdit extends React.Component<AssignEditProps & WrappedComponentProps, IState> {

	constructor(props: AssignEditProps & WrappedComponentProps) {
		super(props)
		this.state = {
			expanded: props.assignment != undefined,
			record: undefined,
			cur_comment: undefined,
			cur_subcat: undefined,
			cur_plan: undefined,
			planassign: props.recordId == undefined
				&& ((props.assignment == undefined && this.props.onAssignNewCats == undefined)
					|| (props.assignment != undefined && this.props.assignment.plan != undefined))
		}

		this.assign = this.assign.bind(this);
		this.cancel = this.cancel.bind(this);
		this.onPlanChange = this.onPlanChange.bind(this);
		this.onCatChange = this.onCatChange.bind(this);
	}

	label(labelid: string): string { return this.props.intl.formatMessage({ id: labelid }) }

	componentDidMount(): void {
		if (this.props.recordId != undefined) {
			var self = this;
			fetch('accountrecord/id/' + this.props.recordId)
				.then((response: Response) => response.text())
				.then((text: string) => { self.setState({ record: myParseJson(text) }) })
		}
	}

	cancel(): void {
		if (this.props.onAssign != undefined)
			this.props.onAssign(false);
	}

	assign() {
		if (this.state.planassign)
			this.assignPlanCallBack(this.state.cur_plan);
		this.assignCatCallBack(this.state.cur_subcat, this.state.cur_comment)
	}

	onPlanChange(plan: Plan) {
		this.setState({ cur_plan: plan });
	}

	onCatChange(subcat: number, comment: string) {
		this.setState({ cur_subcat: subcat, cur_comment: comment });
	}

	assignCatCallBack(subcat: number | undefined, comment: string): void {
		if (this.props.recordId == undefined) {
			if (this.props.onAssignNewCats != undefined)
				this.props.onAssignNewCats(subcat, comment);
		}
		else {
			var request = { text: comment, subcategory: subcat, ids: [this.state.record.id] };
			var self = this;
			var jsonbody = JSON.stringify(request);
			fetch('assign/tosubcategory', {
				method: 'post',
				body: jsonbody,
				headers: {
					"Content-Type": "application/json"
				}
			}).then(
				() => {
					if (self.props.onAssign != undefined)
						self.props.onAssign(true)
				}
			);
		}
	};

	assignPlanCallBack(plan: Plan | undefined): void {
		if (this.props.assignPlan != undefined)
			this.props.assignPlan(plan);
		else {
			// default behavior: assign to plan and remove previous assignment	
			var self = this;
			fetch('assign/toplan/' + plan.id + '/' + this.props.recordId)
				.then(() => { if (self.props.onAssign) self.props.onAssign(true); });
		}
	};


	renderExpandButton(): React.JSX.Element {
		if (this.state.record == undefined)
			return <></>;

		else if (this.state.expanded)
			return (
				<div style={{ textAlign: 'right' }}>
					<button onClick={() => this.setState({ expanded: false })}> {'\<'} </button>
				</div>);

		else
			return (
				<div style={{ textAlign: 'right' }}>
					<button onClick={() => this.setState({ expanded: true })}> {'\>'} </button>
				</div>);
	}

	renderSelector(): React.JSX.Element {
		if (this.state.planassign) {
			var planId: number = this.props.assignment ? this.props.assignment.plan! : undefined;
			return <PlanSelect record={this.state.record} planId={planId} onChange={this.onPlanChange} />;
		}
		else {
			var subCatId = this.props.assignment ? this.props.assignment.subcategory : undefined;
			return <CategorySelect text={""} subCatId={subCatId} onChange={this.onCatChange} />
		}
	}

	renderAssignment(): React.JSX.Element {
		return (
			<div>
				{this.renderSelector()}
				<div>
					<button onClick={this.assign} className={gcss.addonbutton} testdata-id={'assign.assign'}>
						{this.label("assign.assign")}
					</button>
					<button onClick={this.cancel}
					    testdata-id={'assign.cancel'}
						style={{ float: "right" }}
						className={gcss.addonbutton}>
						{this.label("cancel")}
					</button>
				</div>
			</div>
		)
	}

	render(): React.JSX.Element {
		var boxsize: string = this.state.expanded ?
			(this.state.planassign ? css.planexpsize : css.catexpsize)
			: (this.state.planassign ? css.plansize : css.catsize)
		var boxstyle: string = css.assignselectbox + " " + boxsize;
		var title: string = this.label(this.state.planassign ? "plan" : "category");


		return (

			<div style={{
				position: 'fixed',
				zIndex: 1,
				left: '0', top: '0', width: '100%', height: '100%'
			}}>
				<div className={boxstyle}
					testdata-id={'assignedit'}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							this.assign();
						}
					}}
				>
					<div style={{ textAlign: 'center' }}>
						{this.label("assign.to")} &nbsp;
						<button className={gcss.addonbutton} onClick={() => this.setState({ planassign: !this.state.planassign })} testdata-id={'typebutton'} >{title}</button>
					</div>
					<table style={{ left: '0', top: '0', width: '100%', height: '100%' }}>
						<tbody>

							{this.state.expanded && this.state.record ?
								<tr>
									<td style={{ verticalAlign: 'top', minWidth: '45%' }} >
										{this.renderAssignment()}
									</td>
									<td style={{ verticalAlign: 'top' }} >
										{this.renderExpandButton()}
									</td>
									<td style={{ verticalAlign: 'top', maxWidth: '55%' }} >
										<RecordInfo accountRecord={this.state.record} />
									</td>
								</tr>
								:
								<tr>
									<td style={{ verticalAlign: 'top' }}>
										{this.renderAssignment()}
									</td>
									<td style={{ verticalAlign: 'top' }}>
										{this.renderExpandButton()}
									</td>
								</tr>
							}
						</tbody>
					</table>
				</div>
			</div >
		)
	}

}