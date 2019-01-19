import * as React from 'react'


type HandleChange = ( id: number ) => void;

export interface DropdownServiceProps {
    onChange: HandleChange;
    url: string;
    param?: string;
    value: number;
}

class CState {
    data: EnumDTO[];
}

interface EnumDTO {
    text: string;
    value: number;
}

export class DropdownService extends React.Component<DropdownServiceProps, CState> {
    
    constructor( props: DropdownServiceProps ) {
        super( props );
        this.state = { data: [{ text: '', value: 1 }] };
        this.handleChange = this.handleChange.bind( this );
        this.setparam = this.setparam.bind( this );
        this.fetchData = this.fetchData.bind( this );
        this.setData = this.setData.bind( this );
    }

    handleChange( value: string ) {
        this.props.onChange( parseInt( value ) );
    }

    componentDidMount() {
        this.fetchData( this.props.param );
    }

    setData( data: EnumDTO[] ): void {
        this.setState( { data: data } );
        if ( data.length > 0 )
            this.props.onChange( data[0].value );
    }

    fetchData( param: string ) :void {
        var url = this.props.url;
        if ( param != undefined ) {
            url = url + '/' + param;
        }
        if ( param == undefined || param != '' ) {
            fetch( url )
                .then( response => response.json() )
                .then( d => { this.setData( d as EnumDTO[] ) } )
        }
    }

    setparam( param: string ) {
        this.fetchData( param );
    }

    render() : JSX.Element{
        return (
            <select value={this.props.value} onChange={( e ) => this.handleChange( e.target.value )}>
                {this.state.data.map( ( t ) => <option key={t.value} value={t.value}>{t.text}</option> )}
            </select>
        );
    }

}