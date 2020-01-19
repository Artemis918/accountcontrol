import * as React from 'react'
import { MultiSelectLister, ColumnInfo, CellInfo } from '../utils/multiselectlister';
import CategoryAssign from './categoryassign'
import { TemplateEditor } from '../planing/templateeditor';
import SplitAssign from './splitassign';
import PlanSelect from './planselect';
import { AccountRecord, Plan } from '../utils/dtos';
import { SendMessage, MessageID } from '../utils/messageid';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { useIntl, WrappedComponentProps } from 'react-intl';


import * as mcss from './css/assign.css'
import * as css from '../css/index.css'

type Create = (props:AssignProps) => JSX.Element;
export const Assign:Create = (props : AssignProps) => { return (<_Assign {...props} intl={useIntl()}/>);}

interface AssignProps {
    sendmessage: SendMessage;
}

interface IState {
    plan: number;
    planassign: AccountRecord;
    accountRecord: AccountRecord;
    categoryassign: boolean;
    deftext: string;
    defsubcategory: number;
    defcategory: number
}

const assignmenu:string = "assignmenu";

class _Assign extends React.Component<AssignProps & WrappedComponentProps, IState> {
	
	assignplanlabel:string;
	assignlabel:string;
	splitlabel:string;
	autolabel:string;
	planlabel:string;
	

    columns: ColumnInfo<AccountRecord>[] = [
        {
            header: 'Datum',
            getdata: ( data: AccountRecord ): string => { return data.wertstellung.toLocaleDateString( 'de-DE', { day: '2-digit', month: '2-digit' } ) }
        }, {
            header: 'Empf./Absender',
            cellrender: ( cellinfo: CellInfo<AccountRecord> ) => (
                <div>
                    {( cellinfo.data.wert > 0 ) ? cellinfo.data.absender : cellinfo.data.empfaenger}
                </div>
            )
        }, {
            header: 'Detail',
            getdata: ( data: AccountRecord ) => { return data.details },
        }, {
            header: 'Betrag',
            cellrender: ( cellinfo: CellInfo<AccountRecord> ) => (

                <div style={{
                    color: cellinfo.data.wert >= 0 ? 'green' : 'red',
                    textAlign: 'right'
                }}>
                    {( cellinfo.data.wert / 100 ).toFixed( 2 )}
                </div>

            )
        }];
    lister: MultiSelectLister<AccountRecord>;

    constructor( props: AssignProps & WrappedComponentProps ) {
        super( props )
        this.lister = undefined;
        this.state = { plan: undefined, planassign: undefined, accountRecord: undefined, categoryassign: false, deftext: "", defsubcategory: 1, defcategory: 1 }
        this.createPlan = this.createPlan.bind( this );
        this.assignAuto = this.assignAuto.bind( this );
        this.assignManuell = this.assignManuell.bind( this );
        this.assignPlan = this.assignPlan.bind( this );
        this.assignCategory = this.assignCategory.bind( this );
        this.onChange = this.onChange.bind( this );
        this.assignSelected = this.assignSelected.bind( this );
        this.assignSelectedPlan = this.assignSelectedPlan.bind( this );
    }

	label(labelid:string):string {return this.props.intl.formatMessage({id: labelid}) }

	createLabel():void {
		this.assignplanlabel = this.label("assign.assignplan");
		this.assignlabel = this.label("assign.catassign");
		this.splitlabel = this.label("assign.split");
		this.autolabel = this.label("assign.auto");
		this.planlabel = this.label("assign.plan");
		
		this.columns[0].header = this.label("date");
		this.columns[1].header = this.label("assign.receiver");
		this.columns[2].header = this.label("details");
		this.columns[3].header = this.label("value");
		
	}

    assignAuto(): void {
        fetch( 'assign/all' )
            .then( response => {
                response.json()
                this.lister.reload();
            }
            );
    }

    assignCategory(): void {
        if ( this.lister.hasSelectedData() )
            this.setState( { categoryassign: true } );
    }

    assignManuell(): void {
        var data: AccountRecord[] = this.lister.getSelectedData();
        if ( data.length != 1 ) {
            this.props.sendmessage( this.label("assign.onevalue"), MessageID.INVALID_DATA );
        }
        else {
            this.setState( { accountRecord: data[0] } )
        }
    }

    assignSelected( sub: number, t: string ): void {
        var self = this;
        if ( sub != undefined ) {
            var request = { text: t, subcategory: sub, ids: this.lister.getSelectedData().map( d => d.id ) };
            var self = this;
            var jsonbody = JSON.stringify( request );
            fetch( '/assign/tosubcategory', {
                method: 'post',
                body: jsonbody,
                headers: {
                    "Content-Type": "application/json"
                }
            } ).then( function( response ) {
                self.setState( { categoryassign: false } );
                self.lister.reload();
            } );
        }
        else {
            self.setState( { categoryassign: false } );
        }
    }

    createPlan(): void {
        var data: AccountRecord[] = this.lister.getSelectedData();
        if ( data.length != 1 ) {
            this.props.sendmessage( this.label("assign.onevalue"), MessageID.INVALID_DATA );
        }
        else {
            this.setState( { plan: data[0].id } )
        }
    }

    onChange(): void {
        this.setState( { plan: undefined, accountRecord: undefined } );
        this.lister.reload();
    }

    assignSelectedPlan( plan: Plan ): void {
        var self = this;
        if ( plan != undefined ) {
            var self = this;
            fetch( '/assign/toplan/' + plan.id + '/' + this.state.planassign.id )
                .then( function( response ) {
                    self.setState( { planassign: undefined } );
                    self.lister.reload();
                } );
        }
        else
            this.setState( { planassign: undefined } );
    }

    assignPlan(): void {
        var data: AccountRecord[] = this.lister.getSelectedData();
        if ( data.length != 1 ) {
            this.props.sendmessage( this.label("assign.onevalue"), MessageID.INVALID_DATA );
        }
        else {
            this.setState( { planassign: data[0] } )
        }
    }

    renderPlanSelect(): JSX.Element {
        if ( this.state.planassign != undefined ) {
		var date: Date = this.state.planassign.eingang;
            return ( <PlanSelect month={date.getMonth()} year={date.getFullYear()} onSelect={this.assignSelectedPlan} /> );
        }
        else
            return null;
    }

	renderContextMenu():JSX.Element {
		return (
				<ContextMenu id={assignmenu} hideOnLeave={true} className={mcss.assigncontext}>
					
				    <MenuItem onClick={this.assignCategory} className={mcss.assigncontextitem}>
                       {this.assignlabel}
                    </MenuItem>
				    <MenuItem onClick={this.assignPlan} className={mcss.assigncontextitem}>
					   {this.assignplanlabel}
		            </MenuItem>
				    <MenuItem onClick={this.assignManuell} className={mcss.assigncontextitem}>
                       {this.splitlabel}
                    </MenuItem>
				</ContextMenu>
		)
    }

    render(): JSX.Element {
		this.createLabel();

        if ( this.state.plan !== undefined ) {
            return <TemplateEditor accountRecord={this.state.plan} onChange={() => this.onChange()} />
        }

        if ( this.state.accountRecord !== undefined ) {
            return <SplitAssign accountRecord={this.state.accountRecord} onCommit={() => this.onChange()} />
        }

        return (
	        <div>
                <div className={css.actionbar}>
                    <button className={css.actionbutton} onClick={( e ) => this.assignAuto()}>{this.autolabel}</button> |
					<button className={css.actionbutton} onClick={( e ) => this.assignCategory()}>{this.assignlabel}</button>
                    <button className={css.actionbutton} onClick={( e ) => this.assignManuell()}>{this.splitlabel}</button>
                    <button className={css.actionbutton} onClick={( e ) => this.assignPlan()}>{this.assignplanlabel}</button> |                  
					<button className={css.actionbutton} onClick={( e ) => this.createPlan()}>{this.planlabel}</button>
                </div>
                <div>
                    <ContextMenuTrigger id={assignmenu} >´					
                    <MultiSelectLister<AccountRecord> columns={this.columns}
                        url='record/unassigned'
                        lines={28}
                        ext=''
                        ref={( ref ) => { this.lister = ref }} />
					</ContextMenuTrigger>
                </div>
                {this.state.categoryassign ? <CategoryAssign
                    text={this.state.deftext}
                    subcategory={this.state.defsubcategory}
                    category={this.state.defcategory}
                    handleAssign={( sub, text ) => { this.assignSelected( sub, text ) }} />
                    : null
                }
                {this.renderPlanSelect()}
				{this.renderContextMenu()}
            </div>
        )
    }
}

