import React from 'react'
import { label } from '../utils/misc'

type HandleChange = ( id: number ) => void;

export interface MatchStyleProps {
    onChange: HandleChange;
	curvalue: number;
	className: string;
}

export function MatchStyleSelector( props: MatchStyleProps) :React.JSX.Element {
	return (
            <select className={props.className}
                    value={ props.curvalue } 
                    onChange={( e: React.ChangeEvent<HTMLSelectElement> ) => 
                                    props.onChange(parseInt( e.target.value ))}>
                <option key={0} value={0}> {label("exact")} </option> 
                <option key={1} value={1}> {label("maxvalue")} </option> 
                <option key={2} value={2}> {label("maxsum")} </option> 
                <option key={3} value={3}> {label("pattern")} </option> 
            </select>
	)
}
