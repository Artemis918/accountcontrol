import React from "react";
import { AccountRecord, Assignment, EnumDTO, Plan, SubCategory } from "../utils/dtos";
import { SendMessage } from "../utils/messageid";
import { useIntl, WrappedComponentProps } from "react-intl";
import css from "./css/assign.css";

type Create = (props: AssignEditProps) => JSX.Element;
export const AssignEdit: Create = (props: AssignEditProps) => { return (<_AssignEdit {...props} intl={useIntl()} />); }

interface AssignEditProps {
	sendMessage: SendMessage;
    record?: AccountRecord;
	assignment?: Assignment;
	assignPlan?: Boolean;
}

// use cases:
// record | assignment  | assignplan |  use case                           | cat | plan | expand | expanded 
// -------+-------------+------------+-------------------------------------+-----+------+--------+----------
// null   | null        |            | assign multiple rows to subcategory | on  | off  | off    | off 
//   +    |             | yes        | assign to new plan                  | off | on   | on     | off
//   +    |             | no         | assign to new category              | on  | off  | on     | off
// null   | with plan   |            | change/show existing plan           | off | on   | on     | on
// null   | without plan|            | change/show existing category       | on  | off  | on     | on

interface IState {
	expanded: Boolean
}

const assignmenu: string = "assignmenu";

class _AssignEdit extends React.Component<AssignEditProps & WrappedComponentProps, IState> {

	constructor(props: AssignEditProps & WrappedComponentProps) {
			super(props)
			this.state = {
				expanded: props.assignment != undefined
			}
	}
			
	render(): JSX.Element {
		return (
		     <div style={{
		         position: 'fixed',
		         zIndex: 1,
		         left: '0', top: '0', width: '100%', height: '100%'
		     }}>
		         <div className = {css.assigneditorbox}>
				 	<div> text</div>
				</div>
			</div>
		)
	}
}