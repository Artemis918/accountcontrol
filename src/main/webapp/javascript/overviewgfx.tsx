import * as React from 'react'
import { LineChart } from 'react-easy-chart'
import { MonthSelect } from './utils/monthselect'
import { StatsDTO, StatsMonthDTO } from './utils/dtos'
import { myParseJson } from './utils/misc'

export interface OverviewGFXProps {
}

interface LineData {
    x: string;
    y: string;
}

interface IState {
    startYear: number;
    endYear: number;
    startMonth: number;
    endMonth: number;
    tillEndOfYear: boolean;
    rangemin: number;
    rangemax: number;
    plandata: LineData[];
    realdata: LineData[];
    forecastdata: LineData[];
}

export class OverviewGFX extends React.Component<OverviewGFXProps, IState> {

    constructor( props: OverviewGFXProps ) {
        super( props );
        var today: Date = new Date();
        this.state = {
            tillEndOfYear: true,
            startYear: today.getFullYear(),
            endYear: today.getFullYear(),
            startMonth: 1,
            endMonth: today.getMonth(),
            plandata: [],
            realdata: [],
            forecastdata: [],
            rangemin: -2000,
            rangemax: 4000
        }
        this.reload = this.reload.bind( this );
        this.setData = this.setData.bind( this );
        this.changeEnd = this.changeEnd.bind( this );
        this.changeStart = this.changeStart.bind( this );
        this.changeEndOfYear = this.changeEndOfYear.bind( this );
    }

    componentDidMount(): void {
        this.reload(this.state.startYear,this.state.startMonth,this.state.endYear,this.state.endMonth,this.state.tillEndOfYear);
    }

    reload(startYear: number, startMonth: number, endYear: number, endMonth:number, currentYear: boolean ): void {
        
        this.setState( { endYear: endYear, endMonth: endMonth, startYear: startYear, startMonth: startMonth, tillEndOfYear: currentYear } );
        var self: OverviewGFX = this;
        var url: string = "/stats/real/" + startYear + "/" + startMonth + "/";

        if ( currentYear ) {
            var today: Date = new Date;
            url = url + today.getFullYear() + "/12";
        }
        else {
            url = url + endYear + "/" + endMonth;
        }

        fetch( url )
            .then( ( response: Response ) => response.text() )
            .then( ( text ) => { self.setData( myParseJson( text ) as StatsDTO ) } )
    }

    setData( stats: StatsDTO ): void {
        var endofreal: boolean = false;
        var plandata: LineData[] = [];
        var realdata: LineData[] = [];
        var forecastdata: LineData[] = [];
        var statsdata: StatsMonthDTO[] = stats.data;

        for ( var i: number = 0; i < statsdata.length; i++ ) {

            var stat = statsdata[i];
            var daystring: string = stat.day.toISOString().split( "T" )[0];

            if ( stat.forecast != 0 ) {
                forecastdata.push( { x: daystring, y: ( stat.forecast / 100 ).toFixed( 2 ) } )
            }

            plandata.push( { x: daystring, y: ( stat.planvalue / 100 ).toFixed( 2 ) } );
            if ( stat.value != 0 ) {
                realdata.push( { x: daystring, y: ( stat.value / 100 ).toFixed( 2 ) } )
            }
        }

        var minval: number = Math.floor(stats.min/10000)*100;
        var maxval: number = Math.ceil(stats.max/10000)*100;
        this.setState( { plandata: plandata, forecastdata: forecastdata, realdata: realdata, rangemin: minval, rangemax: maxval } );
    }

    changeStart( month: number, year: number ): void {
        this.reload(year,month,this.state.endYear,this.state.endMonth,this.state.tillEndOfYear);
    }

    changeEnd( month: number, year: number ): void {
        this.reload(this.state.startYear,this.state.startMonth,year,month,this.state.tillEndOfYear);
    }
    
    changeEndOfYear( ) {
        this.reload(this.state.startYear,this.state.startMonth,this.state.endYear,this.state.endMonth,!this.state.tillEndOfYear);        
    }

    renderEnde(): JSX.Element {
        if ( this.state.tillEndOfYear ) {
            return ( <input type='checkbox' checked={true} onClick={e => this.setState( { tillEndOfYear: false } )} /> )
        }
        else {
            return (
                <div>
                    
                    <MonthSelect label='Endmonat' onChange={this.changeEnd} year={this.state.endYear} month={this.state.endMonth} />
                    <input type='checkbox' checked={false} onClick={e => this.changeEndOfYear()} /> 
                    </div>
            );
        }
    }

    render(): JSX.Element {
        return ( <div>
            <MonthSelect label='Startmonat' onChange={this.changeStart} year={this.state.startYear} month={this.state.startMonth} />
            {this.renderEnde()}
            <LineChart
                width={750}
                height={500}
                yDomainRange={[this.state.rangemin, this.state.rangemax]}
                axes
                xType='time'
                datePattern='%Y-%m-%d'
                data={[
                    this.state.plandata,
                    this.state.realdata,
                    this.state.forecastdata
                ]}
            />
        </div>
        )
    }
}