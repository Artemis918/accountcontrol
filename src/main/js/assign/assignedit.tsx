import React from "react";
import { AccountRecord, Assignment } from "../utils/dtos";
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

class _AssignEdit extends React.Component<AssignEditProps & WrappedComponentProps, IState> {

	constructor(props: AssignEditProps & WrappedComponentProps) {
			super(props)
			this.state = {
				expanded: props.assignment != undefined
			}
	}
	
	renderExpandButton(): JSX.Element {
	   if ( this.props.assignment == undefined  && this.props.record == undefined )
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
			
	render(): JSX.Element {
		return (
		     <div style={{
		         position: 'fixed',
		         zIndex: 1,
		         left: '0', top: '0', width: '100%', height: '100%'
		     }}>
		       { this.state.expanded ?  <div className = {css.assigneditorboxbig } >
				 	<table  style={{left: '0', top: '0', width: '100%', height: '100%'}}>
					   <td style={{ width: '40%'}} > 
					      {this.renderExpandButton()}   
						  <div> text</div>
					   </td>
					   <td style = {{ width: '60%'}}>
					   	  <div> record </div>
					   </td>
				    </table>
				</div>
				:
				<div className = {css.assigneditorbox } >
				     {this.renderExpandButton()}   
					 <div> text</div>
			    </div>
			  }
			</div>
		)
	}
}