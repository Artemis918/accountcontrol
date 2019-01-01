import React from 'react'
import ReactTable from "react-table";
import TemplateEditor from "templateeditor";
import "react-table/react-table.css";


export default class Buchen extends React.Component {

    constructor( props ) {
        super( props )
        this.handleSelect = this.handleSelect.bind( this );
        this.state = { data: [], 
                       selected1: undefined, 
                       selected2: undefined, 
                       selectedHi: undefined, 
                       selectedLo: undefined, 
                       plan: undefined }
        this.createPlan = this.createPlan.bind(this);
        this.handleSelect = this.handleSelect.bind( this );
        this.onChange = this.onChange.bind( this );
    }

    assignAuto() {
        fetch( 'http://localhost:8080/assign/all' ).then( response => response.json() );
        this.componentWillMount();
    }

    handleSelect( shiftKey, row ) {
        if ( shiftKey == true && this.state.selected2 != undefined ) {
            var row1 = this.state.selected2;
            this.setState( {
                selected1: row1,
                selected2: row,
                selectedHi: row1 > row ? row1 : row,
                selectedLo: row1 > row ? row : row1
            } )
        }
        else {
            this.setState( {
                selected1: row,
                selected2: row,
                selectedHi: row,
                selectedLo: row
            } )
        }
    }

    componentWillMount() {
        console.log( "loading belege" );
        fetch( 'http://localhost:8080/belege/unassigned' )
            .then( response => response.json() )
            .then( (d) => this.setState( { data: d } ) );
    }

    createPlan() {
        if ( this.state.selectedHi != this.state.selectedLo ) {
            this.props.sendmessage( "es darf nur ein Beleg selektiert sein", true );
        }
        else {
            var beleg = this.state.data[this.state.selectedLo];
            this.setState({plan: beleg.id })
        }
    }
    
    onChange() {
        this.setState({plan: undefined});
    }

    render() {
        var columns = [{
            Header: 'Datum',
            accessor: 'date',
            width: '150'
        }, {
            Header: 'Empf./Absender',
            accessor: 'partner',
            width: '400'
        }, {
            Header: 'Detail',
            accessor: 'details',
            width: '30%'
        }, {
            Header: 'Betrag',
            accessor: 'betrag',
            width: '150',
            Cell: row => (

                <div style={{
                    color: row.value >= 0 ? 'green' : 'red',
                    textAlign: 'right'
                }}>
                    {( row.value / 100 ).toFixed( 2 )}
                </div>

            )
        }];

        if ( this.state.plan !== undefined ) {
            return <TemplateEditor beleg = {this.state.plan} onChange={() => this.onChange()}/>
        }
        return (
            <table>
                <tbody>
                    <tr>
                        <td>
                            <ReactTable
                                data={this.state.data}
                                columns={columns}
                                getTrProps={( state, rowInfo ) => {
                                    if ( rowInfo && rowInfo.row ) {
                                        return {
                                            onClick: ( e ) => { this.handleSelect( e.shiftKey, rowInfo.index ) },
                                            style: { background: this.state.selectedLo != undefined && rowInfo.index >= this.state.selectedLo && rowInfo.index <= this.state.selectedHi ? 'white' : null }
                                        }
                                    } else {
                                        return {}
                                    }
                                }
                                }
                            />
                        </td>
                        <td style={{ verticalAlign: "top" }}>
                            <table>
                                <tbody>
                                    <tr> <td> <button className="button" onClick={( e ) => this.assignAuto()}> Automatisch </button> </td></tr>
                                    <tr> <td> <button className="button" onClick={( e ) => this.assignManuel()}> Manuell </button></td></tr>
                                    <tr> <td> <button className="button" onClick={( e ) => this.createPlan()}> Planen </button></td></tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table >
        )
    }
}