import * as React from 'react'
import { useIntl, IntlShape } from 'react-intl'

type HandleChange = ( id: number ) => void;

export interface TimeRangeProps {
    onChange: HandleChange;
	curvalue: number;
	className: string;
}

export function TimeRangeSelector( props: TimeRangeProps) :JSX.Element {
	const intl: IntlShape = useIntl();
	return (
            <select className={props.className}
                    value={ props.curvalue } 
                    onChange={( e: React.ChangeEvent<HTMLSelectElement> ) => 
                                    props.onChange(parseInt( e.target.value ))}>
                <option key={0} value={0}> {intl.formatMessage({id: "day"})} </option> 
                <option key={1} value={1}> {intl.formatMessage({id: "week"})} </option> 
                <option key={2} value={2}> {intl.formatMessage({id: "month"})} </option> 
                <option key={3} value={3}> {intl.formatMessage({id: "year"})} </option> 
            </select>
	)
}
