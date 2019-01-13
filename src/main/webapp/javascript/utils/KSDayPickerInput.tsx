import * as React from 'react'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import {format, parse} from 'date-fns';


export type OnKSDayPickerCallback = (date: Date) => void;

export interface KSDayPickerProps {
    startdate: Date;
    onChange: OnKSDayPickerCallback;
}


export class KSDayPickerInput extends React.Component<KSDayPickerProps,{}> {

    constructor( props : KSDayPickerProps ) {
        super( props );
    }

    formatDate( date :Date, f : string ) :string {
        return format( date, f );
    }

    parseDate( str :string, f: string) :Date {
        const parsed: Date = parse( str, f, new Date());
        if ( parsed != undefined )  {
            return parsed;
        }
        return undefined;
    }
    
    render() : JSX.Element {
        const FORMAT :string = "dd.MM.yyyy";
        return (
                <DayPickerInput
                onDayChange={( d ) => this.props.onChange(d )}
                value={this.props.startdate}
                formatDate={this.formatDate}
                format={FORMAT}
                parseDate={this.parseDate}
                placeholder='DD.MM.YYYY'/>
                );
    }
}