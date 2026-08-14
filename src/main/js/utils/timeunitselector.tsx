import React from 'react'
import { label } from './misc';

type HandleChange = ( id: number ) => void;

export interface TimeUnitProps {
    onChange: HandleChange;
	curvalue: number;
	className: string;
}

export function TimeUnitSelector( props: TimeUnitProps) :React.JSX.Element 
{
	return (
            <select className={props.className}
                    value={ props.curvalue } 
                    onChange={( e: React.ChangeEvent<HTMLSelectElement> ) => 
                                    props.onChange(parseInt( e.target.value ))}>
                <option key={0} value={0}> {label("day")} </option> 
                <option key={1} value={1}> {label("week")} </option> 
                <option key={2} value={2}> {label("month")} </option> 
                <option key={3} value={3}> {label("year")} </option> 
            </select>
	)
}
