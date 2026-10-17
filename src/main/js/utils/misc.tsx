import { formatISO } from "date-fns";
import { IntlShape, useIntl } from "react-intl";

export function myStringify( object: any ): string {
    return JSON.stringify( object, dateReplacer );
}

var dateReplacer = function(this:any, key: string, value: any ): any {

   if (this[key] instanceof Date) {
      return formatISO(value).substring(0, 10);
   }
   
   return value;
}

export function myParseJson( text: string ): any {
    return JSON.parse( text, dateReviver );
}

var dateReviver = function( _key: string, value: string ): any {
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


