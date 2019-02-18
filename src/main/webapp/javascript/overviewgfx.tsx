import * as React from 'react'
import { LineChart } from 'react-easy-chart'
import { StatsDTO } from './utils/dtos'
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
    plandata: LineData[];
    realdata: LineData[];
    forecastdata: LineData[];
}

export class OverviewGFX extends React.Component<OverviewGFXProps, IState> {

    constructor( props: OverviewGFXProps ) {
        super( props );
        var today: Date = new Date();
        this.state = {
            startYear: 2018,
            endYear: 2018,
            startMonth: 1,
            endMonth: 12,
            plandata: [],
            realdata: [],
            forecastdata: []
        }
        this.reload = this.reload.bind( this );
        this.setData = this.setData.bind( this );
    }

    componentDidMount(): void {
        this.reload();
    }

    reload(): void {
        var self = this;
        fetch( "/stats/real/" + this.state.startYear + "/" + this.state.startMonth )
            .then( ( response: Response ) => response.text() )
            .then( ( text ) => { self.setData( myParseJson( text ) as StatsDTO[] ) } )
    }

    setData( statsdata: StatsDTO[] ): void {
        var endofreal: boolean = false;
        var plandata: LineData[] = [];
        var realdata: LineData[] = [];
        var forecastdata: LineData[] = [];
        var diffForForecast: number;
        var lastvalue: number;

        for ( var i: number = 0; i < statsdata.length; i++ ) {

            var stat = statsdata[i];

            if ( stat.value == lastvalue ) {
                if (realdata.length >=2 ) {
                    var lastdata: LineData = realdata[realdata.length - 2];
                    forecastdata.push( { x: lastdata.x, y: lastdata.y } )
                    lastdata = plandata[plandata.length - 1];
                    forecastdata.push( { x: lastdata.x, y: ( ( statsdata[i-1].value + diffForForecast ) / 100 ).toFixed( 2 ) } )
                }
                
                var lastplandata: LineData = realdata[realdata.length - 1];
                forecastdata.push( { x: lastplandata.x, y: lastplandata.y } )
                endofreal = true;
                lastvalue = 0;
            }
            var daystring: string = stat.day.toISOString().split( "T" )[0];
            plandata.push( { x: daystring, y: ( stat.planvalue / 100 ).toFixed( 2 ) } );
            if ( endofreal ) {
                forecastdata.push( { x: daystring, y: ( ( stat.value + diffForForecast ) / 100 ).toFixed( 2 ) } )
            }
            else {
                diffForForecast = stat.value - stat.planvalue;
                lastvalue = stat.value;
                realdata.push( { x: daystring, y: ( stat.value / 100 ).toFixed( 2 ) } )
            }
        }
        
        if (forecastdata.length == 0)
            forecastdata.push( { x: lastplandata.x, y: lastplandata.y });
            

        this.setState( { plandata: plandata, forecastdata: forecastdata, realdata: realdata } );
    }

    render(): JSX.Element {
        return ( <LineChart
            width={750}
            height={500}
            yDomainRange={[-4000, 8000 ]}
            axes
            xType='time'
            datePattern='%Y-%m-%d'
            data={[
                this.state.plandata,
                this.state.realdata,
                this.state.forecastdata
            ]}
        /> )
    }
}