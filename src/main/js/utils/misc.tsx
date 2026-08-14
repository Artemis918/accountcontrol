import { IntlShape, useIntl } from "react-intl";

export function myParseJson( text: string ): any {
    return JSON.parse( text, datereviver );
}

function datereviver( _key: string, value: string ): any {
    if ( typeof ( value ) === 'string' && value.match( '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' ) != null ) {
        return new Date( value );
    }
    else
        return value;
}

var _intl: IntlShape | null = null;
type Create = () => React.JSX.Element | null;
export const IntlStore: Create = () => { _intl = useIntl(); return null; }
export function label(labelid: string): string { return _intl!.formatMessage({ id: labelid }) }
export function getIntl(): IntlShape { return _intl! }


