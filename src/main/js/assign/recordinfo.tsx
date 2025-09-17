import { useIntl, WrappedComponentProps } from "react-intl";
import { AccountRecord } from "../utils/dtos";
import mcss from './css/assign.css'
import React from "react";

type Create = (props:RecordInfoProps) => JSX.Element;
export const RecordInfo:Create = (p) => { return (<_RecordInfo {...p} intl={useIntl()}/>); }


export interface RecordInfoProps {
    accountRecord: AccountRecord;
}


export class _RecordInfo extends React.Component<RecordInfoProps & WrappedComponentProps, {}> {

	constructor(props: RecordInfoProps & WrappedComponentProps) {
		super( props );
	}
	
	label(labelid:string):string {return this.props.intl.formatMessage({id: labelid}); }
	
	render(): JSX.Element {
		return (
			<table> 
				<tbody>
				<tr> 
					<td className={mcss.recordinfolabel}>{this.label("date")}</td> 
					<td className={mcss.recordinfofield}> {this.props.accountRecord.executed.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} </td>
				</tr>
				<tr> 
					<td className={mcss.recordinfolabel}>{this.label("value")}</td> 
					<td className={mcss.recordinfofield}> {(this.props.accountRecord.value / 100).toFixed(2)} </td>
				</tr>
				<tr> 
					<td className={mcss.recordinfolabel}>{this.label("sender")}</td> 
					<td className={mcss.recordinfofield}> {this.props.accountRecord.sender} </td>
				</tr>
				<tr> 
					<td className={mcss.recordinfolabel}>{this.label("receiver")}</td> 
					<td className={mcss.recordinfofield}> {this.props.accountRecord.receiver} </td>
				</tr>
				<tr> 
					<td className={mcss.recordinfolabel}>{this.label("refid")}</td> 
					<td className={mcss.recordinfofield}> {this.props.accountRecord.reference} </td>
				</tr>
				<tr> 
					<td className={mcss.recordinfolabel}>{this.label("mandate")}</td> 
					<td className={mcss.recordinfofield}> {this.props.accountRecord.mandate} </td>
				</tr>
				<tr> 
					<td className={mcss.recordinfolabel}>{this.label("submitter")}</td> 
					<td className={mcss.recordinfofield}> {this.props.accountRecord.submitter} </td>
				</tr>
				<tr> 
					<td className={mcss.recordinfolabel}>{this.label("details")}</td> 
				</tr>
				<tr>
					<td colSpan={2} className={mcss.recordinfofield}>{this.props.accountRecord.details} </td>
				</tr>
				</tbody>
			</table>
		);
	}

}