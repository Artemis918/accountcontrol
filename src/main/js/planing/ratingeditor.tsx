import React from 'react'
import { label } from '../utils/misc'

import { Pattern } from '../utils/dtos'
import * as css from '../css/index.css'
import { ACDayPickerInput } from '../utils/acdaypickerinput'
import { CategorySelector } from '../utils/categoryselector'
import { MatchStyleSelector } from '../utils/matchstyleselector'

export type SendDataCallback = (data: RatingData) => void

export interface RatingData {
    position: number;
    subCategory: number | undefined;
    matchstyle: number;
    value: number;
}

export interface RatingEditorProps {
    data: RatingData;
    sendData: SendDataCallback;
}

export class RatingEditor extends React.Component<RatingEditorProps, RatingData> {

    constructor(props: RatingEditorProps) {
        super(props);
        this.state = {
            position: this.props.data.position,
            subCategory: this.props.data.subCategory,
            matchstyle: this.props.data.matchstyle,
            value: this.props.data.value
        };
        this.sendData = this.sendData.bind(this);
    }

    componentDidUpdate(prevProps: RatingEditorProps) {
        if (prevProps.data.position != this.props.data.position
            || prevProps.data.subCategory != this.props.data.subCategory
            || prevProps.data.matchstyle != this.props.data.matchstyle
            || prevProps.data.value != this.props.data.value) {
            this.setState({
                position: this.props.data.position,
                subCategory: this.props.data.subCategory,
                matchstyle: this.props.data.matchstyle,
                value: this.props.data.value
            });
        }
    }

    sendData(newdata: Partial<RatingData>): void {
        const newstate = { ...this.state, ...newdata };
        this.setState(newstate);
        this.props.sendData(newstate);
    }


    render(): React.JSX.Element {
        return (
            <div className={css.boxborder} >
                <div className={css.boxinnerpart} >
                    <label className={css.boxlabel} > {label("plan.plandata")}</label>
                    <table>
                        <tbody>
                            <tr><td>{label("plan.position")}</td>
                                <td><input value={this.state.position}
                                    testdata-id='position'
                                    type='number'
                                    className={css.numbersmallinput}
                                    onChange={(e) => { this.sendData({ position: e.target.valueAsNumber }) }}
                                />
                                </td>
                            </tr>
                            <tr><td>{label("category")}</td>
                                <td colSpan={3}>
                                    <CategorySelector
                                        horiz={true}
                                        onChange={(sub?: number) => { this.sendData({ subCategory: sub }) }}
                                        subcategory={this.state.subCategory}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>{label("value")}</td>
                                <td>
                                    <input step="0.01" value={this.state.value / 100}
                                        type='number'
                                        testdata-id='value'
                                        className={css.numbersmallinput}
                                        onChange={(e) => { this.sendData({ value: Number(e.target.valueAsNumber * 100) }) }}
                                    />
                                </td>
                                <td>{label("plan.matchstyle")}</td>
                                <td>
                                    <MatchStyleSelector
                                        curvalue={this.state.matchstyle}
                                        className={css.catselector3}
                                        onChange={(e) => { this.sendData({ matchstyle: e }) }}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}