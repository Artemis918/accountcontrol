import React from 'react'
import { MultiSelectLister } from 'utils/multiselectlister';
import { KontoAssign } from 'konten/kontoassign'
import { TemplateEditor } from 'planing/templateeditor';
import "react-table/react-table.css";

export default class Buchen extends React.Component {

    constructor( props ) {
        super( props )
        this.lister = undefined;
        this.state = { plan: undefined, kontoassign: false }
        this.createPlan = this.createPlan.bind( this );
        this.onChange = this.onChange.bind( this );
        this.assignSelected = this.assignSelected.bind( this );
    }

    assignAuto() {
        fetch( 'http://localhost:8080/assign/all' ).then( response => response.json() );
        this.lister.reload();
    }

    assignKonto() {
        if ( this.lister.hasSelectedData() )
            this.setState( { kontoassign: true } );
    }

    assignManuell() {
    }

    assignSelected( k, t ) {
        var self = this;
        if ( k != undefined ) {
            var request = { text: t, konto: k, ids: this.lister.getSelectedData().map( d => d.id ) };
            var self = this;
            var jsonbody = JSON.stringify( request );
            fetch( '/assign/tokonto', {
                method: 'post',
                body: jsonbody,
                headers: {
                    "Content-Type": "application/json"
                }
            } ).then( function( response ) {
                self.setState( { kontoassign: false } );
            } );
        }
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
            <div>
                <button className="button" onClick={( e ) => this.assignAuto()}> Automatisch </button>
                <button className="button" onClick={( e ) => this.assignKonto()}> Konto </button>
                <button className="button" onClick={( e ) => this.assignManuel()}> Manuell </button>
                <button className="button" onClick={( e ) => this.createPlan()}> Planen </button>
                <div>
                    <MultiSelectLister columns={columns}
                        url='http://localhost:8080/belege/unassigned'
                        ref={( ref ) => { this.lister = ref }} />
                </div>
                {this.state.kontoassign ? <KontoAssign handleAssign={( k, t ) => { this.assignSelected( k, t ) }} /> : null
                }
            </div>
        )
    }
}