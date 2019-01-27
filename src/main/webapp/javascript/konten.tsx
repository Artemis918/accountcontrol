import * as React from 'react'
import { MultiSelectLister } from './utils/multiselectlister'
import { KontenTree } from './kontentree'
import { MonthSelect } from './utils/monthselect'
import { KontenSelector } from './utils/kontenselector'
import { Zuordnung } from './utils/dtos'


type SendMessageCallback = ( msg: string, error: boolean ) => void;

interface KontenProps {
    sendmessage: SendMessageCallback;
}

class CState {
    selectedKonto: number;
    selectedGroup: number;
    month: number;
    year: number;
}

export class Konten extends React.Component<KontenProps, CState> {

    columns: any[];
    lister: React.RefObject<MultiSelectLister<Zuordnung>>;

    constructor( props: KontenProps ) {
        super( props );
        var currentTime = new Date();
        this.state = {
            selectedKonto: undefined,
            selectedGroup: undefined,
            month: currentTime.getMonth() + 1,
            year: currentTime.getFullYear()
        };
        this.lister = React.createRef();
        this.columns = [
            {
                Header: 'Beschreibung',
                accessor: 'details',
                width: '200px'
            },
            {
                Header: 'Soll',
                accessor: 'sollwert',
                width: '150px',
                Cell: ( row: any ) => {
                    return (
                        <div style={{ textAlign: 'right' }}>
                            {( row.value / 100 ).toFixed( 2 )}
                        </div>
                    )
                }
            },
            {
                Header: 'Ist',
                accessor: 'istwert',
                width: '150px',
                Cell: ( row: any, original: Zuordnung ) => {
                    return (
                        <div style={{ textAlign: 'right', color: original.sollwert > row ? 'red' : 'green' }}>
                            {( row.value / 100 ).toFixed( 2 )}
                        </div>
                    )
                }
            },
            {
                Header: 'ok',
                accessor: 'commited',
                width: '10px',
                Cell: ( row: any, original: Zuordnung ) => {
                    return (
                        <input type='checkbox'
                            value={row}
                            onClick={() => this.commitAssignment( original )} />
                    )
                }
            }
        ];
    }

    commitAssignment( a: Zuordnung ): void {

    }

    handleKGSelect( id: number ): void {

    }

    handleKontoSelect( id: number ): void {

    }

    onChangeMonth( month: number, year: number ): void {

    }

    render() {
        return (
            <div>
                <div style={{ border: '1px solid black' }}>
                    <MonthSelect label='Monat: '
                        onChange={this.onChangeMonth}
                        month={this.state.month}
                        year={this.state.year} />
          </div>
                <div style={{ width: '30%', float: 'left', border: '1px solid black' }}>
                    <KontenTree
                        handleKGSelect={( kg: number ) => this.handleKGSelect( kg )}
                        handleKontoSelect={( k: number ) => this.handleKontoSelect( k )}
                    />
                </div>
                <div style={{ border: '1px solid black' }}>
                    <MultiSelectLister<Zuordnung>
                        url='assign/get'
                        ext='KontoGroup/1800/1/1'
                        columns={this.columns}
                        ref={this.lister} />
                </div>
            </div>
        );

    }
}