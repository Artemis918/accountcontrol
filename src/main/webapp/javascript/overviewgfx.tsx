import * as React from 'react'
import { LineChart } from 'react-easy-chart'

export interface OverviewGFXProps {
}

interface IState {
    startYear: number;
    endYear: number;
    startMonth: number;
    endMonth: number
}

export class OverviewGFX extends React.Component<OverviewGFXProps,IState> {
    
    constructor(props: OverviewGFXProps) {
        super(props);
    }
    
    render() : JSX.Element {
        return (  <LineChart
                data={[
                [
                  { x: 1, y: 20 },
                  { x: 2, y: 10 },
                  { x: 3, y: 25 }
                ]
              ]}
            />)
    }
}