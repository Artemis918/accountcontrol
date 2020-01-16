import * as React from 'react'
import { CategorySelector } from '../utils/categoryselector'
import { AccountRecord, Plan, Assignment } from '../utils/dtos'
import { PlanSelect } from './planselect'
import * as mcss from './css/assign.css'

type onCommitCallback = () => void;

export interface GuidedAssignProps {
    accountRecord: AccountRecord;
    onCommit: onCommitCallback;
}

interface IState {
    data: AssignPart[];
    planselect: boolean;
}

class AssignPart {
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

    getAssignment( accountRecord: AccountRecord ): Assignment {
        return {
            id: undefined,
            detail: this.details,
            description: this.details,
            istwert: accountRecord.wert >=0 ? this.betrag: this.betrag*-1,
            committed: false,
            plan: ( this.plan == undefined ) ? undefined : this.plan.id,
            accountrecord: accountRecord.id,
            subcategory: this.subcategory
        }
    }
}


export class GuidedAssign extends React.Component<GuidedAssignProps, IState> {

    constructor( props: GuidedAssignProps ) {
        super( props )
        var initial: AssignPart = new AssignPart( props.accountRecord.details, props.accountRecord.wert, 1, 1 );
        this.state = { data: [initial], planselect: false };
        this.setSubCategory = this.setSubCategory.bind( this );
        this.renderDetails = this.renderDetails.bind( this );
        this.renderSubCategory = this.renderSubCategory.bind( this );
        this.renderValue = this.renderValue.bind( this );
        this.addPlan = this.addPlan.bind( this );
        this.renderPlanSelect = this.renderPlanSelect.bind( this );
        this.recalcData = this.recalcData.bind( this );
        this.save = this.save.bind( this );
    }

    save(): void {
        var assignments: Assignment[] = this.state.data.map( ( t: AssignPart ) => { return t.getAssignment( this.props.accountRecord) } );
        assignments.forEach( ( z: Assignment ) => { z.committed = true } );

        var self: GuidedAssign = this;
        fetch( '/assign/parts', {
            method: 'post',
            body: JSON.stringify( assignments ),
            headers: {
                "Content-Type": "application/json"
            }
        } ).then( function( response ) {
            self.props.onCommit();
        } );

    }

    addPlan( plan: Plan ): void {
        if ( plan != undefined ) {
            var planbuchung: AssignPart = new AssignPart( plan.shortdescription, plan.wert, plan.subcategory, plan.category, plan )
            var data: AssignPart[] = this.state.data;
            data.splice( 0, 0, planbuchung );
            this.setState( { data: this.recalcData( data ), planselect: false } );
        }
        else
            this.setState( { planselect: false } );
    }

    setSubCategory( index: number, subcategory: number, group: number ): void {
        const data: AssignPart[] = this.state.data;
        data[index].subcategory = subcategory;
        data[index].category = group;
        this.setState( { data: data } );
    }


    recalcData( data: AssignPart[] ): AssignPart[] {
        var result: AssignPart[] = [];
        var sum: number = 0
        var recordValue = Math.abs(this.props.accountRecord.wert);

        for ( var row of data ) {
            if ( sum + row.betrag > recordValue ) {
                var betrag: number = recordValue - sum;
                row.betrag = betrag > 0 ? betrag : 0;
                row.wertstring = ( row.betrag / 100 ).toFixed( 2 );
            }
            result.push( row );
            sum += row.betrag;
        }

        if ( sum < recordValue ) {

            if ( result[result.length - 1].details == 'Rest' ) {
                result[result.length - 1].setBetrag( result[result.length - 1].betrag + recordValue - sum );
            }
            else {
                var newbuch: AssignPart = new AssignPart( 'Rest', recordValue - sum, result[result.length - 1].subcategory, result[result.length - 1].category )
                result.push( newbuch );
            }
        }
        return result;
    }

    removeLastRow(): void {
        var data: AssignPart[] = this.state.data;
        data[data.length - 2].setBetrag( data[data.length - 2].betrag + data[data.length - 1].betrag )
        data.splice( data.length - 1 , 1 );
        this.setState( { data: data } );
    }

    removeRow( index: number ): void {
        var data: AssignPart[] = this.state.data;
        data.splice( index, 1 );
        this.setState( { data: this.recalcData( data ) } );

    }

    renderDetails( index: number ): JSX.Element {
        return (
            <input type='text'
                value={this.state.data[index].details}
                className={mcss.maninput}
                onChange={e => {
                    const data: AssignPart[] = this.state.data;
                    data[index].details = e.target.value;
                    this.setState( { data } );
                }}
            />
        )
    }

    renderSubCategory( index: number ): JSX.Element {
        return (
            <CategorySelector horiz={true}
                subcategory={this.state.data[index].subcategory}
                category={this.state.data[index].category}
                onChange={( subcategory, category ) => this.setSubCategory( index, subcategory, category)} />
        )
    }

    renderValue( index: number ): JSX.Element {
        return (
            <input type='text'
                value={this.state.data[index].wertstring}
                className={mcss.maninput}
                onChange={( e: React.ChangeEvent<HTMLInputElement> ) => {
                    const data: AssignPart[] = this.state.data;
                    data[index].wertstring = e.target.value;
                    this.setState( { data } );

                }}
                onBlur={( e: React.FocusEvent<HTMLInputElement> ) => {
                    var newval: number = parseFloat( e.target.value.replace( ',', '.' ) ) * 100;
                    const data: AssignPart[] = this.state.data;
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
                <td>{this.renderSubCategory( index )}</td>
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
                        {this.state.data.map( ( d: AssignPart, i: number ) => this.renderRow( i ) )}
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