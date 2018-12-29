/*
 * 
 */

import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";


export default class SingleSelectLister extends React.Component {
    
    constructor( props ) {
        super( props );
        this.state = { data: [], selected: undefined };
        this.getTrProps = this.getTrProps.bind(this);
        this.changeSelected = this.changeSelected.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
    }

    componentWillMount() {
        this.reload();
    }

    reload() {
        var self = this;
        fetch( this.props.url )
            .then( response => response.json() )
            .then( (d) => self.setState( { data : d, selected: undefined } ) );
    }

    changeSelected( index ) {
        this.setState( { selected: index } )
        this.props.handleChange( this.state.data[index].id);
    }
    
    getTrProps( rowInfo ) {
        var table = this;
        if ( rowInfo && rowInfo.row ) {
            return {
                onClick: (e) => this.changeSelected (rowInfo.index)
                ,style: {
                    background: rowInfo.index === this.state.selected ? '#00afec' : 'white',
                    color: rowInfo.index === this.state.selected ? 'white' : 'black'
                }
            }
        } else {
            return {}
        }
    }

    render() {
        return (
            <ReactTable
            getTrProps={(state, rowInfo, column, instance) => this.getTrProps( rowInfo )}
            defaultPageSize={10}
            data={this.state.data}
            columns={this.props.columns} />); 
    }
}
