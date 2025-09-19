import React from 'react'
import { DropdownService } from './dropdownservice'

import css from '../css/index.css'
import { SubCategory } from './dtos';


export type HandleCategoryChange = ( subCategory: number, category: number ) => void;

export interface CategorySelectorProps {
    onChange?: HandleCategoryChange;
    subcategory?: number;
    horiz: boolean;
}

interface IState {
    category: number;
    subcategory: number
	allSubs: SubCategory[]
}

export class CategorySelector extends React.Component<CategorySelectorProps, IState>{

    constructor( props: CategorySelectorProps ) {
        super( props );
        this.state = { category: undefined , subcategory: this.props.subcategory, allSubs: [] };
        this.setCategory = this.setCategory.bind( this );
        this.setSubCategory = this.setSubCategory.bind( this );
    }
	
	componentDidMount() :void {
        var self: CategorySelector = this;
        fetch( "suball" )
            .then( response => response.json() )
            .then( d => { self.setState( {allSubs: d }) } )
	}
    
    setCategory( e: number ): void {
        this.setState( { category: e, subcategory: undefined } );
    }

    setSubCategory( e: number ): void {
        if (this.props.onChange != undefined )
            this.props.onChange( e, this.state.category );
        this.setState( { subcategory: e} );
    }
    
	findCategory(subCategory:number) : number {
		if (this.state.allSubs)
			return this.state.allSubs.filter( (s) => { return subCategory == s.id;} )[0].category;
		else
			return undefined;
	}
	
    componentDidUpdate(prevProps: CategorySelectorProps) :void {
        if (prevProps.subcategory != this.props.subcategory )
            this.setState({category: this.findCategory(this.props.subcategory ) });
    }

    getSubCategory() : number {
        return this.state.subcategory;
    }

    render(): React.JSX.Element {
		var caturlextension = this.state.category==undefined?"":this.state.category.toString() + "/true";
        if ( this.props.horiz ) {
            return (
                <span>
                    <DropdownService 
						value={this.state.category}
                        onChange={this.setCategory}
                        url='category/catenum/true'
						className={css.catselector2} />
                    <DropdownService 
						value={this.state.subcategory}
                        onChange={this.setSubCategory}
                        url='category/subenum'
                        param={caturlextension}
						className={css.catselector2} />
                </span> )
        }
        else {
            return (
                <table style={{width:"100%"}}><tbody>
                    <tr><td>
                        <DropdownService className={css.catselector} 
							value={this.state.category}
                            onChange={this.setCategory}
                            url='category/catenum/true' />
                    </td></tr>
                    <tr><td>
                        <DropdownService className={css.catselector} 
							value={this.state.subcategory}
                            onChange={this.setSubCategory}
                            url='category/subenum'
                            param={caturlextension} />
                    </td></tr>
                </tbody></table>
            );
        }
    }
}