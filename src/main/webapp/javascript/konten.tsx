import * as React from 'react'
import { MultiSelectLister } from './utils/multiselectlister'
import { KontenSelector } from './kontenselector';
import { MonthSelect } from './utils/monthselect'


type SendMessageCallback = ( msg: string, error: boolean ) => void;

interface KontenProps {
    sendmessage: SendMessageCallback;
}

class assignment {
    detail: string;
    sollwert: number;
    istwert: number;
    committed: boolean;
    id: number;
}

class CState {
    selectedKonto: number;
    selectedGroup: number;
    month: number;
    year: number;
}

export default class Konten extends React.Component<KontenProps, CState> {

    columns: any[];
    lister: MultiSelectLister<assignment>;

    constructor( props: KontenProps ) {
        super( props );
        var currentTime = new Date();
        this.state = { selectedKonto: undefined,
                       selectedGroup: undefined,
                       month: currentTime.getMonth() + 1,
                       year: currentTime.getFullYear()
                     };
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
              Cell: (row :any) => { return (
                      <div style={{ textAlign: 'right' }}>
                        {( row.value / 100 ).toFixed( 2 )}
                      </div>
                    )}
          },
          {
              Header: 'Ist',
              accessor: 'istwert',
              width: '150px',
              Cell: (row :any, original : assignment) =>  {return (
                      <div style={{ textAlign: 'right', color: original.sollwert > row ? 'red' :'green'  }}>
                        {( row.value / 100 ).toFixed( 2 )}
                      </div>
                    )}
          },
          {
              Header: 'ok',
              accessor: 'commited',
              width: '10px',
              Cell: (row : any, original : assignment) => {return (
                  <input type='checkbox' 
                         value={row} 
                         onClick={() => this.commitAssignment(original)} />
                )
                }
          }
        ];
    }

    commitAssignment(a: assignment) :void {
        
    }
          
    handleKGSelect( id: number ): void {

    }

    handleKontoSelect( id: number ): void {

    }
    
    onChangeMonth(month: number, year: number):void {
        
    }

    render() {
        return (
            <div>
                <div style={{ border: '1px solid black' }}>
                    <MonthSelect label='Monat: ' 
                                 onChange={this.onChangeMonth} 
                                 month={this.state.month}
                                 year={this.state.year}/> action und Filter
          </div>
                <div style={{ width: '30%', float: 'left', border: '1px solid black' }}>
                    <KontenSelector
                        handleKGSelect={( kg: number ) => this.handleKGSelect( kg )}
                        handleKontoSelect={( k: number ) => this.handleKontoSelect( k )}
                    />
                </div>
                <div style={{ border: '1px solid black' }}>
                    <MultiSelectLister<assignment>
                        url='assign/get'
                        ext='KontoGroup/1800/1/1'
                        columns={this.columns}
                        ref={( ref ) => { this.lister = ref }}/>
                </div>
            </div>
        );

    }
}