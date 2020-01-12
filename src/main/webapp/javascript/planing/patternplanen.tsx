import * as React from 'react'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { DropdownService } from '../utils/dropdownservice'
import { Plan } from '../utils/dtos'
import { PatternPlanEditor } from './patternplaneneditor'
import { SendMessage, MessageID } from '../utils/messageid'

interface PatternPlanenProps {
    sendmessage: SendMessage;
}

interface IState {
    category: number;
}

export class PatternPlanen extends React.Component<PatternPlanenProps, IState> {

    lister: SingleSelectLister<Plan>;
    editor: PatternPlanEditor;
    columns: ColumnInfo<Plan>[];

    constructor( props: PatternPlanenProps ) {
        super( props );
        this.refreshlist = this.refreshlist.bind( this );
        this.refresheditor = this.refresheditor.bind( this );
        this.state= {category: 1};

        this.columns = [{
            header: 'Beschreibung',
            getdata: ( data: Plan ): string => { return data.shortdescription }
        }, {
            header: 'Kategorie',
            getdata: ( data: Plan ): string => { return data.categoryname }
        }, {
            header: 'Unterkategorie',
            getdata: ( data: Plan ): string => { return data.subcategoryname }
        }]
    }

    refreshlist() {
        this.editor.setPlan( null );
        this.lister.reload();
    }

    refresheditor( data: Plan ): void {
        this.editor.setPlan( data );
    }

    render(): JSX.Element {
        return (
            <table style={{ border: '1px solid black' }}>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid black', verticalAlign: 'top' }}>
                            <div style={{ fontSize: '20px', borderBottom: '1px solid black', margin: '5px' }}> Musterdaten </div>
                            <PatternPlanEditor ref={( ref ) => { this.editor = ref }} onChange={this.refreshlist} />
                        </td>
                        <td style={{ verticalAlign: 'top' }}>
                            <div style={{ padding: '1px', borderBottom: '1px solid black' }}>
                            <DropdownService onChange={( val: number ): void => this.setState( { category: val } )}
                                url='category/catenum'
                                value={this.state.category}
                            />
                        </div>
                            <SingleSelectLister ref={( ref ) => { this.lister = ref; }}
                                lines={30}
                                handleChange={( data: Plan ) => this.refresheditor( data )}
                                columns={this.columns}
                                ext={this.state.category.toString( 10 )}
                                url='plans/patternplans/' />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

}