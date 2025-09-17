import React from "react";
import { AccountRecord, Assignment } from "../utils/dtos";
import { SendMessage } from "../utils/messageid";
import { useIntl, WrappedComponentProps } from "react-intl";
import css from "./css/assign.css";
import CategorySelect, { AssignCategoryCallback } from "./categoryselect";
import { AssignPlanCallback } from "./planselect";
import { RecordInfo } from "./recordinfo";

type Create = (props: AssignEditProps) => JSX.Element;
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
	
	
	renderExpandButton(): JSX.Element {
		if ( this.props.record == undefined )
			  return null;
	
		else if ( this.state.expanded)
			 return ( 
				<div style={{ textAlign: 'right'}}>
					<button onClick={() => this.setState({expanded: false})}> {'\<'} </button>
		 		</div> );

       else 
	     	return (
		 		<div style={{ textAlign: 'right'}}>
					<button onClick={() => this.setState({expanded: true})}> {'\>'} </button>
				</div>	);  	
	}
	
	renderAssignment() :JSX.Element {
		if (this.props.assignPlanCallBack && !this.props.assignCatCallBack || (this.props.assignment && this.props.assignment.plan) ) 
			return <div> planassignment </div>
		else {
			var text:string = "";
			var subcategory = undefined;
			var category = undefined;
			return <CategorySelect text= {""} assignCategory={this.props.assignCatCallBack}/>
		}
	}
				
	render(): JSX.Element {
		return (
		     <div style={{
		         position: 'fixed',
		         zIndex: 1,
		         left: '0', top: '0', width: '100%', height: '100%'
		     }}>
		       { this.state.expanded ?  <div className = {css.assigneditorboxbig } >
				 	<table  style={{left: '0', top: '0', width: '100%', height: '100%'}}>
					   <td style={{ width: '40%' }} > 
						  {this.renderAssignment()}
				       </td>
					   <td>   
					      {this.renderExpandButton()}
					   </td>
					   <td style = {{ width: '60%'}}>
					   	  <RecordInfo accountRecord={this.props.record}/>
					   </td>
				    </table>
				</div>
				:
				<div className = {css.assigneditorbox } >
				<table  style={{left: '0', top: '0', width: '100%', height: '100%'}}>
				  <td>   
				  	 {this.renderAssignment()}
				  </td>
				  <td> 
				     {this.renderExpandButton()}
				  </td>

				</table>
			    </div>
			  }
			</div>
		)
	}

}