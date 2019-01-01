/*
 * 
 */

import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";


export default class MultiSelectLister extends React.Component {
    
    constructor( props ) {
        super( props );
        var extensions = props.ext;
        if (extensions === undefined)
            extensions="";  
        this.state = { data: [], selected: undefined, ext: extensions };
        this.getTrProps = this.getTrProps.bind(this);
        this.changeSelected = this.changeSelected.bind(this);
    }

    componentDidMount() {
        this.reload();
    }
    
    setUrlExtension(extension) {
        if (extension === undefined)
            this.state.ext=""; 
        else
            this.state.ext=extension;
        this.reload();
    }

    reload() {
        var self = this;
        fetch( this.props.url + this.state.ext )
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
