import React from 'react'
import * as mcss from './css/monthselect.css'

export type OnMonthSelectCallback = (month: number, year: number) => void;

export interface MonthSelectProps {
    year: number;
    month: number;
    onChange: OnMonthSelectCallback;
    label: string
}

class CState {
    year: string = "";
    month: string = "";
}

export class MonthSelect extends React.Component<MonthSelectProps, CState> {

    constructor(props: MonthSelectProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = { month: this.props.month.toString(), year: this.props.year.toString() };
    }

    componentDidUpdate(prevProps: MonthSelectProps) {
        if (this.props.month != prevProps.month || this.props.year != prevProps.year) {
            this.setState({ month: this.props.month.toString(), year: this.props.year.toString() });
        }
    }

    handleMonthChange(m: string): void {
        if (m.match(/^\d{0,2}$/)) {
            this.setState({ month: m, year: this.state.year });
        }
    }

    handleYearChange(y: string): void {
        if (y.match(/^\d{0,4}$/)) {
            this.setState({ month: this.state.month, year: y });
        }
    }

    handleChange(m: number, y: number): void {

        this.setState({ month: m.toString(), year: y.toString() });
        if (y >= 2000 && y <= 3000 && m >= 1 && m <= 12)
            this.props.onChange(m, y);
    }


    private sendData(): void {
        var m = Number(this.state.month);
        var y = Number(this.state.year);
        if (y >= 2000 && y <= 3000 && m >= 1 && m <= 12)
            this.props.onChange(m, y);
    }

    increaseMonth(): void {
        var m = Number(this.state.month);
        var y = Number(this.state.year);
        if (m == 12) {
            this.handleChange(1, y + 1);
        }
        else {
            this.handleChange(m + 1, y);
        }
    }

    decreaseMonth(): void {
        var m = Number(this.state.month);
        var y = Number(this.state.year);
        if (m == 1) {
            this.handleChange(12, y - 1);
        }
        else {
            this.handleChange(m - 1, y);
        }
    }

    render(): React.JSX.Element {
        return (
            <span>
                {this.props.label}
                <button testdata-id={"monthdown"} onClick={() => this.decreaseMonth()} className={mcss.button} >{"<"}</button>
                <input className={mcss.monthNumber}
                    testdata-id="monthselect-month"
                    value={this.state.month}
                    onChange={(e) => this.handleMonthChange(e.target.value)}
                    onBlur={() => this.sendData()} />
                <input className={mcss.yearNumber}
                    testdata-id="monthselect-year"
                    value={this.state.year}
                    onChange={(e) => this.handleYearChange(e.target.value)}
                    onBlur={() => this.sendData()} />
                <button testdata-id={"monthup"} className={mcss.button} onClick={() => this.increaseMonth()}>{">"}</button>
            </span>
        )
    }
}