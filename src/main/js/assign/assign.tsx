import * as React from 'react'
import { MultiSelectLister, ColumnInfo, CellInfo } from '../utils/multiselectlister';
import { ContextMenuDef, ContextMenuEntry } from '../utils/contextmenu';
import { TemplateEditor } from '../planing/templateeditor';
import { SplitAssign } from './splitassign';
import { PlanSelect } from './planselect';
import { AccountRecord, EnumDTO, Plan } from '../utils/dtos';
import { SendMessage, MessageID } from '../utils/messageid';
import { useIntl, WrappedComponentProps } from 'react-intl';

import css from '../css/index.css'
import { myParseJson } from '../utils/misc';
import { AssignEdit } from './assignedit';

type Create = (props: AssignProps) => React.JSX.Element;
export const Assign: Create = (props: AssignProps) => { return (<_Assign {...props} intl={useIntl()} />); }

interface AssignProps {
	sendmessage: SendMessage;
}

interface IState {
	plan: number;
	selectedplan: Plan;
	planassign: AccountRecord;
	accountRecord: AccountRecord;
	assignEditorOn: boolean;
	favcategory: EnumDTO[];
	
	planSelect: boolean;
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
			assignEditorOn: false,
			favcategory: [],
			planSelect: false,
		}
		this.reload = this.reload.bind(this);
		this.loadFav = this.loadFav.bind(this);
		this.createPlan = this.createPlan.bind(this);
		this.assignAuto = this.assignAuto.bind(this);
		this.assignManuell = this.assignManuell.bind(this);
		this.assignPlan = this.assignPlan.bind(this);
		this.assignCategory = this.assignCategory.bind(this);
		this.onChange = this.onChange.bind(this);
		this.assignSelectedCategory = this.assignSelectedCategory.bind(this);
		this.assignDirect = this.assignDirect.bind(this);
		this.assignSelectedPlan = this.assignSelectedPlan.bind(this);
	}

	componentDidMount(): void {
		this.loadFav();
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

	loadFav(): void {
		var self = this;
		fetch('category/subenumfavorite')
			.then((response: Response) => response.text())
			.then((text: string) => { self.setState({ favcategory: myParseJson(text) }) })		
	}

	reload(): void {
		this.loadFav();
		this.lister.reload();
	}

	assignAuto(): void {
		fetch('assign/all')
			.then(this.reload);
	}

	assignCategory(): void {
		if (this.lister.hasSelectedData())
			this.setState({ assignEditorOn: true, planSelect: false });
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

	assignSelectedCategory(sub: number, t: string): void {
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
				self.setState({ assignEditorOn: false });
				self.reload();
			});
		}
		else {
			self.setState({ assignEditorOn: false });
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
		this.reload();
	}

	assignSelectedPlan(plan: Plan): void {
		var self = this;
		if (plan != undefined) {
			var self = this;
			fetch('assign/toplan/' + plan.id + '/' + this.state.planassign.id)
				.then(function() {
					self.setState({ planassign: undefined });
					self.reload();
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

	renderPlanSelect(): React.JSX.Element {
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
	
	assignDirect(inedx: number, entry: ContextMenuEntry<AccountRecord>) : void {
		let fav:EnumDTO = entry.data;
		this.assignSelectedCategory(fav.value,"");
	}
	
	renderAssignEditor(): JSX.Element {
		if (!this.state.assignEditorOn)
			return null;
		
		var record: AccountRecord = null;
		
		if (this.lister.getSelectedData().length == 1 )
			record = this.lister.getSelectedData().at(0);
		
		return <AssignEdit sendMessage={this.props.sendmessage} record={record} assignCatCallBack={(sub: number ,t:string) => this.assignSelectedCategory(sub,t)}/> ;
	}

	render(): React.JSX.Element {

		this.createLabel();
		
		let mainentries:ContextMenuEntry<AccountRecord>[] =  [
				{ name: this.menucatlabel, func: this.assignCategory },
				{ name: this.menuplanlabel, func: this.assignPlan },
				{ name: this.menusplitlabel, func: this.assignManuell },
				{ name: "------------", func: null }
				
			];
		let faventries:ContextMenuEntry<AccountRecord>[] = this.state.favcategory.map((e)=>{ return {name:e.text,func: this.assignDirect, data: e}; });

		var contextMenu: ContextMenuDef<AccountRecord>= {
			entries: mainentries.concat(faventries),
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
					menu={contextMenu}
					url='accountrecord/unassigned'
					lines={28}
					ext=''
					ref={(ref) => { this.lister = ref }} />
				{this.renderAssignEditor()}
			</div>
		)
	}
}
//				{this.state.categoryassign ? <CategoryAssign
//					text={this.state.deftext}
//					subcategory={this.state.defsubcategory}
//					category={this.state.defcategory}
//					handleAssign={(sub, text) => { this.assignSelected(sub, text) }} />
//					: null
//				}
//				{this.renderPlanSelect()}
