import React from 'react'
import MultiSelectLister from 'utils/multiselectlister';
import TemplateEditor from 'templateeditor';
import "react-table/react-table.css";

export default class Buchen extends React.Component {

    constructor( props ) {
        super( props )
        this.lister = undefined;
        this.state = { plan: undefined }
        this.createPlan = this.createPlan.bind( this );
        this.onChange = this.onChange.bind( this );
    }

    assignAuto() {
        fetch( 'http://localhost:8080/assign/all' ).then( response => response.json() );
        this.lister.reload();
    }

    createPlan() {
        var data = lister.getSelectedData();
        if ( data.length != 1 ) {
            this.props.sendmessage( "es muss genau ein Beleg selektiert sein", true );
        }
        else {
            this.setState( { plan: data.id } )
        }
    }

    onChange() {
        this.setState( { plan: undefined } );
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
            return <TemplateEditor beleg={this.state.plan} onChange={() => this.onChange()} />
        }
        return (
            <table>
                <tbody>
                    <tr>
                        <td>
                            <MultiSelectLister columns={columns} 
                             url='http://localhost:8080/belege/unassigned'
                             ref={(ref)=>{this.lister=ref}}/>
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