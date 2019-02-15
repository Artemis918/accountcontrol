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
    group: number;
}

export class Templates extends React.Component<TemplateProps, IState> {

    lister: SingleSelectLister<Template>;
    editor: TemplateEditor;
    columns: ColumnInfo<Template>[];

    constructor( props: TemplateProps ) {
        super( props );
        this.state = { group: 1 };
        this.refreshlist = this.refreshlist.bind( this );
        this.refresheditor = this.refresheditor.bind( this );
        this.lister = undefined;
        this.editor = undefined;
        this.columns = [{
            header: 'Start Tag',
            getdata: ( d: Template ): string => { return d.start.toLocaleDateString( 'de-DE', {day: '2-digit', month: '2-digit'} ).substr( 0, 6 ) },
        }, {
            header: 'Gültig bis',
            getdata: ( d: Template ): string => { return d.validUntil != null ? d.validUntil.toLocaleDateString( 'de-DE' ) : "" },
        }, {
            header: 'Rhythmus',
            getdata: ( d: Template ): string => { return d.rythmus.toString( 10 ) }
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

    setKontoGroup( val: number ) {
    }

    refresheditor( template: Template ): void {
        this.editor.setTemplate( template );
    }

    render(): JSX.Element {
        return (
            <table style={{ border: '1px solid black' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '20%', border: '1px solid black' }}>
                            <TemplateEditor ref={( ref ) => { this.editor = ref; }} onChange={this.refreshlist} />
                        </td>
                        <td style={{ width: '80%' }}>
                            <DropdownService onChange={( val: number ): void => this.setState( { group: val } )}
                                url='collections/kontogroups'
                                value={this.state.group}
                            />
                            <SingleSelectLister<Template> ref={( ref ) => { this.lister = ref; }}
                                handleChange={this.refresheditor}
                                url='templates/listgroup/'
                                ext={this.state.group.toString(10)}
                                columns={this.columns} />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

}