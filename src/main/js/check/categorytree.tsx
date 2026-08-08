import React from 'react';
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


interface IState {}


export class CategoryTree extends React.Component<CategoryTreeProps, IState> {

    constructor (props: CategoryTreeProps) {
        super (props);
        this.state = {};
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
        if (level == 1 ) {
            return 'category/subenum/' + id + "/true";
        }
        return 'category/catenum/true';
    }
    
    render () {
        return( <TreeView getURL={this.getURL} handleSelect={this.handleSelect}/> )   
    }
}