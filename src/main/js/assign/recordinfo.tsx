
import { AccountRecord } from "../utils/dtos";
import * as acss from './css/assign.css'
import React from "react";
import { label } from "../utils/misc";

export interface RecordInfoProps {
	accountRecord: AccountRecord;
}


export class RecordInfo extends React.Component<RecordInfoProps , {}> {

	constructor(props: RecordInfoProps ) {
		super(props);
	}

	render(): React.JSX.Element {
		return (
			<table className={acss.recordinfoframe}>
				<tbody>
					<tr>
						<td className={acss.recordinfolabel}>{label("date")}</td>
						<td className={acss.recordinfofield}> {this.props.accountRecord.executed.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} </td>
					</tr>
					<tr>
						<td className={acss.recordinfolabel}>{label("value")}</td>
						<td className={acss.recordinfofield}> {(this.props.accountRecord.value / 100).toFixed(2)} </td>
					</tr>
					<tr>
						<td className={acss.recordinfolabel}>{label("sender")}</td>
						<td className={acss.recordinfofield}> {this.props.accountRecord.sender} </td>
					</tr>
					<tr>
						<td className={acss.recordinfolabel}>{label("receiver")}</td>
						<td className={acss.recordinfofield}> {this.props.accountRecord.receiver} </td>
					</tr>
					<tr>
						<td className={acss.recordinfolabel}>{label("refid")}</td>
						<td className={acss.recordinfofield}> {this.props.accountRecord.reference} </td>
					</tr>
					<tr>
						<td className={acss.recordinfolabel}>{label("mandate")}</td>
						<td className={acss.recordinfofield}> {this.props.accountRecord.mandate} </td>
					</tr>
					<tr>
						<td className={acss.recordinfolabel}>{label("submitter")}</td>
						<td className={acss.recordinfofield}> {this.props.accountRecord.submitter} </td>
					</tr>
					<tr>
						<td className={acss.recordinfolabel}>{label("details")}</td>
					</tr>
					<tr>
						<td colSpan={2} className={acss.recordinfofield} style={{ padding: '0px' }} >
							<textarea readOnly={true} style={{ width: '95%', height: '5em',border: 'none', resize: 'none', background: 'lightgray' }} 	>
								{this.props.accountRecord.details}
							</textarea>
						</td>
					</tr>
				</tbody>
			</table>
		);
	}

}