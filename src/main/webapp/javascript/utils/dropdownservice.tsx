import * as React from 'react'
import {EnumDTO} from './dtos'


type HandleChange = ( id: number ) => void;

export interface DropdownServiceProps {
    onChange: HandleChange;
    url: string;
    param?: string;
    value: number;
}

class CState {
    data: EnumDTO[];
    value: number;
}

export class DropdownService extends React.Component<DropdownServiceProps, CState> {
    
    constructor( props: DropdownServiceProps ) {
        super( props );
        this.state = { data: [{ text: '', value: 1 }], value: undefined };
        this.handleChange = this.handleChange.bind( this );
        this.setparam = this.setparam.bind( this );
        this.fetchData = this.fetchData.bind( this );
        this.setData = this.setData.bind( this );
    }

    handleChange( value: string ) {
        var v: number = parseInt(value);
        this.setState({value: v});
        this.props.onChange( v );
    }

    componentDidMount() {
        this.fetchData( this.props.param );
    }

    setData( data: EnumDTO[] ): void {
        this.setState( { data: data } );
        if ( data.length > 0 ) {
            if (this.state.value == undefined && this.props.value != undefined ) {
                this.setState({value: this.props.value});
            }
            else {
                this.setState({value: data[0].value});
                this.props.onChange( data[0].value );
            }
        }
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
            <select value={this.state.value} onChange={( e: React.ChangeEvent<HTMLSelectElement>) => this.handleChange( e.target.value )}>
                {this.state.data.map( ( t ) => <option key={t.value} value={t.value}>{t.text}</option> )}
            </select>
        );
    }

}