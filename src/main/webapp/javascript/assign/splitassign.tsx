import * as React from 'react'
import {useIntl, WrappedComponentProps } from 'react-intl'
import { CategorySelector } from '../utils/categoryselector'
import { AccountRecord, Plan, Assignment } from '../utils/dtos'
import PlanSelect from './planselect'
import * as mcss from './css/assign.css'
import * as css from '../css/index.css'

type onCommitCallback = () => void;

export interface SplitAssignProps {
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


export class _SplitAssign extends React.Component<SplitAssignProps & WrappedComponentProps, IState> {

    constructor( props: SplitAssignProps & WrappedComponentProps) {
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
	
	label(labelid:string):string {return this.props.intl.formatMessage({id: labelid}) }

    save(): void {
        var assignments: Assignment[] = this.state.data.map( ( t: AssignPart ) => { return t.getAssignment( this.props.accountRecord) } );
        assignments.forEach( ( z: Assignment ) => { z.committed = true } );

        var self: _SplitAssign = this;
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
                className={mcss.descinput}
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
                className={mcss.descinput}
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
            return ( <button className={mcss.delbutton} onClick={e => { this.removeLastRow() }}>^</button> );

        }
        return ( <button className={mcss.delbutton} onClick={e => { this.removeRow( index ) }}>x</button> );
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
                <td style={{width: "50%"}}>{this.renderDetails( index )}</td>
                <td style={{width: "30%"}}>{this.renderSubCategory( index )}</td>
                <td style={{width: "10%"}}>{this.renderValue( index )}</td>
                <td style={{width: "5%"}}>{this.renderDelButton( index )}</td>
            </tr> )
    }

    render(): JSX.Element {
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>{this.label("details")}</th>
                            <th>{this.label("categories")}</th>
                            <th>{this.label("value")}</th>
                            <th>-</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map( ( d: AssignPart, i: number ) => this.renderRow( i ) )}
                    </tbody>
                </table>
                <button className={css.addonbutton} 
                        onClick={( e ) => this.setState( { planselect: true } )} > 
                    {this.label("assign.selectplan")} 
				</button>
                <button className={css.addonbutton} onClick={this.props.onCommit} >
                    {this.label("cancel")} 
 				</button>
                <button className={css.addonbutton} onClick={this.save} > 
					{this.label("save")}
				</button>
                {this.renderPlanSelect()}
            </div>
        )
    }
}

type CreateSplitAssign = (props:SplitAssignProps) => JSX.Element;

const SplitAssign:CreateSplitAssign = (props : SplitAssignProps) => {
    return (<_SplitAssign {...props} intl={useIntl()}/>);
}

export default SplitAssign;