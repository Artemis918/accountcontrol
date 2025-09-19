import React from 'react'
import { useIntl, WrappedComponentProps} from 'react-intl'

import { SingleSelectLister, ColumnInfo } from '../utils/singleselectlister'
import { DropdownService } from '../utils/dropdownservice'
import { Plan } from '../utils/dtos'
import { PatternPlanEditor } from './patternplaneditor'
import { SendMessage } from '../utils/messageid'

import css from '../css/index.css'

type Create = (props:PatternPlaningProps) => React.JSX.Element;
export const PatternPlaning:Create = (p) => {return (<_PatternPlaning {...p} intl={useIntl()}/>);}

interface PatternPlaningProps {
    sendmessage: SendMessage;
}

interface IState {
    category: number;
}

export class _PatternPlaning extends React.Component<PatternPlaningProps & WrappedComponentProps, IState> {

    lister: SingleSelectLister<Plan>;
    editor: PatternPlanEditor;

    constructor( props: PatternPlaningProps & WrappedComponentProps) {
        super( props );
        this.refreshlist = this.refreshlist.bind( this );
        this.refresheditor = this.refresheditor.bind( this );
        this.state= {category: 1};
    }

	label(labelid:string):string {return this.props.intl.formatMessage({id: labelid}) }

	createColumns(): ColumnInfo<Plan>[] {
        return [{
            header: this.label("shortdescription"),
            getdata: ( data: Plan ): string => { return data.shortdescription }
        }, {
            header: this.label("category"),
            getdata: ( data: Plan ): string => { return data.categoryname }
        }, {
            header: this.label("subcategory"),
            getdata: ( data: Plan ): string => { return data.subcategoryname }
        }]
	}

    refreshlist() {
        this.lister.reload();
    }

    refresheditor( data: Plan ): void {
        this.editor.setPlan( data );
    }

    render(): React.JSX.Element {
        return (
            <table style={{ border: '1px solid black' }}>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid black', verticalAlign: 'top' }}>
                            <div className={css.editortitle}> {this.label("pattern.patterndata")} </div>
                            <PatternPlanEditor
								intl={this.props.intl} 
								ref={( ref ) => { this.editor = ref }} 
								onChange={this.refreshlist} />
                        </td>
                        <td style={{ verticalAlign: 'top' }}>
                            <div style={{ padding: '1px', borderBottom: '1px solid black' }}>
                            <DropdownService onChange={( val: number ): void => this.setState( { category: val } )}
                                className={css.catselector3}
								url='category/catenum/true'
                                value={this.state.category}
                            />
                        </div>
                            <SingleSelectLister ref={( ref ) => { this.lister = ref; }}
                                lines={30}
                                handleChange={( data: Plan ) => this.refresheditor( data )}
                                columns={this.createColumns()}
                                ext={this.state.category.toString( 10 )}
                                url='plans/patternplans/' />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

}