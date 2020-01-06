import * as React from 'react'
import { MultiSelectLister, ColumnInfo, CellInfo } from '../utils/multiselectlister';
import { CategoryAssign } from './categoryassign'
import { TemplateEditor } from '../planing/templateeditor';
import { GuidedAssign } from './guidedassign';
import { PlanSelect } from './planselect';
import { AccountRecord, Plan } from '../utils/dtos'

import * as css from '../css/index.css'

type SendMessage = ( m: string, error: boolean ) => void



interface AssignProps {
    sendmessage: SendMessage;
}

interface IState {
    plan: number;
    planassign: number;
    accountRecord: AccountRecord;
    categoryassign: boolean;
    deftext: string;
    defsubcategory: number;
    defcategory: number
}

export class Assign extends React.Component<AssignProps, IState> {

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

    constructor( props: AssignProps ) {
        super( props )
        this.lister = undefined;
        this.state = { plan: undefined, planassign: undefined, accountRecord: undefined, categoryassign: false, deftext: "", defsubcategory: 1, defcategory: 1 }
        this.createPlan = this.createPlan.bind( this );
        this.onChange = this.onChange.bind( this );
        this.assignSelected = this.assignSelected.bind( this );
        this.assignSelectedPlan = this.assignSelectedPlan.bind( this );
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
            this.props.sendmessage( "es muss genau ein Beleg selektiert sein", true );
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
            this.props.sendmessage( "es muss genau ein Beleg selektiert sein", true );
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
            fetch( '/assign/toplan/' + plan.id + '/' + this.state.planassign )
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
            this.props.sendmessage( "es muss genau ein Beleg selektiert sein", true );
        }
        else {
            this.setState( { planassign: data[0].id } )
        }
    }

    renderPlanSelect(): JSX.Element {
        if ( this.state.planassign != undefined ) {
            var now: Date = new Date;
            return ( <PlanSelect month={now.getMonth() + 1} year={now.getFullYear()} onSelect={this.assignSelectedPlan} /> );
        }
        else
            return null;
    }

    render(): JSX.Element {

        if ( this.state.plan !== undefined ) {
            return <TemplateEditor accountRecord={this.state.plan} onChange={() => this.onChange()} />
        }

        if ( this.state.accountRecord !== undefined ) {
            return <GuidedAssign accountRecord={this.state.accountRecord} onCommit={() => this.onChange()} />
        }

        return (
            <div>
                <div className={css.actionbar}>
                    <button className={css.actionbutton} onClick={( e ) => this.assignAuto()}>Automatisch</button>
                    <button className={css.actionbutton} onClick={( e ) => this.assignCategory()}>Kategorie</button>
                    <button className={css.actionbutton} onClick={( e ) => this.assignManuell()}>Manuell</button>
                    <button className={css.actionbutton} onClick={( e ) => this.assignPlan()}>Plan Zuweisen</button>
                    <button className={css.actionbutton} onClick={( e ) => this.createPlan()}>Planen</button>
                </div>
                <div>
                    <MultiSelectLister<AccountRecord> columns={this.columns}
                        url='record/unassigned'
                        lines={28}
                        ext=''
                        ref={( ref ) => { this.lister = ref }} />
                </div>
                {this.state.categoryassign ? <CategoryAssign
                    text={this.state.deftext}
                    subcategory={this.state.defsubcategory}
                    category={this.state.defcategory}
                    handleAssign={( sub, text ) => { this.assignSelected( sub, text ) }} />
                    : null
                }
                {this.renderPlanSelect()}
            </div>
        )
    }
}