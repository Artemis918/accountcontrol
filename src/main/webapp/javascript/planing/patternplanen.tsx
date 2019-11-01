import * as React from 'react'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { DropdownService } from '../utils/dropdownservice'
import { Plan } from '../utils/dtos'
import { PatternPlanEditor } from './patternplaneneditor'

type SendMessageCallback = ( msg: string, error: boolean ) => void;

interface PatternPlanenProps {
    sendmessage: SendMessageCallback;
}

interface IState {
    group: number;
}

export class PatternPlanen extends React.Component<PatternPlanenProps, IState> {

    lister: SingleSelectLister<Plan>;
    editor: PatternPlanEditor;
    columns: ColumnInfo<Plan>[];

    constructor( props: PatternPlanenProps ) {
        super( props );
        this.refreshlist = this.refreshlist.bind( this );
        this.refresheditor = this.refresheditor.bind( this );
        this.state= {group: 1};

        this.columns = [{
            header: 'Beschreibung',
            getdata: ( data: Plan ): string => { return data.shortdescription }
        }, {
            header: 'kontogruppe',
            getdata: ( data: Plan ): string => { return data.kontogroupname }
        }, {
            header: 'konto',
            getdata: ( data: Plan ): string => { return data.kontoname }
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
                            <DropdownService onChange={( val: number ): void => this.setState( { group: val } )}
                                url='collections/kontogroups'
                                value={this.state.group}
                            />
                        </div>
                            <SingleSelectLister ref={( ref ) => { this.lister = ref; }}
                                lines={30}
                                handleChange={( data: Plan ) => this.refresheditor( data )}
                                columns={this.columns}
                                ext={this.state.group.toString( 10 )}
                                url='plans/patternplans/' />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

}