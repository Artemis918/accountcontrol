import * as React from 'react'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { MonthSelect } from '../utils/monthselect'
import { Plan } from '../utils/dtos'
import { useIntl, WrappedComponentProps } from 'react-intl'

import * as css from '../css/index.css'

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

export class _PlanSelect extends React.Component<PlanSelectProps & WrappedComponentProps, IState> {

    columns: ColumnInfo<Plan>[];
    lister: SingleSelectLister<Plan>;

    constructor( props: PlanSelectProps & WrappedComponentProps) {
        super( props );
        this.state = { year: this.props.year, month: this.props.month };
        this.setFilter = this.setFilter.bind( this );
        this.columns = [{
            header: this.label("date"),
            getdata: ( p: Plan ): string => { return p.plandate.toLocaleDateString( 'de-DE', { day: '2-digit', month: '2-digit' } ) }
        }, {
            header: this.label("details"),
            getdata: ( p: Plan ): string => { return p.shortdescription }
        }, {
            header: this.label("value"),
            cellrender: ( cell: CellInfo<Plan> ): JSX.Element => {
                return (
                    <div style={{
                        color: cell.data.value >= 0 ? 'green' : 'red',
                        textAlign: 'right'
                    }}>
                        {( cell.data.value / 100 ).toFixed( 2 )}
                    </div>
                )
            }
        }]
    }

	label(labelid:string):string {return this.props.intl.formatMessage({id: labelid}) }
		
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
                    width: '300px',
                    borderStyle: 'double',
                    background: 'gray',
                    textAlign: 'center'
                }}>
                    <MonthSelect label='' year={this.state.year} month={this.state.month} onChange={this.setFilter} />
                    <div style={{ padding: '10px' }}>
                        <SingleSelectLister<Plan>
                            ext={this.state.year + '/' + this.state.month}
                            url='plans/unassigned/'
                            lines={12}
                            handleSelect={this.props.onSelect}
                            columns={this.columns}
                            ref={( ref ) => { this.lister = ref }} />
                    </div>
                    <button onClick={() => this.props.onSelect( undefined )} 
                            className={css.addonbutton}>
                       {this.label("cancel")}
                    </button>
                </div>
            </div>
        )
    }
}

type CreatePlanSelect = (props:PlanSelectProps) => JSX.Element;

const PlanSelect:CreatePlanSelect = (props : PlanSelectProps) => {
    return (<_PlanSelect {...props} intl={useIntl()}/>);
}

export default PlanSelect;