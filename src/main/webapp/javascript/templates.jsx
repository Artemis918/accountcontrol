import React from 'react'
import TemplateEditor from 'templateeditor.jsx'
import TemplateList from 'templatelist.jsx'

export default class Templates extends React.Component {

    constructor( props ) {
        super( props );
        this.state = { changed: false };
        this.refreshlist = this.refreshlist.bind( this );
        this.refresheditor = this.refresheditor.bind( this );
        this.templateList = undefined;
        this.templateEditor = undefined;
    }

    refreshlist() {
        this.templateList.reload();
    }
    
    refresheditor(templateid) {
        this.templateEditor.setTemplate(templateid);
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
                            <TemplateList ref={( refList ) => { this.templateList = refList; }} handleChange={(id) => this.refresheditor(id)} />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

}