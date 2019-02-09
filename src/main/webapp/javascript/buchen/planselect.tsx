import * as React from 'react'
import { SingleSelectLister } from '../utils/singleselectlister'
import { MonthSelect } from '../utils/monthselect'
import { Column } from 'react-table'
import { Plan } from '../utils/dtos'

type OnSelectCallBack = ( plan: Plan ) => void;

export interface PlanSelectProps {
    onSelect: OnSelectCallBack;
    month: number
    year: number;
}

interface IState {
    month: number;
    year: number
}

export class PlanSelect extends React.Component<PlanSelectProps, IState> {

    columns: Column[];
    lister: SingleSelectLister<Plan>;

    constructor( props: PlanSelectProps ) {
        super( props );
        this.state = { year: this.props.year, month: this.props.month };
        this.setFilter = this.setFilter.bind(this);
        this.columns = [{
            Header: 'Datum',
            accessor: 'plandate',
        }, {
            Header: 'Beschreibung',
            accessor: 'shortdescription',
        }, {
            Header: 'Betrag',
            accessor: 'wert',
            Cell: ( row: any ) => (

                <div style={{
                    color: row.value >= 0 ? 'green' : 'red',
                    textAlign: 'right'
                }}>
                    {( row.value / 100 ).toFixed( 2 )}
                </div>
            )
        }]
    }

    setFilter( m: number, y: number ): void {
        this.setState( { year: y, month: m } )
    }

    render(): JSX.Element {
        return (
            <div style={{
                position: 'fixed',
                zIndex: 2,
                left: '0', top: '0', width: '100%', height: '100%'
            }}>
                <div style={{
                    margin: '15% auto',
                    padding: '20px',
                    border: '2px',
                    borderStyle: 'double',
                    width: '500px',
                    background: 'gray'
                }}>
                    <span>
                        <MonthSelect label='' year={this.state.year} month={this.state.month} onChange={this.setFilter} />
                        <button onClick={()=>this.props.onSelect(undefined)}>Cancel</button> 
                    </span>
                    <SingleSelectLister<Plan>
                        ext={this.state.year + '/' + this.state.month}
                        url='plans/unassigned/'
                        handleSelect={this.props.onSelect}
                        columns={this.columns}
                        ref={(ref)=>{this.lister=ref}} />
                </div>
            </div>
        )


    }

}