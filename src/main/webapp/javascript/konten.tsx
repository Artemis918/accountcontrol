import * as React from 'react'
import * as MultiSelectLister from './utils/multiselectlister'
import {KontenSelector} from './kontenselector';

type SendMessageCallback = (msg: string, error: boolean) => void;

interface KontenProps {
    sendmessage: SendMessageCallback;
}

class CState {
    selectedKonto : any;
    selectedGroup: any;
}

export default class Konten extends React.Component<KontenProps, CState> {
 
    constructor (props :KontenProps) {
        super( props);
        this.state = {selectedKonto: undefined, selectedGroup: undefined};
    }
    
    handleKGSelect( id: number) : void {
        
    }

    handleKontoSelect( id: number) : void {
        
    }
    
    render() {
        return (
        <div>
          <div style={{border: '1px solid black'}}>
          action und Filter
          </div>
          <div style={{width: '30%', float: 'left', border: '1px solid black'}}>
          <KontenSelector 
             handleKGSelect={(kg:number)=>this.handleKGSelect(kg)} 
             handleKontoSelect={(k:number)=>this.handleKontoSelect(k)}
             />
          </div>
          <div style={{ border: '1px solid black'}}>
          Multiselect
          </div>
        </div>
        );
        
    }
}