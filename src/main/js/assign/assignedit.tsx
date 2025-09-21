import React from "react";
import { AccountRecord, Assignment } from "../utils/dtos";
import { SendMessage } from "../utils/messageid";
import { useIntl, WrappedComponentProps } from "react-intl";
import css from "./css/assign.css";
import CategorySelect, { AssignCategoryCallback } from "./categoryselect";
import { AssignPlanCallback, PlanSelect } from "./planselect";
import { RecordInfo } from "./recordinfo";

type Create = (props: AssignEditProps) => React.JSX.Element;
export const AssignEdit: Create = (props: AssignEditProps) => { return (<_AssignEdit {...props} intl={useIntl()} />); }

interface AssignEditProps {
	sendMessage: SendMessage;
	record?: AccountRecord;
	assignment?: Assignment;
	assignCatCallBack?: AssignCategoryCallback;
	assignPlanCallBack?: AssignPlanCallback;
}

// use cases:
// record | assignment  | callback   |  use case                           | cat | plan | expand | expanded 
// -------+-------------+------------+-------------------------------------+-----+------+--------+----------
// null   | null        |            | assign multiple rows to subcategory | on  | off  | off    | off 
//   +    |             | plan       | assign to new plan                  | off | on   | on     | off
//   +    |             | cat        | assign to new category              | on  | off  | on     | off
//   +    | with plan   | plan/cat   | change/show existing plan           | off | on   | on     | on
//   +    | without plan| plan/cat   | change/show existing category       | on  | off  | on     | on

interface IState {
	expanded: Boolean
}

class _AssignEdit extends React.Component<AssignEditProps & WrappedComponentProps, IState> {

	constructor(props: AssignEditProps & WrappedComponentProps) {
		super(props)
		this.state = {
			expanded: props.assignment != undefined
		}
	}


	renderExpandButton(): React.JSX.Element {
		if (this.props.record == undefined)
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

	isPlanAssignment(): boolean {
		return this.props.record != undefined
			&& this.props.assignPlanCallBack != undefined
			&& (this.props.assignCatCallBack == undefined
				|| (this.props.assignment != undefined && this.props.assignment.plan != undefined));
	}

	renderAssignment(): React.JSX.Element {

		if (this.isPlanAssignment()
			&& this.props.record && this.props.assignPlanCallBack) {
			return <PlanSelect record={this.props.record} onAssign={this.props.assignPlanCallBack} />;
		}
		else if (this.props.assignCatCallBack && !this.props.assignPlanCallBack) {
			return <CategorySelect text={""} assignCategory={this.props.assignCatCallBack} />
		}
		return <></>
	}

	render(): React.JSX.Element {
		var boxsize = { width: this.state.expanded ? '550px' : '300px', height: '0px' };
		if (this.isPlanAssignment()) {
			boxsize.height = '440px';
		}
		else {
			boxsize.height = this.state.expanded ? '300px' : '180px';
		}

		return (
			<div style={{
				position: 'fixed',
				zIndex: 1,
				left: '0', top: '0', width: '100%', height: '100%'
			}}>
				{this.state.expanded && this.props.record ?
					<div className={css.assignselectbox} style={boxsize }>
						<table style={{ left: '0', top: '0', width: '100%', height: '100%' }}>
							<tbody>
								<tr>
									<td style={{ verticalAlign: 'top', minWidth: '40%'}} >
										{this.renderAssignment()}
									</td>
									<td style={{ verticalAlign: 'top' }} >
										{this.renderExpandButton()}
									</td>
									<td style={{ verticalAlign: 'top', maxWidth: '60%'}} >
										<RecordInfo accountRecord={this.props.record} />
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					:
					<div className={css.assignselectbox} style={boxsize} >
						<table style={{ left: '0', top: '0', width: '100%', height: '100%' }}>
							<tbody>
								<tr>
									<td style={{ verticalAlign: 'top' }}>
										{this.renderAssignment()}
									</td>
									<td style={{ verticalAlign: 'top' }}>
										{this.renderExpandButton()}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				}
			</div>
		)
	}

}