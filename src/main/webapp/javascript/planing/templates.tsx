import * as React from 'react'
import { TemplateEditor } from './templateeditor'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { Template } from '../utils/dtos'
import { DropdownService } from '../utils/dropdownservice'

type SendMessage = ( message: string, error: boolean ) => void;

interface TemplateProps {
    sendmessage: SendMessage;
}

interface IState {
    category: number;
}

const rythmNames: string[] = ['Tag', 'Woche', 'Monat', 'Jahr'];


export class Templates extends React.Component<TemplateProps, IState> {


    lister: SingleSelectLister<Template>;
    editor: TemplateEditor;
    columns: ColumnInfo<Template>[];

    constructor( props: TemplateProps ) {
        super( props );
        this.state = { category: 1 };
        this.refreshlist = this.refreshlist.bind( this );
        this.refresheditor = this.refresheditor.bind( this );
        this.lister = undefined;
        this.editor = undefined;
        this.columns = [{
            header: 'Start Tag',
            getdata: ( d: Template ): string => { return d.start.toLocaleDateString( 'de-DE', { day: '2-digit', month: '2-digit' } ).substr( 0, 6 ) },
        }, {
            header: 'Gültig bis',
            getdata: ( d: Template ): string => { return d.validUntil != null ? d.validUntil.toLocaleDateString( 'de-DE' ) : "" },
        }, {
            header: 'Rhythmus',
            getdata: ( d: Template ): string => { return d.anzahl + ' - ' + rythmNames[d.rythmus] }
        }, {
            header: 'Beschreibung',
            getdata: ( d: Template ): string => { return d.shortdescription; }
        }, {
            header: 'Betrag',
            cellrender: ( cellinfo: CellInfo<Template> ) => (
                <div style={{
                    color: cellinfo.data.value >= 0 ? 'green' : 'red',
                    textAlign: 'right'
                }}>
                    {( cellinfo.data.value / 100 ).toFixed( 2 )}
                </div>
            )
        }]
    }

    refreshlist(): void {
        this.lister.reload();
    }

    refresheditor( template: Template ): void {
        this.editor.setTemplate( template );
    }

    render(): JSX.Element {
        return (
            <table style={{ border: '1px solid black' }}>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid black', verticalAlign: 'top' }}>
                            <div style={{ fontSize: '20px', borderBottom: '1px solid black', margin: '5px' }}> Vorlagedaten </div>
                            <TemplateEditor ref={( ref ) => { this.editor = ref; }} onChange={this.refreshlist} />
                        </td>
                        <td style={{ verticalAlign: 'top' }} >
                            <div style={{ padding: '1px', borderBottom: '1px solid black' }}>
                                <DropdownService onChange={( val: number ): void => this.setState( { category: val } )}
                                    url='category/cat'
                                    value={this.state.category}
                                />
                            </div>
                            <SingleSelectLister<Template> ref={( ref ) => { this.lister = ref; }}
                                lines={28}
                                handleChange={this.refresheditor}
                                url='templates/listgroup/'
                                ext={this.state.category.toString( 10 )}
                                columns={this.columns} />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

}