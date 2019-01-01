/*
 * 
 */

import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";


export default class SelectLister extends React.Component {
    
    constructor( props ) {
        super( props );
        var extensions = props.ext;
        if (extensions === undefined)
            extensions="";  
        this.state = { data: [], ext: extensions };
        this.getTrProps = this.getTrProps.bind(this);
        this.setUrlExtension = this.setUrlExtension.bind(this);
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

    getTrProps( rowInfo ) {
        var table = this;
        if ( rowInfo && rowInfo.row ) {
            return {
                onClick: (e) => this.props.handleSelect (e.shiftKey, e.ctrlKey , rowInfo.index)
                ,style: {
                    background: this.props.isSelected(rowInfo.index) ? '#00afec' : 'white',
                    color: this.props.isSelected(rowInfo.index) ? 'white' : 'black'
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
            columns={this.props.columns}/>); 
    }
}
