import * as React from 'react'
import { useIntl, WrappedComponentProps } from 'react-intl'
import { CategorySelector } from '../utils/categoryselector'
import { AccountRecord, Plan, Assignment } from '../utils/dtos'
import { PlanSelect } from './planselect'
import * as mcss from './css/assign.css'
import * as css from '../css/index.css'

type Create = (props:SplitAssignProps) => JSX.Element;
export const SplitAssign:Create = (p) => { return (<_SplitAssign {...p} intl={useIntl()}/>); }


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
    value: number;
    details: string;
    subcategory: number;
    category: number;
    valuestring: string;
    plan?: Plan;

    constructor( details: string, value: number, subcategory: number, category: number, plan?: Plan ) {
        this.setValue( value );
        this.subcategory = subcategory;
        this.category = category;
        this.details = details;
        this.plan = plan;
    }

    setValue( v: number ): void {
        this.valuestring = ( Math.abs( v ) / 100 ).toFixed( 2 );
        this.value = Math.abs(v);
    }

    getAssignment( accountRecord: AccountRecord ): Assignment {
        return {
            id: undefined,
            detail: this.details,
            description: this.details,
            real: accountRecord.value >=0 ? this.value: this.value*-1,
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
        var initial: AssignPart = new AssignPart( props.accountRecord.details, props.accountRecord.value, 1, 1 );
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
        } ).then( function() {
            self.props.onCommit();
        } );

    }

    addPlan( plan: Plan ): void {
        if ( plan != undefined ) {
            var planbuchung: AssignPart = new AssignPart( plan.shortdescription, plan.value, plan.subcategory, plan.category, plan )
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
        var recordValue = Math.abs(this.props.accountRecord.value);

        for ( var row of data ) {
            if ( sum + row.value > recordValue ) {
                var value: number = recordValue - sum;
                row.value = value > 0 ? value : 0;
                row.valuestring = ( row.value / 100 ).toFixed( 2 );
            }
            result.push( row );
            sum += row.value;
        }

        if ( sum < recordValue ) {

            if ( result[result.length - 1].details == 'Rest' ) {
                result[result.length - 1].setValue( result[result.length - 1].value + recordValue - sum );
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
        data[data.length - 2].setValue( data[data.length - 2].value + data[data.length - 1].value )
        data.splice( data.length - 1 , 1 );
        this.setState( { data: data } );
    }

    removeRow( index: number ): void {
        var data: AssignPart[] = this.state.data;
        data.splice( index, 1 );
        this.setState( { data: this.recalcData( data ) } );

    }

    renderDetails( details: string, index:number ): JSX.Element {
        return (
            <input type='text'
                value={details}
                className={mcss.descinput}
                onChange={e => {
                    const data: AssignPart[] = this.state.data;
                    data[index].details = e.target.value;
                    this.setState( { data } );
                }}
            />
        )
    }

    renderSubCategory( subcategory:number, category:number, index: number ): JSX.Element {
        return (
            <CategorySelector horiz={true}
                subcategory={subcategory}
                category={category}
                onChange={( subcategory, category ) => this.setSubCategory( index, subcategory, category)} />
        )
    }

    renderValue( value: string, index: number ): JSX.Element {
        return (
            <input type='text'
                value={value}
                className={mcss.descinput}
                onChange={( e: React.ChangeEvent<HTMLInputElement> ) => {
                    const data: AssignPart[] = this.state.data;
                    data[index].valuestring = e.target.value;
                    this.setState( { data } );

                }}
                onBlur={( e: React.FocusEvent<HTMLInputElement> ) => {
                    var newval: number = parseFloat( e.target.value.replace( ',', '.' ) ) * 100;
                    const data: AssignPart[] = this.state.data;
                    data[index].setValue( newval == NaN ? data[index].value : newval );
                    this.setState( { data: this.recalcData( this.state.data ) } );
                }}
            />
        )
    }

    renderDelButton( index: number ): JSX.Element {
        if ( index == this.state.data.length - 1 ) {
            return ( <button className={mcss.delbutton} onClick={() => { this.removeLastRow() }}>^</button> );

        }
        return ( <button className={mcss.delbutton} onClick={() => { this.removeRow( index ) }}>x</button> );
    }

    renderPlanSelect(): JSX.Element {
        if ( this.state.planselect == true ) {
            var now: Date = new Date;
            return ( <PlanSelect month={now.getMonth() + 1} year={now.getFullYear()} onAssign={this.addPlan} /> );
        }
        else
            return ( <div /> );
    }

    renderRow( data: AssignPart , index: number ): JSX.Element {
        return (
            <tr key={'row' + index}>
                <td style={{width: "50%"}}>{this.renderDetails( data.details , index)}</td>
                <td style={{width: "30%"}}>{this.renderSubCategory( data.subcategory, data.category, index )}</td>
                <td style={{width: "10%"}}>{this.renderValue( data.valuestring, index )}</td>
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
                        {this.state.data.map( ( d: AssignPart, i: number ) => this.renderRow( d ,i ) )}
                    </tbody>
                </table>
                <button className={css.addonbutton} 
                        onClick={() => this.setState( { planselect: true } )} > 
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