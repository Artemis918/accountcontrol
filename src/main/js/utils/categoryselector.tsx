import React from 'react'
import { DropdownService } from './dropdownservice'

import css from '../css/index.css'


export type HandleCategoryChange = ( subCategory: number, category: number ) => void;

export interface CategorySelectorProps {
    onChange?: HandleCategoryChange;
    category?: number;
    subcategory?: number;
    horiz: boolean;
}

interface IState {
    category: number;
    subcategory: number
}

export class CategorySelector extends React.Component<CategorySelectorProps, IState>{

    constructor( props: CategorySelectorProps ) {
        super( props );
        this.state = { category: this.props.category, subcategory: this.props.subcategory };
        this.setCategory = this.setCategory.bind( this );
        this.setSubCategory = this.setSubCategory.bind( this );
    }
    
    setCategory( e: number ): void {
        this.setState( { category: e, subcategory: undefined } );
    }

    setSubCategory( e: number ): void {
        if (this.props.onChange != undefined )
            this.props.onChange( e, this.state.category );
        this.setState( { subcategory: e} );
    }
    
    componentDidUpdate(prevProps: CategorySelectorProps) :void {
        if (prevProps.subcategory != this.props.subcategory || prevProps.category != this.props.category)
            this.setState({ category: this.props.category, subcategory: this.props.subcategory } )
    }
    
    getSubCategory() : number {
        return this.state.subcategory;
    }

    render(): JSX.Element {
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