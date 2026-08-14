import React from 'react'

import { SingleSelectLister, ColumnInfo } from '../utils/singleselectlister'
import { DropdownService } from '../utils/dropdownservice'
import { Plan } from '../utils/dtos'
import { PatternPlanEditor } from './patternplaneditor'
import { SendMessage } from '../utils/messageid'
import { label } from '../utils/misc'
import * as css from '../css/index.css'

interface PatternPlaningProps {
    sendmessage: SendMessage;
}

interface IState {
    category: number;
}

export class PatternPlaning extends React.Component<PatternPlaningProps, IState> {

    lister: SingleSelectLister<Plan> | null = null;
    editor: PatternPlanEditor | null = null;

    constructor( props: PatternPlaningProps) {
        super( props );
        this.refreshlist = this.refreshlist.bind( this );
        this.refresheditor = this.refresheditor.bind( this );
        this.state= {category: 1};
    }

	createColumns(): ColumnInfo<Plan>[] {
        return [{
            header: label("shortdescription"),
            getdata: ( data: Plan ): string => { return data.shortdescription }
        }, {
            header: label("category"),
            getdata: ( data: Plan ): string => { return data.categoryname }
        }, {
            header: label("subcategory"),
            getdata: ( data: Plan ): string => { return data.subcategoryname }
        }]
	}

    refreshlist() {
        this.lister?.reload();
    }

    refresheditor( data: Plan ): void {
        this.editor?.setPlan( data );
    }

    render(): React.JSX.Element {
        return (
            <table style={{ border: '1px solid black' }}>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid black', verticalAlign: 'top' }}>
                            <div className={css.editortitle}> {label("pattern.patterndata")} </div>
                            <PatternPlanEditor
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