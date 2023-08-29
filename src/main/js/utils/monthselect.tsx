import React from 'react'
import mcss from './css/monthselect.css'

export type OnMonthSelectCallback = ( month: number, year: number ) => void;

export interface MonthSelectProps {
    year: number;
    month: number;
    onChange: OnMonthSelectCallback;
    label: string
}

class CState {
    year: number;
    month: number;
}

export class MonthSelect extends React.Component<MonthSelectProps, CState> {

    constructor( props: MonthSelectProps ) {
        super( props );
        this.handleChange = this.handleChange.bind( this );
        this.state = { month: this.props.month, year: this.props.year };
    }
    
    handleChange( m: number, y: number ): void {

        this.setState( { month: m, year: y } );

        if ( y >= 2000 && y <= 3000 && m >= 1 && m <= 12 )
            this.props.onChange( m, y );
    }

    increaseMonth(): void {
        if ( this.state.month == 12 ) {
            var y: number = this.state.year;
            y++;
            this.handleChange( 1, y );
        }
        else {
            var m: number = this.state.month;
            m++;
            this.handleChange( m, this.state.year );
        }
    }

    decreaseMonth(): void {
        if ( this.state.month == 1 ) {
            var y: number = this.state.year;
            y--;
            this.handleChange( 12, y );
        }
        else {
            var m: number = this.state.month;
            m--;
            this.handleChange( m, this.state.year );
        }
    }

    render(): JSX.Element {
        return (
            <span>
                {this.props.label}
                <button onClick={() => this.decreaseMonth()} className={mcss.button} >{"<"}</button>
                <input className={mcss.monthNumber}
                    type='number' value={this.state.month}
                    min='1' max='12'
                    onChange={( e ) => this.handleChange( Number( e.target.value ), this.state.year )} />
                <input className={mcss.yearNumber}
                    type='number'
                    value={this.state.year}
                    min='2000' max='3000'
                    onChange={( e ) => this.handleChange( this.state.month, Number( e.target.value ) )} />
                <button className={mcss.button} onClick={() => this.increaseMonth()}>{">"}</button>
            </span>
        )
    }
}