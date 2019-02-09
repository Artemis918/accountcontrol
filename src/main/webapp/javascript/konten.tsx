import * as React from 'react'
import { CellInfo, Column } from 'react-table'
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

    columns: Column[];
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
                accessor: 'detail',
            },
            {
                Header: 'Soll',
                accessor: 'sollwert',
                Cell: ( cell: CellInfo ) => {
                    return (
                        <div style={{ textAlign: 'right' }}>
                            {( cell.value / 100 ).toFixed( 2 )}
                        </div>
                    )
                },
                width: 100
            },
            {
                Header: 'Ist',
                accessor: 'istwert',
                Cell: ( cell: CellInfo ) => {
                    return (
                        <div style={{ textAlign: 'right', backgroundColor: this.getColor(cell.original) }}>
                            {( cell.original.beleg == 0 ) ? '--' : ( cell.value / 100 ).toFixed( 2 )}
                        </div>
                    )
                },
                width: 100
            },
            {
                Header: 'ok',
                accessor: 'committed',
                Cell: ( cell: CellInfo ) => {
                    if ( cell.original.beleg != 0 )
                        return (
                            <input type='checkbox'
                                checked={cell.value}
                                width={40}
                                onClick={() => this.commitAssignment( cell.original )} />
                        )
                },
                width: 50
            }
        ];

        this.commitAssignment = this.commitAssignment.bind( this );
        this.commitSelected = this.commitSelected.bind( this );
        this.commitAll = this.commitAll.bind( this );
        this.removeAssignment = this.removeAssignment.bind( this );
    }

    getColor( z: Zuordnung ): string {
        if ( z.beleg == 0 || z.sollwert < z.istwert )
            return 'lightgrey';
        else if ( z.sollwert > z.istwert )
            return 'red';
        else
            return 'green';
    }

    commit( z: Zuordnung[] ): void {
        var ids: number[] = z.map( ( za: Zuordnung ) => { return za.id; } );
        var self: Konten = this;
        fetch( '/assign/commit', {
            method: 'post',
            body: JSON.stringify( ids ),
            headers: {
                "Content-Type": "application/json"
            }
        } ).then( function( response ) {
            self.lister.current.reload();
        } );
    }

    commitAssignment( a: Zuordnung ): void {
        this.commit( [a] );
    }

    commitSelected(): void {
        this.commit( this.lister.current.getSelectedData() );
        this.lister.current.reload();
    }

    commitAll(): void {
        this.commit( this.lister.current.getDataAll() );
        this.lister.current.reload();
    }

    removeAssignment(): void {
        var ids: number[] = this.lister.current.getSelectedData().map( ( za: Zuordnung ) => { return za.beleg; } );
        var self: Konten = this;
        fetch( '/assign/remove', {
            method: 'post',
            body: JSON.stringify( ids ),
            headers: {
                "Content-Type": "application/json"
            }
        } ).then( function( response ) {
            self.lister.current.reload();
        } );
    }

    createExt(): string {
        var date: string = '/' + this.state.year + '/' + this.state.month + '/';
        if ( this.state.selectedKonto != undefined ) {
            return 'getKonto' + date + this.state.selectedKonto;
        }
        else if ( this.state.selectedGroup != undefined ) {
            return 'getKontoGroup' + date + this.state.selectedGroup;
        }
        else {
            return 'getKontoGroup' + date + '1';
        }
    }

    render(): JSX.Element {
        return (
            <div>
                <div style={{ border: '1px solid black' }}>
                    <MonthSelect label='Monat: '
                        onChange={( m: number, y: number ) => this.setState( { month: m, year: y } )}
                        month={this.state.month}
                        year={this.state.year} />
                    <button onClick={() => this.commitSelected()}> Auswahl Bestätigen </button>
                    <button onClick={() => this.commitAll()}> Alles Bestätigen </button>
                    <button onClick={() => this.removeAssignment()}> Zuordnung lösen </button>
                </div>
                <div style={{ width: '200px', float: 'left', border: '1px solid black' }}>
                    <KontenTree
                        handleKGSelect={( kg: number ) => this.setState( { selectedGroup: kg, selectedKonto: undefined } )}
                        handleKontoSelect={( k: number ) => this.setState( { selectedGroup: undefined, selectedKonto: k } )}
                    />
                </div>
                <div style={{ border: '1px solid black' }}>
                    <MultiSelectLister<Zuordnung>
                        url='assign/'
                        lines={20}
                        ext={this.createExt()}
                        columns={this.columns}
                        ref={this.lister} />
                </div>
            </div>
        );

    }
}