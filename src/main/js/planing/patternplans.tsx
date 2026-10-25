import React from 'react'

import { SingleSelectLister, ColumnInfo } from '../utils/singleselectlister'
import { Dropdown } from '../utils/dropdown'
import { Plan } from '../utils/dtos'
import { PatternPlanEditor } from './patternplaneditor'
import { SendMessage } from '../utils/messageid'
import { label } from '../utils/misc'
import * as css from '../css/index.css'

interface PatternPlansProps {
    sendmessage: SendMessage;
}

interface IState {
    category: number | undefined;
    plan: Plan | undefined;
}

export class PatternPlans extends React.Component<PatternPlansProps, IState> {

    lister: SingleSelectLister<Plan> | null = null;
    editor: PatternPlanEditor | null = null;

    constructor(props: PatternPlansProps) {
        super(props);
        this.refreshlist = this.refreshlist.bind(this);
        this.state = { category: 1, plan: undefined };
    }

    createColumns(): ColumnInfo<Plan>[] {
        return [{
            header: label("shortdescription"),
            getdata: (data: Plan): string => { return data.shortdescription }
        }, {
            header: label("category"),
            getdata: (data: Plan): string => { return data.categoryname }
        }, {
            header: label("subcategory"),
            getdata: (data: Plan): string => { return data.subcategoryname }
        }]
    }

    refreshlist() {
        this.lister?.reload();
    }

    render(): React.JSX.Element {
        return (
            <table style={{ border: '1px solid black' }} testdata-id={"pattern"}>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid black', verticalAlign: 'top' }}>
                            <div className={css.editortitle}> {label("pattern.patterndata")} </div>
                            <PatternPlanEditor onDetach={this.refreshlist} plan= {this.state.plan} />
                        </td>
                        <td testdata-id={"patternlist"} style={{ verticalAlign: 'top' }}>
                            <div style={{ padding: '1px', borderBottom: '1px solid black' }}>
                                <Dropdown onChange={(val: number | undefined): void => this.setState({ category: val })}
                                    className={css.catselector3}
                                    testdataid='catselector'
                                    url='category/catenum/true'
                                    value={this.state.category}
                                />
                            </div>
                            <SingleSelectLister ref={(ref) => { this.lister = ref; }}
                                lines={30}
                                testdata-id={"patternlister"}
                                handleChange={(data: Plan) => this.setState({plan: data})}
                                columns={this.createColumns()}
                                ext={this.state.category?.toString(10)}
                                url='plans/patternplans/' />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

}