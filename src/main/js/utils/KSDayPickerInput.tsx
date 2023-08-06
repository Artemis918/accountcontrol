import * as React from 'react'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css'
import kcss from './css/ksdaypickerinput.css'
import css from '../css/index.css'

import 'moment/locale/de';


export type OnKSDayPickerCallback = (date: Date) => void;

export interface KSDayPickerProps {
    startdate: Date;
    onChange: OnKSDayPickerCallback;
	locale: string;
}


export class KSDayPickerInput extends React.Component<KSDayPickerProps,{}> {

    constructor( props : KSDayPickerProps ) {
        super( props );
		this.localParseDate = this.localParseDate.bind(this);
    }

    localParseDate( str :string, f: string) :Date {
        const parsed: Date = MomentLocaleUtils.parseDate( str, f, this.props.locale);
        if ( parsed == undefined || isNaN(parsed.getTime()) || parsed.getFullYear() < 1970)  {
            return undefined;
        }
        return parsed;
    }
    
    render() : JSX.Element {
        return (
                <DayPickerInput			
				classNames={{container: kcss.input, overlayWrapper: kcss.inputOverlayWrapper, overlay: kcss.inputOverlay}}
				inputProps= {{className: css.stringinput}}
                onDayChange={( d:Date ) => this.props.onChange(d)}
                value={this.props.startdate}
				format={'L'}
                formatDate={MomentLocaleUtils.formatDate}
                parseDate={this.localParseDate}
				placeholder={"-"}
		        dayPickerProps={{ locale: this.props.locale, localeUtils: MomentLocaleUtils }}
                />
                );
    }
}