import * as React from 'react'
import {TemplateEditor, Template} from './templateeditor'
import {SingleSelectLister} from '../utils/singleselectlister'

type SendMessage = (message: string, error: boolean)=>void;

interface TemplateProps {
    sendmessage: SendMessage;
} 

export  class Templates extends React.Component<TemplateProps,{}> {
    
    lister: SingleSelectLister<Template>;
    editor: TemplateEditor;
    columns: any[];

    constructor( props: TemplateProps ) {
        super( props );
        this.state = { };
        this.refreshlist = this.refreshlist.bind( this );
        this.refresheditor = this.refresheditor.bind( this );
        this.lister = undefined;
        this.editor = undefined;
        this.columns = [{
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
            Cell: (row:any) => (
                <div style={{
                    color: row.value >= 0 ? 'green' : 'red',
                    textAlign: 'right'
                }}>
                    {( row.value / 100 ).toFixed( 2 )}
                </div>
            )
        }]
    }

    refreshlist() :void {
        this.lister.reload();
    }
    
    refresheditor(template: Template) :void {
        this.editor.setTemplate(template.id);
    }
    
    render() :JSX.Element {
        return (
            <table style={{border: '1px solid black' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '20%', border: '1px solid black' }}>
                            <TemplateEditor ref={( ref ) => { this.editor = ref; }} onChange={this.refreshlist} />
                        </td>
                        <td style={{ width: '80%' }}>
                            <SingleSelectLister<Template> ref={( ref ) => { this.lister = ref; }} 
                                                handleChange={this.refresheditor}
                                                url = 'http://localhost:8080/templates/list'
                                                columns = {this.columns}/>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

}