import React from 'react'
import { useIntl, IntlShape } from 'react-intl'

type HandleChange = ( id: number ) => void;

export interface MatchStyleProps {
    onChange: HandleChange;
	curvalue: number;
	className: string;
}

export function MatchStyleSelector( props: MatchStyleProps) :JSX.Element {
	const intl: IntlShape = useIntl();
	return (
            <select className={props.className}
                    value={ props.curvalue } 
                    onChange={( e: React.ChangeEvent<HTMLSelectElement> ) => 
                                    props.onChange(parseInt( e.target.value ))}>
                <option key={0} value={0}> {intl.formatMessage({id: "exact"})} </option> 
                <option key={1} value={1}> {intl.formatMessage({id: "maxvalue"})} </option> 
                <option key={2} value={2}> {intl.formatMessage({id: "maxsum"})} </option> 
                <option key={3} value={3}> {intl.formatMessage({id: "pattern"})} </option> 
            </select>
	)
}
