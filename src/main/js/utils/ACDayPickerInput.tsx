import React, { RefObject, useRef } from 'react'
import { DayPicker } from 'react-day-picker';
import { Popper } from 'react-popper';
import { parse, format, Locale } from 'date-fns';
import { enGB, de } from 'date-fns/locale'
import css from '../css/index.css';


export type OnACDayPickerCallback = (date: Date) => void;

export interface ACDayPickerProps {
    startdate: Date;
    onChange: OnACDayPickerCallback;
	locale: string;
}

interface IState {
	date: Date;
	dateString: string;
	pickerOn: boolean;
}

export class ACDayPickerInput extends React.Component<ACDayPickerProps,IState> {

	locale: Locale;
	popperRef: RefObject<HTMLDivElement>;
	
    constructor( props : ACDayPickerProps ) {
        super( props );
        this.locale = this.props.locale == 'de' ? de : enGB;
        this.popperRef = null;
        
        this.state = {
			date: this.props.startdate, 
			dateString: this.formatDate(this.props.startdate), 
			pickerOn: false
		} 
		this.setDayPicker = this.setDayPicker.bind(this);
		this.renderDayPicker = this.renderDayPicker.bind(this);
		this.parseNewDate = this.parseNewDate.bind(this);
		this.setNewDate = this.setNewDate.bind(this);
		this.formatDate = this.formatDate.bind(this);
    }
    
    setDayPicker(on: boolean) :void {
		this.setState({pickerOn: on});
	}

    parseNewDate(newdate: string): void {
        const parsed: Date = parse( newdate, 'P', new Date(),{locale: this.locale} );
        if ( parsed == undefined || isNaN(parsed.getTime()) || parsed.getFullYear() < 1970)  {
            return undefined;
        }
        if (parsed != this.state.date) {
        	this.setState({date: parsed})
        	this.props.onChange(parsed);
        }
    }
    
    
    formatDate(d: Date): string {
		if (d == undefined) {
			return "--.--.----";
		}
		else {
			return format(d,'P',{locale: this.locale})
		}
	}
    
    setNewDate(d: Date): void {
		const ds: string = this.formatDate(d);
		if (ds != this.state.dateString) {
			this.setState({date:d, dateString: ds})
			this.props.onChange(d);
		}
	}
    
    renderDayPicker(): JSX.Element {
		if (this.state.pickerOn) {
		  return (
			  <DayPicker
              	 mode='single'
                 onSelect={( d:Date ) => this.setNewDate(d)}
                 selected={this.state.date}
              />)
		}
		else 
			return null; 
	}
    
    render() : JSX.Element {
        return (
			<div> 
			    <input 
			     onFocus={()=>this.setDayPicker(true)} 
			     onBlur={()=>()=>this.setDayPicker(false)}
			     value={this.state.dateString}
			     onChange={(e)=>this.parseNewDate(e.target.value)}
			     className={css.stringinput}
			     />
			     {this.renderDayPicker()}
             </div>
         );
    }
}