import React from 'react'
import ReactTable from "react-table";
import "react-table/react-table.css";


export default class TemplateList extends React.Component {
    constructor( props ) {
        super( props );
        this.state = { data: [], selected: undefined };
        this.getTrProps = this.getTrProps.bind(this);
        this.changeSelected = this.changeSelected.bind(this);
    }

    componentDidMount() {
        this.reload();
    }

    reload() {
        var self = this;
        fetch( 'http://localhost:8080/templates/list' )
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
        var columns = [{
            Header: 'Gültig von',
            accessor: 'gueltigVon',
            width: '100px'
        }, {
            Header: 'Gültig bis',
            accessor: 'gueltigBis',
            width: '100px'
        }, {
            Header: 'Rhythmus',
            accessor: 'rhythm',
            width: '100px'
        }, {
            Header: 'Beschreibung',
            accessor: 'shortdescription',
            width: '50%'
        }, {
            Header: 'Betrag',
            accessor: 'betrag',
            width: '100px',
            Cell: row => (

                <div style={{
                    color: row.value >= 0 ? 'green' : 'red',
                    textAlign: 'right'
                }}>
                    {( row.value / 100 ).toFixed( 2 )}
                </div>
            )
        }]

        return ( <ReactTable
            getTrProps={(state, rowInfo, column, instance) => this.getTrProps( rowInfo )}
            defaultPageSize={10}
            data={this.state.data}
            columns={columns} /> );
    }
}