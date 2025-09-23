import { useIntl, WrappedComponentProps } from "react-intl";
import { AccountRecord } from "../utils/dtos";
import acss from './css/assign.css'
import React from "react";

type Create = (props: RecordInfoProps) => React.JSX.Element;
export const RecordInfo: Create = (p) => { return (<_RecordInfo {...p} intl={useIntl()} />); }


export interface RecordInfoProps {
	accountRecord: AccountRecord;
}


export class _RecordInfo extends React.Component<RecordInfoProps & WrappedComponentProps, {}> {

	constructor(props: RecordInfoProps & WrappedComponentProps) {
		super(props);
	}

	label(labelid: string): string { return this.props.intl.formatMessage({ id: labelid }); }

	render(): React.JSX.Element {
		return (
			<table className={acss.recordinfoframe}>
				<tbody>
					<tr>
						<td className={acss.recordinfolabel}>{this.label("date")}</td>
						<td className={acss.recordinfofield}> {this.props.accountRecord.executed.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} </td>
					</tr>
					<tr>
						<td className={acss.recordinfolabel}>{this.label("value")}</td>
						<td className={acss.recordinfofield}> {(this.props.accountRecord.value / 100).toFixed(2)} </td>
					</tr>
					<tr>
						<td className={acss.recordinfolabel}>{this.label("sender")}</td>
						<td className={acss.recordinfofield}> {this.props.accountRecord.sender} </td>
					</tr>
					<tr>
						<td className={acss.recordinfolabel}>{this.label("receiver")}</td>
						<td className={acss.recordinfofield}> {this.props.accountRecord.receiver} </td>
					</tr>
					<tr>
						<td className={acss.recordinfolabel}>{this.label("refid")}</td>
						<td className={acss.recordinfofield}> {this.props.accountRecord.reference} </td>
					</tr>
					<tr>
						<td className={acss.recordinfolabel}>{this.label("mandate")}</td>
						<td className={acss.recordinfofield}> {this.props.accountRecord.mandate} </td>
					</tr>
					<tr>
						<td className={acss.recordinfolabel}>{this.label("submitter")}</td>
						<td className={acss.recordinfofield}> {this.props.accountRecord.submitter} </td>
					</tr>
					<tr>
						<td className={acss.recordinfolabel}>{this.label("details")}</td>
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