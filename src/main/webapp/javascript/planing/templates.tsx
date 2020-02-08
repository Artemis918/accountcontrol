import * as React from 'react'
import { useIntl, WrappedComponentProps} from 'react-intl'

import { TemplateEditor } from './templateeditor'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { Template } from '../utils/dtos'
import { DropdownService } from '../utils/dropdownservice'
import { SendMessage, MessageID } from '../utils/messageid'


import css from '../css/index.css'

type Create = (props:TemplateProps) => JSX.Element;
export const Templates:Create = (p) => {return (<_Templates {...p} intl={useIntl()}/>);}

interface TemplateProps {
    sendmessage: SendMessage;
}

interface IState {
    category: number;
}




export class _Templates extends React.Component<TemplateProps & WrappedComponentProps, IState> {


    lister: SingleSelectLister<Template>;
    editor: TemplateEditor;

	unitNames: string[]; 
	
    constructor( props: TemplateProps & WrappedComponentProps) {
        super( props );
        this.state = { category: undefined };
        this.refreshlist = this.refreshlist.bind( this );
        this.refresheditor = this.refresheditor.bind( this );
        this.lister = undefined;
        this.editor = undefined;

    }

	label(labelid:string):string {return this.props.intl.formatMessage({id: labelid}) }

    refreshlist(): void {
        this.lister.reload();
    }

    refresheditor( template: Template ): void {
        this.editor.setTemplate( template );
    }

	createColums():ColumnInfo<Template>[] {
		this.unitNames = [this.label("day"), 
		                   this.label("week"), 
                           this.label("month"),
                           this.label("year")];
        return [{
            header: this.label("templates.firstday"),
            getdata: ( d: Template ): string => { return d.start.toLocaleDateString( this.props.intl.locale, { day: '2-digit', month: '2-digit' } ).substr( 0, 6 ) },
        }, {
            header: this.label("templates.validuntil"),
            getdata: ( d: Template ): string => { return d.validUntil != null ? d.validUntil.toLocaleDateString( 'de-DE' ) : "" },
        }, {
            header: this.label("templates.repetition"),
            getdata: ( d: Template ): string => { return d.repeatcount + ' - ' + this.unitNames[d.repeatunit] }
        }, {
            header: this.label("shortdescription"),
            getdata: ( d: Template ): string => { return d.shortdescription; }
        }, {
            header: this.label("value"),
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
	
    render(): JSX.Element {
        return (
            <table style={{ border: '1px solid black' }}>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid black', verticalAlign: 'top' }}>
							<div className={css.editortitle}> {this.label("records.recorddata")} </div>
                            <TemplateEditor ref={( ref ) => { this.editor = ref; }} intl={this.props.intl}onChange={this.refreshlist} />
                        </td>
                        <td style={{ verticalAlign: 'top' }} >
                            <p style={{ padding: '1px', margin: '5px', borderBottom: '1px solid black' }}>
                                <DropdownService className={css.catselector3} 
                                    onChange={( val: number ): void => this.setState( { category: val } )}
                                    url='category/catenum'
                                    value={this.state.category}
                                />
                            </p>
                            <SingleSelectLister<Template> ref={( ref ) => { this.lister = ref; }}
                                lines={28}
                                handleChange={this.refresheditor}
                                url='templates/listcategory/'
                                ext={this.state.category ==undefined ? undefined : this.state.category.toString( 10 )}
                                columns={this.createColums()} />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

}