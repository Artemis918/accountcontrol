import * as React from 'react';
import {TreeView} from './utils/treeview'


export type HandleSelectKontoGroupCallback = ( kontogroupid: number ) => void;
export type HandleSelectKontoCallback = ( kontoid: number ) => void;

export interface KontenSelectorProps {
    handleKGSelect: HandleSelectKontoGroupCallback;
    handleKontoSelect: HandleSelectKontoCallback;
}

class Konto {
    name:string;
    id: number;
}

class Group {
    name:string;
    expanded: boolean;
    id: number;
    konten: Konto[];
}


class CState {
    data : Group[];  
}


export class KontenSelector extends React.Component<KontenSelectorProps, CState> {

    data: Group[];
    
    constructor (props: KontenSelectorProps) {
        super (props);
        this.data = undefined;
        this.state = { data: this.data };
        this.handleSelect = this.handleSelect.bind(this);
    }
    
    createKonten (kg : Group) {
        return (<button> {kg.name} </button>);
    }
    
    handleSelect( level: number, id: number) :void {
        if (level == 1)
            this.props.handleKGSelect(id);
        else
            this.props.handleKontoSelect(id);
        
    }

    getURL( level: number, id: number) :string {
        if (level == 0) {
            return 'collections/kontogroups';
        } 
        else if (level == 1 ) {
            return 'collections/konto/' + id;
        }
        else return undefined;
    }
    
    render () {
        return( <TreeView getURL={this.getURL} handleSelect={this.handleSelect}/> )   
    }
}