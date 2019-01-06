import React from 'react'
import TemplateEditor from './templateeditor'
import SingleSelectLister from 'utils/singleselectlister'



export default class Templates extends React.Component {
    
    constructor( props ) {
        super( props );
        this.state = { changed: false };
        this.refreshlist = this.refreshlist.bind( this );
        this.refresheditor = this.refresheditor.bind( this );
        this.templateList = undefined;
        this.templateEditor = undefined;
        this.templatecolumns = [{
            Header: 'Gültig von',
            accessor: 'gueltigVon',
            width: '100px'
        }, {
            Header: 'Gültig bis',
            accessor: 'gueltigBis',
            width: '100px'
        }, {
            Header: 'Rhythmus',
            accessor: 'rhythmus',
            width: '100px'
        }, {
            Header: 'Beschreibung',
            accessor: 'shortdescription',
            width: '50%'
        }, {
            Header: 'Betrag',
            accessor: 'wert',
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
        this.templateList.reload();
    }
    
    refresheditor(template) {
        this.templateEditor.setTemplate(template.id);
    }
    
    render() {
        return (
            <table style={{ width: '20%', border: '1px solid black' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '20%', border: '1px solid black' }}>
                            <TemplateEditor ref={( refEditor ) => { this.templateEditor = refEditor; }} onChange={() => this.refreshlist()} />
                        </td>
                        <td style={{ width: '80%' }}>
                            <SingleSelectLister ref={( refList ) => { this.templateList = refList; }} 
                                                handleChange={(id) => this.refresheditor(data)}
                                                url = 'http://localhost:8080/templates/list'
                                                columns = {this.templatecolumns}/>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

}