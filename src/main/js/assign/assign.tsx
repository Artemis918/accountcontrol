import * as React from 'react'
import { MultiSelectLister, ColumnInfo, CellInfo } from '../utils/multiselectlister';
import { ContextMenuDef, ContextMenuEntry } from '../utils/contextmenu';
import { TemplateEditor } from '../planing/templateeditor';
import { SplitAssign } from './splitassign';
import { AccountRecord, EnumDTO, Plan } from '../utils/dtos';
import { SendMessage, MessageID } from '../utils/messageid';
import { useIntl, WrappedComponentProps } from 'react-intl';

import css from '../css/index.css'
import { myParseJson } from '../utils/misc';
import { AssignEdit } from './assignedit';

type Create = (props: AssignProps) => React.JSX.Element;
export const Assign: Create = (props: AssignProps) => { return (<_Assign {...props} intl={useIntl()} />); }

enum AssignAction {
	NONE,
	CATEGORY,
	PLAN,
	SPLIT,
	TEMPLATE
}

interface AssignProps {
	sendmessage: SendMessage;
}

interface IState {
	plan: number | undefined;
	accountRecords: AccountRecord[];
	favcategory: EnumDTO[];
	action: AssignAction;
}

const assignmenu: string = "assignmenu";

class _Assign extends React.Component<AssignProps & WrappedComponentProps, IState> {

	columns: ColumnInfo<AccountRecord>[] = [
		{
			header: this.label("date"),
			getdata: (data: AccountRecord): string => { return data.executed.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) }
		}, {
			header: this.label("assign.otherparty"),
			cellrender: (cellinfo: CellInfo<AccountRecord>) => (
				<div>
					{(cellinfo.data.value > 0) ? cellinfo.data.sender : cellinfo.data.receiver}
				</div>
			)
		}, {
			header: this.label("details"),
			getdata: (data: AccountRecord) => { return data.details },
		}, {
			header: this.label("value"),
			cellrender: (cellinfo: CellInfo<AccountRecord>) => (

				<div style={{
					color: cellinfo.data.value >= 0 ? 'green' : 'red',
					textAlign: 'right'
				}}>
					{(cellinfo.data.value / 100).toFixed(2)}
				</div>

			)
		}];
	recordLister: MultiSelectLister<AccountRecord> | null = null;

	constructor(props: AssignProps & WrappedComponentProps) {
		super(props)
		this.state = {
			plan: undefined,
			accountRecords: [],
			favcategory: [],
			action: AssignAction.NONE
		}

		this.reload = this.reload.bind(this);
		this.loadFav = this.loadFav.bind(this);

		this.assignAuto = this.assignAuto.bind(this);
		this.assignSplit = this.assignSplit.bind(this);
		this.createTemplate = this.createTemplate.bind(this);
		
		this.assignCategory = this.assignCategory.bind(this);
		this.assignDirect = this.assignDirect.bind(this);
		this.executeAssignCategory = this.executeAssignCategory.bind(this);
		this.onAssign = this.onAssign.bind(this);
		this.assignPlan = this.assignPlan.bind(this);
	}

	componentDidMount(): void {
		this.loadFav();
	}

	label(labelid: string): string { return this.props.intl.formatMessage({ id: labelid }) }

	loadFav(): void {
		var self = this;
		fetch('category/subenumfavorite')
			.then((response: Response) => response.text())
			.then((text: string) => { self.setState({ favcategory: myParseJson(text) }) })
	}

	reload(): void {
		this.loadFav();
		if (this.recordLister)
			this.recordLister.reload();
	}

	clearAction(): void {
		this.setState({ action: AssignAction.NONE, accountRecords: [] });
		this.reload();
	};

	assignAuto(): void {
		fetch('assign/all')
			.then(this.reload);
	}

	assignSplit(): void {
		if (this.state.accountRecords.length == 1)
			this.setState({ action: AssignAction.SPLIT });
		else {
			this.props.sendmessage(this.label("assign.onevalue"), MessageID.INVALID_DATA);
		}
	}

	createTemplate(): void {
		if (this.state.accountRecords.length == 1)
			this.setState({ action: AssignAction.TEMPLATE });
		else {
			this.props.sendmessage(this.label("assign.onevalue"), MessageID.INVALID_DATA);
		}
	}

	assignCategory(): void {
		if (this.state.accountRecords.length > 0)
			this.setState({ action: AssignAction.CATEGORY });
		else
			this.props.sendmessage(this.label("assign.atleastonevalue"), MessageID.INVALID_DATA);
	}


	assignPlan(): void {
		if (this.state.accountRecords.length == 1)
			this.setState({ action: AssignAction.PLAN });
		else {
			this.props.sendmessage(this.label("assign.onevalue"), MessageID.INVALID_DATA);
		}
	}

	assignDirect(_: number, entry: ContextMenuEntry<AccountRecord>): void {
		let fav: EnumDTO = entry.data;
		this.executeAssignCategory(fav.value, "");
	}

	executeAssignCategory(sub: number, comment: string): void {
		var self = this;
		if (sub != undefined) {
			var request = { text: comment, subcategory: sub, ids: this.state.accountRecords.map(d => d.id) };
			var self = this;
			var jsonbody = JSON.stringify(request);
			fetch('assign/tosubcategory', {
				method: 'post',
				body: jsonbody,
				headers: {
					"Content-Type": "application/json"
				}
			}).then(() => self.clearAction());
		}
		else {
			self.setState({ action: AssignAction.NONE });
		}
	}

	onAssign(changed: boolean): void {
		if (changed) {
			this.clearAction();
		}
		else
			this.setState({ action: AssignAction.NONE });
	}
	
	renderAssignEditor(): React.JSX.Element {
		var recordId: number | undefined = this.state.accountRecords.length == 1 ? this.state.accountRecords[0].id : undefined;

		if (this.state.action == AssignAction.CATEGORY) {
			return <AssignEdit sendMessage={this.props.sendmessage} recordId={recordId} onAssign={this.onAssign} onAssignNewCats={this.executeAssignCategory}/>;
		}
		else if (this.state.action == AssignAction.PLAN) {
			return <AssignEdit sendMessage={this.props.sendmessage} recordId={recordId} onAssign={this.onAssign} />;
		}
		else {
			return <></>;
		}
	}

	renderActionButton(func: () => void, labelid: string): React.JSX.Element {
		return (
			<button className={css.actionbutton} 
			onClick={func}
			testdata-id={labelid}
			>
				{this.label(labelid)}
			</button>
		)
	}

	render(): React.JSX.Element {

		if (this.state.action == AssignAction.TEMPLATE) {
			return <TemplateEditor intl={this.props.intl} accountRecordId={this.state.accountRecords[0].id} onDetach={() => this.setState({ action: AssignAction.NONE })} />
		}

		if (this.state.action == AssignAction.SPLIT) {
			return <SplitAssign accountRecord={this.state.accountRecords[0]} onCommit={() => this.clearAction()} sendMessage = {this.props.sendmessage} />
		}

		let mainentries: ContextMenuEntry<AccountRecord>[] = [
			{ name: this.label("category"), func: this.assignCategory, active: true },
			{ name: this.label("plan"), func: this.assignPlan, active: true },
			{ name: this.label("assign.split"), func: this.assignSplit, active: true },
			{ name: "------------", func: () => { }, active: true }
		];
		let faventries: ContextMenuEntry<AccountRecord>[] = this.state.favcategory.map((e) => { return { name: e.text, func: this.assignDirect, data: e, active: true }; });

		var contextMenu: ContextMenuDef<AccountRecord> = {
			entries: mainentries.concat(faventries),
			title: this.label("assign.assign")
		}

		return (
			<div>
				<div className={css.actionbar}>
					{this.renderActionButton(this.assignAuto, "assign.auto")}
					{this.renderActionButton(this.assignCategory, "assign.cat")}
					{this.renderActionButton(this.assignSplit, "assign.split")}
					{this.renderActionButton(this.assignPlan, "assign.plan")}
					{this.renderActionButton(this.createTemplate, "assign.template")}
				</div>
				<MultiSelectLister<AccountRecord> columns={this.columns}
					testdata-id={"assignlister"}
					menu={contextMenu}
					url='accountrecord/unassigned'
					lines={28}
					ext=''
					ref={(ref) => { this.recordLister = ref }}
					handleselect={(data: AccountRecord[]) => { this.setState({ accountRecords: data }); }} />
				{this.renderAssignEditor()}
			</div>
		)
	}
}