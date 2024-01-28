import * as React from 'react'
import { MultiSelectLister, ColumnInfo, CellInfo } from '../utils/multiselectlister';
import { ContextMenuDef, ContextMenuEntry, HandleMenu } from '../utils/contextmenu';
import { CategoryAssign } from './categoryassign'
import { TemplateEditor } from '../planing/templateeditor';
import { SplitAssign } from './splitassign';
import { PlanSelect } from './planselect';
import { AccountRecord, Plan } from '../utils/dtos';
import { SendMessage, MessageID } from '../utils/messageid';
import { useIntl, WrappedComponentProps } from 'react-intl';

import mcss from './css/assign.css'
import css from '../css/index.css'

type Create = (props: AssignProps) => JSX.Element;
export const Assign: Create = (props: AssignProps) => { return (<_Assign {...props} intl={useIntl()} />); }

interface AssignProps {
	sendmessage: SendMessage;
}

interface IState {
	plan: number;
	selectedplan: Plan;
	planassign: AccountRecord;
	accountRecord: AccountRecord;
	categoryassign: boolean;
	deftext: string;
	defsubcategory: number;
	defcategory: number
}

const assignmenu: string = "assignmenu";

class _Assign extends React.Component<AssignProps & WrappedComponentProps, IState> {

	assignplanlabel: string;
	assigncatlabel: string;
	splitlabel: string;
	autolabel: string;
	planlabel: string;

	menutitle: string;
	menusplitlabel: string;
	menucatlabel: string;
	menuplanlabel: string;

	contextMenu: ContextMenuDef<AccountRecord>;

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
	lister: MultiSelectLister<AccountRecord>;

	constructor(props: AssignProps & WrappedComponentProps) {
		super(props)
		this.lister = undefined;
		this.state = {
			plan: undefined,
			selectedplan: undefined,
			planassign: undefined,
			accountRecord: undefined,
			categoryassign: false,
			deftext: "",
			defsubcategory: undefined,
			defcategory: undefined
		}
		this.createPlan = this.createPlan.bind(this);
		this.assignAuto = this.assignAuto.bind(this);
		this.assignManuell = this.assignManuell.bind(this);
		this.assignPlan = this.assignPlan.bind(this);
		this.assignCategory = this.assignCategory.bind(this);
		this.onChange = this.onChange.bind(this);
		this.assignSelected = this.assignSelected.bind(this);
		this.assignSelectedPlan = this.assignSelectedPlan.bind(this);
	}

	label(labelid: string): string { return this.props.intl.formatMessage({ id: labelid }) }

	createLabel(): void {
		this.assignplanlabel = this.label("assign.assignplan");
		this.assigncatlabel = this.label("assign.catassign");
		this.splitlabel = this.label("assign.split");
		this.autolabel = this.label("assign.auto");
		this.planlabel = this.label("assign.plan");

		this.menutitle = this.label("assign.assign");
		this.menucatlabel = this.label("category");
		this.menuplanlabel = this.label("plan");
		this.menusplitlabel = this.label("assign.split");
	}

	assignAuto(): void {
		fetch('assign/all')
			.then(() => { this.lister.reload(); }
			);
	}

	assignCategory(): void {
		if (this.lister.hasSelectedData())
			this.setState({ categoryassign: true });
		else
			this.props.sendmessage(this.label("assign.atleastonevalue"), MessageID.INVALID_DATA);
	}

	assignManuell(): void {
		var data: AccountRecord[] = this.lister.getSelectedData();
		if (data.length != 1) {
			this.props.sendmessage(this.label("assign.onevalue"), MessageID.INVALID_DATA);
		}
		else {
			this.setState({ accountRecord: data[0] })
		}
	}

	assignSelected(sub: number, t: string): void {
		var self = this;
		if (sub != undefined) {
			var request = { text: t, subcategory: sub, ids: this.lister.getSelectedData().map(d => d.id) };
			var self = this;
			var jsonbody = JSON.stringify(request);
			fetch('assign/tosubcategory', {
				method: 'post',
				body: jsonbody,
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function() {
				self.setState({ categoryassign: false });
				self.lister.reload();
			});
		}
		else {
			self.setState({ categoryassign: false });
		}
	}

	createPlan(): void {
		var data: AccountRecord[] = this.lister.getSelectedData();
		if (data.length != 1) {
			this.props.sendmessage(this.label("assign.onevalue"), MessageID.INVALID_DATA);
		}
		else {
			this.setState({ plan: data[0].id })
		}
	}

	onChange(): void {
		this.setState({ plan: undefined, accountRecord: undefined });
		this.lister.reload();
	}

	assignSelectedPlan(plan: Plan): void {
		var self = this;
		if (plan != undefined) {
			var self = this;
			fetch('assign/toplan/' + plan.id + '/' + this.state.planassign.id)
				.then(function() {
					self.setState({ planassign: undefined });
					self.lister.reload();
				});
		}
		else
			this.setState({ planassign: undefined });
	}

	assignPlan(): void {
		var data: AccountRecord[] = this.lister.getSelectedData();
		if (data.length != 1) {
			this.props.sendmessage(this.label("assign.onevalue"), MessageID.INVALID_DATA);
		}
		else {
			this.setState({ planassign: data[0] })
		}
	}

	renderPlanSelect(): JSX.Element {
		if (this.state.planassign != undefined) {
			var date: Date = this.state.planassign.executed;
			return (<PlanSelect month={date.getMonth() + 1}
				year={date.getFullYear()}
				onAssign={this.assignSelectedPlan}
				recordid={this.state.planassign.id} />);
		}
		else
			return null;
	}

	render(): JSX.Element {

		this.createLabel();

		this.contextMenu = {
			entries: [
				{ name: this.menucatlabel, func: this.assignCategory },
				{ name: this.menuplanlabel, func: this.assignPlan },
				{ name: this.menusplitlabel, func: this.assignManuell },
			],
			title: this.menutitle
		}

		if (this.state.plan !== undefined) {
			return <TemplateEditor intl={this.props.intl} accountRecord={this.state.plan} onDetach={() => this.onChange()} />
		}

		if (this.state.accountRecord !== undefined) {
			return <SplitAssign accountRecord={this.state.accountRecord} onCommit={() => this.onChange()} />
		}

		return (
			<div>
				<div className={css.actionbar}>
					<button className={css.actionbutton} onClick={() => this.assignAuto()}>{this.autolabel}</button> |
					<button className={css.actionbutton} onClick={() => this.assignCategory()}>{this.assigncatlabel}</button>
					<button className={css.actionbutton} onClick={() => this.assignManuell()}>{this.splitlabel}</button>
					<button className={css.actionbutton} onClick={() => this.assignPlan()}>{this.assignplanlabel}</button> |
					<button className={css.actionbutton} onClick={() => this.createPlan()}>{this.planlabel}</button>
				</div>
				<MultiSelectLister<AccountRecord> columns={this.columns}
					menu={this.contextMenu}
					url='accountrecord/unassigned'
					lines={28}
					ext=''
					ref={(ref) => { this.lister = ref }} />
				{this.state.categoryassign ? <CategoryAssign
					text={this.state.deftext}
					subcategory={this.state.defsubcategory}
					category={this.state.defcategory}
					handleAssign={(sub, text) => { this.assignSelected(sub, text) }} />
					: null
				}
				{this.renderPlanSelect()}
			</div>
		)
	}
}

