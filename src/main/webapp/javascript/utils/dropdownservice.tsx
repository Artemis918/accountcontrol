import * as React from 'react'
import { EnumDTO } from './dtos'


type HandleChange = ( id: number ) => void;

export interface DropdownServiceProps {
    onChange: HandleChange;
    url: string;
    param?: string;
    value: number;
	className?: string;
}

interface IState {
    data: EnumDTO[];
}

export class DropdownService extends React.Component<DropdownServiceProps, IState> {

    constructor( props: DropdownServiceProps ) {
        super( props );
        this.state = { data: []};
        this.handleChange = this.handleChange.bind( this );
        this.fetchData = this.fetchData.bind( this );
        this.setData = this.setData.bind( this );
    }
    
    componentDidUpdate(prevProps: DropdownServiceProps) :void {
        if ( this.props.param != prevProps.param )
            this.fetchData();   
        if ( this.props.value != prevProps.value )
            this.setState({data: this.state.data } );
    }

    componentDidMount() :void {
        this.fetchData();     
    }

    handleChange( value: string ) {
        var v: number = parseInt( value );
        if (v != this.props.value )
            this.props.onChange( v );
    }

    setData( data: EnumDTO[] ): void {
        this.setState( { data: data } );
        if (this.props.value == undefined)
            this.props.onChange(data[0].value);
    }

    fetchData(): void {        
        var url = this.props.url;
        var param = this.props.param;
        if ( param != undefined ) {
            url = url + '/' + param;
        }
        if ( param == undefined || param != '' ) {
            var self: DropdownService = this;
            fetch( url )
                .then( response => response.json() )
                .then( d => { self.setData( d as EnumDTO[] ) } )
        }
    }

    render(): JSX.Element {
        return (
            <select className={this.props.className} value={this.props.value} 
                    onChange={( e: React.ChangeEvent<HTMLSelectElement> ) => this.handleChange( e.target.value )}>
                {this.state.data.map( ( t ) => <option key={t.value} value={t.value}>{t.text}</option> )}
            </select>
        );
    }

}