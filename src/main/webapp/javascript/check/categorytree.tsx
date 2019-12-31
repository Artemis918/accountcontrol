import * as React from 'react';
import {TreeView} from '../utils/treeview'


export type HandleSelectCatCallback = ( categoryid: number ) => void;
export type HandleSelectSubCallback = ( subcategoryid: number ) => void;

export interface CategoryTreeProps {
    handleCatSelect: HandleSelectCatCallback;
    handleSubSelect: HandleSelectSubCallback;
}

interface SubCategory {
    name:string;
    id: number;
}

interface Category {
    name:string;
    expanded: boolean;
    id: number;
    subcategory: SubCategory[];
}


interface IState {
    data : Category[];  
}


export class CategoryTree extends React.Component<CategoryTreeProps, IState> {

    data: Category[];
    
    constructor (props: CategoryTreeProps) {
        super (props);
        this.data = undefined;
        this.state = { data: this.data };
        this.handleSelect = this.handleSelect.bind(this);
    }
    
    createKonten (cat : Category) {
        return (<button> {cat.name} </button>);
    }
    
    handleSelect( level: number, id: number) :void {
        if (level == 1)
            this.props.handleCatSelect(id);
        else
            this.props.handleSubSelect(id);
        
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