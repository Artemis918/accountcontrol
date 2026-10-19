import React from 'react'

import { PlanEditor } from './planeditor'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { MonthSelect } from '../utils//monthselect'
import { Plan } from '../utils/dtos'
import { SendMessage, MessageID } from '../utils/messageid'
import { label } from '../utils/misc'
import { CreationPopup } from './creationpopup'


interface PlaningProps {
    sendmessage: SendMessage;
}

interface IState {
    month: number;
    year: number;
    creationMonth: number;
    creationYear: number;
    creationPopup: boolean;
    plan: Plan | undefined;
}

export class Planing extends React.Component<PlaningProps, IState> {

    lister: SingleSelectLister<Plan> | null = null;
    editor: PlanEditor | null = null;

    constructor(props: PlaningProps) {
        super(props);
        var currentTime = new Date();

        this.state = {
            plan: undefined,
            month: currentTime.getMonth() + 1, year: currentTime.getFullYear(),
            creationMonth: currentTime.getMonth() + 1, creationYear: currentTime.getFullYear(),
            creationPopup: false
        };
        this.refreshlist = this.refreshlist.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.onPlansCreated = this.onPlansCreated.bind(this);
    }

    createColums(): ColumnInfo<Plan>[] {
        return [{
            header: label("date"),
            getdata: (data: Plan): string => { return data.plandate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) }
        }, {
            header: label("shortdescription"),
            getdata: (data: Plan): string => { return data.shortdescription }
        }, {
            header: label("category"),
            getdata: (data: Plan): string => { return data.categoryname + "/" + data.subcategoryname }
        }, {
            header: label("value"),
            cellrender: (cell: CellInfo<Plan>): React.JSX.Element => (

                <div style={{
                    color: cell.data.value >= 0 ? 'green' : 'red',
                    textAlign: 'right'
                }}>
                    {(cell.data.value / 100).toFixed(2)}
                </div>
            )
        }]
    }

    setFilter(m: number, y: number): void {
        this.setState({ year: y, month: m });
    }

    refreshlist() {
        this.lister?.reload();
    }

    onPlansCreated() {
        this.props.sendmessage(label("plan.planscreated"), MessageID.OK);
    }


    render(): React.JSX.Element {
        return (
            <table style={{ border: '1px solid black' }} testdata-id={"plans"}>
                <tbody>
                    <tr>
                        <td style={{ verticalAlign: 'top' }} >
                            <div style={{ border: '1px solid black', verticalAlign: 'top', paddingBottom: '160px' }}>
                                <PlanEditor onDetach={this.refreshlist} plan={this.state.plan} />
                            </div>
                            <CreationPopup onPlansCreated={this.onPlansCreated} />
                        </td>
                        <td style={{ verticalAlign: 'top' }}>
                            <div style={{ padding: '3px', borderBottom: '1px solid black' }}>
                                <MonthSelect label={label("plan.plansfor")} year={this.state.year} month={this.state.month} onChange={this.setFilter} />
                            </div>
                            <SingleSelectLister ref={(ref) => { this.lister = ref; }}
                                testdata-id={"planslister"}
                                lines={28}
                                ext={this.state.year + '/' + this.state.month}
                                handleChange={(data: Plan) => this.setState({ plan: data })}
                                columns={this.createColums()}
                                url='plans/list/' />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

}