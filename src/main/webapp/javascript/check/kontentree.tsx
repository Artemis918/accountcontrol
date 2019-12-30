import * as React from 'react';
import {TreeView} from '../utils/treeview'


export type HandleSelectKontoGroupCallback = ( kontogroupid: number ) => void;
export type HandleSelectKontoCallback = ( kontoid: number ) => void;

export interface KontenTreeProps {
    handleKGSelect: HandleSelectKontoGroupCallback;
    handleKontoSelect: HandleSelectKontoCallback;
}

interface Konto {
    name:string;
    id: number;
}

interface Group {
    name:string;
    expanded: boolean;
    id: number;
    konten: Konto[];
}


interface IState {
    data : Group[];  
}


export class KontenTree extends React.Component<KontenTreeProps, IState> {

    data: Group[];
    
    constructor (props: KontenTreeProps) {
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
            return 'category/cat';
        } 
        else if (level == 1 ) {
            return 'category/sub/' + id;
        }
        else return undefined;
    }
    
    render () {
        return( <TreeView getURL={this.getURL} handleSelect={this.handleSelect}/> )   
    }
}