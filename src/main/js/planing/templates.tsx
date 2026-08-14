import React from 'react'

import { TemplateEditor } from './templateeditor'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { Template } from '../utils/dtos'
import { DropdownService } from '../utils/dropdownservice'
import { SendMessage } from '../utils/messageid'
import { label, getIntl } from '../utils/misc'

import * as css from '../css/index.css'

interface TemplateProps {
	sendmessage: SendMessage;
}

interface IState {
	category?: number;
}




export class Templates extends React.Component<TemplateProps, IState> {


	lister: SingleSelectLister<Template> | null = null;
	editor: TemplateEditor | null = null	;

	unitNames: string[] = [];

	constructor(props: TemplateProps ) {
		super(props);
		this.state = { category: undefined };
		this.refreshlist = this.refreshlist.bind(this);
		this.refresheditor = this.refresheditor.bind(this);
	}

	refreshlist(): void {
		this.lister?.reload();
	}

	refresheditor(template: Template): void {
		this.editor?.setTemplate(template);
	}

	createColums(): ColumnInfo<Template>[] {
		this.unitNames = [label("day"),
		label("week"),
		label("month"),
		label("year")];
		return [{
			header: label("templates.firstday"),
			getdata: (d: Template): string => { return d.start.toLocaleDateString(getIntl().locale, { day: '2-digit', month: '2-digit' }).substr(0, 6) },
		}, {
			header: label("templates.validuntil"),
			getdata: (d: Template): string => { return d.validUntil != null ? d.validUntil.toLocaleDateString(getIntl().locale) : "" },
		}, {
			header: label("templates.repetition"),
			getdata: (d: Template): string => { return d.repeatcount + ' - ' + this.unitNames[d.repeatunit] }
		}, {
			header: label("shortdescription"),
			getdata: (d: Template): string => { return d.shortdescription; }
		}, {
			header: label("value"),
			cellrender: (cellinfo: CellInfo<Template>) => (
				<div style={{
					color: cellinfo.data.value >= 0 ? 'green' : 'red',
					textAlign: 'right'
				}}>
					{(cellinfo.data.value / 100).toFixed(2)}
				</div>
			)
		}]
	}

	render(): React.JSX.Element {
		return (
			<table style={{ border: '1px solid black' }}>
				<tbody>
					<tr>
						<td style={{ border: '1px solid black', verticalAlign: 'top' }}>
							<div className={css.editortitle}> {label("records.recorddata")} </div>
							<TemplateEditor ref={(ref) => { this.editor = ref; }}  onDetach={this.refreshlist} />
						</td>
						<td style={{ verticalAlign: 'top' }} >
							<p style={{ padding: '1px', margin: '5px', borderBottom: '1px solid black' }}>
								<DropdownService className={css.catselector3}
									onChange={(val: number): void => this.setState({ category: val })}
									url='category/catenum/true'
									value={this.state.category}
								/>
							</p>
							<SingleSelectLister<Template> ref={(ref) => { this.lister = ref; }}
								lines={28}
								handleChange={this.refresheditor}
								url='templates/listcategory/'
								ext={this.state.category == undefined ? undefined : this.state.category.toString(10)}
								columns={this.createColums()} />
						</td>
					</tr>
				</tbody>
			</table>
		);
	}

}