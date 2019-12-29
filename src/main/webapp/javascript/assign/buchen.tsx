import * as React from 'react'
import { MultiSelectLister, ColumnInfo, CellInfo } from '../utils/multiselectlister';
import { KontoAssign } from './kontoassign'
import { TemplateEditor } from '../planing/templateeditor';
import { ManuellBuchen } from './manuellbuchen';
import { PlanSelect } from './planselect';
import { BuchungsBeleg, Plan } from '../utils/dtos'

import * as css from '../css/index.css'

type SendMessage = ( m: string, error: boolean ) => void



interface BuchenProps {
    sendmessage: SendMessage;
}

interface IState {
    plan: number;
    planassign: number;
    beleg: BuchungsBeleg;
    kontoassign: boolean;
    deftext: string;
    defkonto: number;
    defgroup: number
}

export class Buchen extends React.Component<BuchenProps, IState> {

    columns: ColumnInfo<BuchungsBeleg>[] = [
        {
            header: 'Datum',
            getdata: ( data: BuchungsBeleg ): string => { return data.wertstellung.toLocaleDateString( 'de-DE', { day: '2-digit', month: '2-digit' } ) }
        }, {
            header: 'Empf./Absender',
            cellrender: ( cellinfo: CellInfo<BuchungsBeleg> ) => (
                <div>
                    {( cellinfo.data.wert > 0 ) ? cellinfo.data.absender : cellinfo.data.empfaenger}
                </div>
            )
        }, {
            header: 'Detail',
            getdata: ( data: BuchungsBeleg ) => { return data.details },
        }, {
            header: 'Betrag',
            cellrender: ( cellinfo: CellInfo<BuchungsBeleg> ) => (

                <div style={{
                    color: cellinfo.data.wert >= 0 ? 'green' : 'red',
                    textAlign: 'right'
                }}>
                    {( cellinfo.data.wert / 100 ).toFixed( 2 )}
                </div>

            )
        }];
    lister: MultiSelectLister<BuchungsBeleg>;

    constructor( props: BuchenProps ) {
        super( props )
        this.lister = undefined;
        this.state = { plan: undefined, planassign: undefined, beleg: undefined, kontoassign: false, deftext: "", defkonto: 1, defgroup: 1 }
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

    assignKonto(): void {
        if ( this.lister.hasSelectedData() )
            this.setState( { kontoassign: true } );
    }

    assignManuell(): void {
        var data: BuchungsBeleg[] = this.lister.getSelectedData();
        if ( data.length != 1 ) {
            this.props.sendmessage( "es muss genau ein Beleg selektiert sein", true );
        }
        else {
            this.setState( { beleg: data[0] } )
        }
    }

    assignSelected( k: number, t: string ): void {
        var self = this;
        if ( k != undefined ) {
            var request = { text: t, konto: k, ids: this.lister.getSelectedData().map( d => d.id ) };
            var self = this;
            var jsonbody = JSON.stringify( request );
            fetch( '/assign/tokonto', {
                method: 'post',
                body: jsonbody,
                headers: {
                    "Content-Type": "application/json"
                }
            } ).then( function( response ) {
                self.setState( { kontoassign: false } );
                self.lister.reload();
            } );
        }
        else {
            self.setState( { kontoassign: false } );
        }
    }

    createPlan(): void {
        var data: BuchungsBeleg[] = this.lister.getSelectedData();
        if ( data.length != 1 ) {
            this.props.sendmessage( "es muss genau ein Beleg selektiert sein", true );
        }
        else {
            this.setState( { plan: data[0].id } )
        }
    }

    onChange(): void {
        this.setState( { plan: undefined, beleg: undefined } );
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
        var data: BuchungsBeleg[] = this.lister.getSelectedData();
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
            return <TemplateEditor beleg={this.state.plan} onChange={() => this.onChange()} />
        }

        if ( this.state.beleg !== undefined ) {
            return <ManuellBuchen beleg={this.state.beleg} onCommit={() => this.onChange()} />
        }

        return (
            <div>
                <div className={css.actionbar}>
                    <button className={css.actionbutton} onClick={( e ) => this.assignAuto()}>Automatisch</button>
                    <button className={css.actionbutton} onClick={( e ) => this.assignKonto()}>Konto</button>
                    <button className={css.actionbutton} onClick={( e ) => this.assignManuell()}>Manuell</button>
                    <button className={css.actionbutton} onClick={( e ) => this.assignPlan()}>Plan Zuweisen</button>
                    <button className={css.actionbutton} onClick={( e ) => this.createPlan()}>Planen</button>
                </div>
                <div>
                    <MultiSelectLister<BuchungsBeleg> columns={this.columns}
                        url='belege/unassigned'
                        lines={28}
                        ref={( ref ) => { this.lister = ref }} />
                </div>
                {this.state.kontoassign ? <KontoAssign
                    text={this.state.deftext}
                    konto={this.state.defkonto}
                    group={this.state.defgroup}
                    handleAssign={( k, t ) => { this.assignSelected( k, t ) }} />
                    : null
                }
                {this.renderPlanSelect()}
            </div>
        )
    }
}