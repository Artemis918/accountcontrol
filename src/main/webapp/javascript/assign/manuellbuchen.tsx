import * as React from 'react'
import { CategorySelector } from '../utils/categoryselector'
import { BuchungsBeleg, Plan, Zuordnung } from '../utils/dtos'
import { PlanSelect } from './planselect'
import * as mcss from './css/manuellbuchen.css'

type onCommitCallback = () => void;

export interface ManuellBuchenProps {
    beleg: BuchungsBeleg;
    onCommit: onCommitCallback;
}

interface IState {
    data: TeilBuchung[];
    planselect: boolean;
}

class TeilBuchung {
    betrag: number;
    details: string;
    subcategory: number;
    category: number;
    wertstring: string;
    plan?: Plan;

    constructor( details: string, wert: number, subcategory: number, category: number, plan?: Plan ) {
        this.setBetrag( wert );
        this.subcategory = subcategory;
        this.category = category;
        this.details = details;
        this.plan = plan;
    }

    setBetrag( wert: number ): void {
        this.wertstring = ( Math.abs( wert ) / 100 ).toFixed( 2 );
        this.betrag = Math.abs(wert);
    }

    getZuordnung( beleg: BuchungsBeleg ): Zuordnung {
        return {
            id: undefined,
            detail: this.details,
            description: this.details,
            istwert: beleg.wert >=0 ? this.betrag: this.betrag*-1,
            committed: false,
            plan: ( this.plan == undefined ) ? undefined : this.plan.id,
            beleg: beleg.id,
            konto: this.subcategory
        }
    }
}


export class ManuellBuchen extends React.Component<ManuellBuchenProps, IState> {

    constructor( props: ManuellBuchenProps ) {
        super( props )
        var initial: TeilBuchung = new TeilBuchung( props.beleg.details, props.beleg.wert, 1, 1 );
        this.state = { data: [initial], planselect: false };
        this.setKonto = this.setKonto.bind( this );
        this.renderDetails = this.renderDetails.bind( this );
        this.renderKonto = this.renderKonto.bind( this );
        this.renderValue = this.renderValue.bind( this );
        this.addPlan = this.addPlan.bind( this );
        this.renderPlanSelect = this.renderPlanSelect.bind( this );
        this.recalcData = this.recalcData.bind( this );
        this.save = this.save.bind( this );
    }

    save(): void {
        var zuordnungen: Zuordnung[] = this.state.data.map( ( t: TeilBuchung ) => { return t.getZuordnung( this.props.beleg) } );
        zuordnungen.forEach( ( z: Zuordnung ) => { z.committed = true } );

        var self: ManuellBuchen = this;
        fetch( '/assign/parts', {
            method: 'post',
            body: JSON.stringify( zuordnungen ),
            headers: {
                "Content-Type": "application/json"
            }
        } ).then( function( response ) {
            self.props.onCommit();
        } );

    }

    addPlan( plan: Plan ): void {
        if ( plan != undefined ) {
            var planbuchung: TeilBuchung = new TeilBuchung( plan.shortdescription, plan.wert, plan.konto, plan.kontogroup, plan )
            var data: TeilBuchung[] = this.state.data;
            data.splice( 0, 0, planbuchung );
            this.setState( { data: this.recalcData( data ), planselect: false } );
        }
        else
            this.setState( { planselect: false } );
    }

    setKonto( index: number, konto: number, group: number ): void {
        const data: TeilBuchung[] = this.state.data;
        data[index].subcategory = konto;
        data[index].category = group;
        this.setState( { data: data } );
    }


    recalcData( data: TeilBuchung[] ): TeilBuchung[] {
        var result: TeilBuchung[] = [];
        var sum: number = 0
        var belegwert = Math.abs(this.props.beleg.wert);

        for ( var row of data ) {
            if ( sum + row.betrag > belegwert ) {
                var betrag: number = belegwert - sum;
                row.betrag = betrag > 0 ? betrag : 0;
                row.wertstring = ( row.betrag / 100 ).toFixed( 2 );
            }
            result.push( row );
            sum += row.betrag;
        }

        if ( sum < belegwert ) {

            if ( result[result.length - 1].details == 'Rest' ) {
                result[result.length - 1].setBetrag( result[result.length - 1].betrag + belegwert - sum );
            }
            else {
                var newbuch: TeilBuchung = new TeilBuchung( 'Rest', belegwert - sum, result[result.length - 1].subcategory, result[result.length - 1].category )
                result.push( newbuch );
            }
        }
        return result;
    }

    removeLastRow(): void {
        var data: TeilBuchung[] = this.state.data;
        data[data.length - 2].setBetrag( data[data.length - 2].betrag + data[data.length - 1].betrag )
        data.splice( data.length - 1 , 1 );
        this.setState( { data: data } );
    }

    removeRow( index: number ): void {
        var data: TeilBuchung[] = this.state.data;
        data.splice( index, 1 );
        this.setState( { data: this.recalcData( data ) } );

    }

    renderDetails( index: number ): JSX.Element {
        return (
            <input type='text'
                value={this.state.data[index].details}
                className={mcss.maninput}
                onChange={e => {
                    const data: TeilBuchung[] = this.state.data;
                    data[index].details = e.target.value;
                    this.setState( { data } );
                }}
            />
        )
    }

    renderKonto( index: number ): JSX.Element {
        return (
            <CategorySelector horiz={true}
                subcategory={this.state.data[index].subcategory}
                category={this.state.data[index].category}
                onChange={( subcategory, category ) => this.setKonto( index, subcategory, category)} />
        )
    }

    renderValue( index: number ): JSX.Element {
        return (
            <input type='text'
                value={this.state.data[index].wertstring}
                className={mcss.maninput}
                onChange={( e: React.ChangeEvent<HTMLInputElement> ) => {
                    const data: TeilBuchung[] = this.state.data;
                    data[index].wertstring = e.target.value;
                    this.setState( { data } );

                }}
                onBlur={( e: React.FocusEvent<HTMLInputElement> ) => {
                    var newval: number = parseFloat( e.target.value.replace( ',', '.' ) ) * 100;
                    const data: TeilBuchung[] = this.state.data;
                    data[index].setBetrag( newval == NaN ? data[index].betrag : newval );
                    this.setState( { data: this.recalcData( this.state.data ) } );
                }}
            />
        )
    }

    renderDelButton( index: number ): JSX.Element {
        if ( index == this.state.data.length - 1 ) {
            return ( <button onClick={e => { this.removeLastRow() }}>^</button> );

        }
        return ( <button onClick={e => { this.removeRow( index ) }}>x</button> );
    }

    renderPlanSelect(): JSX.Element {
        if ( this.state.planselect == true ) {
            var now: Date = new Date;
            return ( <PlanSelect month={now.getMonth() + 1} year={now.getFullYear()} onSelect={this.addPlan} /> );
        }
        else
            return ( <div /> );
    }

    renderRow( index: number ): JSX.Element {
        return (
            <tr key={'row' + index}>
                <td>{this.renderDetails( index )}</td>
                <td>{this.renderKonto( index )}</td>
                <td>{this.renderValue( index )}</td>
                <td>{this.renderDelButton( index )}</td>
            </tr> )
    }

    render(): JSX.Element {
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Details</th>
                            <th>Subkategorie</th>
                            <th>Betrag</th>
                            <th>-</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map( ( d: TeilBuchung, i: number ) => this.renderRow( i ) )}
                    </tbody>
                </table>
                <span style={{ width: '30%' }}><button onClick={( e ) => this.setState( { planselect: true } )} > Select Plan </button> </span>
                <span style={{ width: '30%' }}><button onClick={this.props.onCommit} > Abbrechen </button></span>
                <span style={{ width: '30%' }}><button onClick={this.save} > Speichern </button></span>
                {this.renderPlanSelect()}
            </div>
        )
    }
}