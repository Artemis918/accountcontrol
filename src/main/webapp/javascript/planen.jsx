import React from 'react'
//import TemplateEditor from 'templateeditor.jsx'
import SingleSelectLister from 'singleselectlister.jsx'

export default class Planen extends React.Component {

    constructor( props ) {
        super( props );
        this.state = { changed: false };
        this.refreshlist = this.refreshlist.bind( this );
        this.refresheditor = this.refresheditor.bind( this );
        this.listComponent = undefined;
        this.editorComponent = undefined;
        this.plancolumns = [{
            Header: 'Gültig von',
            accessor: 'gueltigVon',
            width: '100px'
        }, {
            Header: 'Gültig bis',
            accessor: 'gueltigBis',
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
    }

    refreshlist() {
        this.listComponent.reload();
    }

    refresheditor( templateid ) {
        this.editorComponent.setTemplate( templateid );
    }

    render() {
        return (
            <table style={{ width: '20%', border: '1px solid black' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '20%', border: '1px solid black' }}>
                            Hallo 
                        </td>
                        <td style={{ width: '80%' }}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td> Pläne erstellen bis:
                                             <input type='number' />
                                            <input type='number' />
                                            <button> Erstellen </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <SingleSelectLister ref={( refList ) => { this.templateList = refList; }} 
                                                                handleChange={(id) => this.refresheditor(id)} 
                                                                columns={this.plancolumns}
                                                                url = 'http://localhost:8080/plans/list'/>
                                       </td>
                                    </tr>
                                </tbody>
                            </table>

                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

}