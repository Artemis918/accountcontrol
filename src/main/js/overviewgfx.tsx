import * as React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,} from 'recharts';
import { MonthSelect } from './utils/monthselect'
import { StatsDTO, StatsMonthDTO } from './utils/dtos'
import { myParseJson } from './utils/misc'

export interface OverviewGFXProps {
}

interface LineData {
    x: string;
    y: string;
}

interface GraphData {
    month:string;
    value:number;
}

interface GraphSeries {
    name:string;
    color:string;
    data:GraphData[];
}

interface IState {
    startYear: number;
    endYear: number;
    startMonth: number;
    endMonth: number;
    tillEndOfYear: boolean;
    rangemin: number;
    rangemax: number;
    graphdata:GraphSeries[];
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
            graphdata: [],
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
        var url: string = "stats/real/" + startYear + "/" + startMonth + "/";

        if ( currentYear ) {
            var today: Date = new Date;
            url = url + today.getFullYear() + "/12";
        }
        else {
            url = url + endYear + "/" + endMonth;
        }

        fetch( url )
            .then( ( response: Response ) => response.text() )
            .then( ( text ) => { self.setData( myParseJson( text )) } )
    }
    
    setData( stats: StatsDTO ): void {
        var endofreal: boolean = false;
        var plandata: GraphData[] = [];
        var forecastdata: GraphData[] = [];
        var realdata: GraphData[] = [];
        var statsdata: StatsMonthDTO[] = stats.data;

        for ( var i: number = 0; i < statsdata.length; i++ ) {

            var stat = statsdata[i];
            var month: string = stat.day.toLocaleDateString(undefined, {year:"2-digit", month:"short"});

            if ( stat.forecast != 0 ) {
                forecastdata.push( { month: month, value: stat.forecast / 100 } )
            }

            plandata.push( { month: month, value: stat.planvalue / 100  } );
            if ( stat.value != 0 ) {
                realdata.push( { month: month, value: stat.value / 100 } );
            }
        }

        var minval: number = Math.floor(stats.min/10000)*100;
        var maxval: number = Math.ceil(stats.max/10000)*100;
        this.setState( { graphdata: [
                             { name: "Plan"    , data: plandata ,    color: "black"},
                             { name: "Forecast", data: forecastdata, color: "green" },
                             { name: "Real"    , data: realdata,     color: "red" }
                         ],
                         rangemin: minval,
                         rangemax: maxval 
                        }
                      );
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
            width={1000}
            height={500}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" type="category" allowDuplicatedCategory={false}/>
            <YAxis />
            <Tooltip />
            <Legend />
            {this.state.graphdata.map(s => (
                    <Line type="monotone" stroke={s.color} activeDot={{ r: 8 }} dataKey="value" data={s.data} name={s.name} key={s.name} />
                    ))}
          </LineChart>
        </div>
        )
    }
}