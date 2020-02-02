
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