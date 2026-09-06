import React from 'react'
import { label } from '../utils/misc'

import * as css from '../css/index.css'
import { TimeUnitSelector } from '../utils/timeunitselector'
import { ACDayPickerInput } from '../utils/acdaypickerinput'

type SendTimeRangeCallback = (timerangedata: TimeRangeData ) => void

export interface TimeRangeData {
    repeatcount: number,
    repeatunit: number,
    variance: number,
    startdate: Date,
}

interface TimeRangeEditorProps {
    rangedata: TimeRangeData;
    sendRange: SendTimeRangeCallback;
}

interface IState {
    repeatcount: number,
    repeatunit: number,
    variance: number,
    startdate: Date,
}

export class TimeRangeEditor extends React.Component<TimeRangeEditorProps, TimeRangeData> {

    constructor(props: TimeRangeEditorProps) {
        super(props);
        this.state = {
            repeatcount: props.rangedata.repeatcount,
            repeatunit: props.rangedata.repeatunit,
            variance: props.rangedata.variance,
            startdate: props.rangedata.startdate
        };
    }

    componentDidUpdate(prevProps: Readonly<TimeRangeEditorProps>, prevState: Readonly<{}>, snapshot?: any): void {
        if ( prevProps.rangedata.repeatcount != this.props.rangedata.repeatcount 
             || prevProps.rangedata.repeatunit != this.props.rangedata.repeatunit
             || prevProps.rangedata.variance != this.props.rangedata.variance
             || prevProps.rangedata.startdate != this.props.rangedata.startdate
        )
        {
            this.setState(this.props.rangedata);
        }
    }

    sendTimeRange() {
        this.props.sendRange(this.state);
    }

    render(): React.JSX.Element {
        return (
            <table>
                <tbody style={{ verticalAlign: 'top' }}>
                    <tr>
                        <td>{label("templates.repetition")}</td>
                        <td>
                            <span style={{ width: '20%' }}>
                                <input className={css.numbersmallinput} value={this.state.repeatcount}
                                    type='number'
                                    onChange={(e) => { this.setState ({repeatcount: e.target.valueAsNumber}); this.sendTimeRange() }} />
                            </span>
                            <span style={{ width: '20%' }}>
                                <TimeUnitSelector
                                    className={css.catselector3}
                                    curvalue={this.state.repeatunit}
                                    onChange={(e) => { this.setState({repeatunit: e}); this.sendTimeRange() }}
                                />
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>{label("templates.firstday")}</td>
                        <td><ACDayPickerInput
                            onChange={(d) => { this.setState({startdate: d}); this.sendTimeRange() }}
                            startdate={this.state.startdate} />
                        </td>
                    </tr>
                    <tr>
                        <td>{label("templates.variance")}</td>
                        <td><input value={this.state.variance}
                            className={css.numbersmallinput}
                            type='number'
                            onChange={(e) => { this.setState({variance:e.target.valueAsNumber}); this.sendTimeRange() }} />
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}
