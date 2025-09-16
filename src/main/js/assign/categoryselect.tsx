import React from 'react'
import {useIntl, WrappedComponentProps } from 'react-intl'
import { CategorySelector } from '../utils/categoryselector'

import css from '../css/index.css'
import acss from './css/assign.css'


type Create = (props:CategorySelectProps) => React.JSX.Element;
export const CategorySelect:Create = (p) => { return (<_CategorySelect {...p} intl={useIntl()}/>); }


export default CategorySelect;

export type AssignCategoryCallback = ( subCategory: number, text: string ) => void;

export interface CategorySelectProps {
    assignCategory: AssignCategoryCallback;
    text: string;
    subcategory?: number;
}


class _CategorySelect extends React.Component<CategorySelectProps & WrappedComponentProps, {}> {

    categoryselector: React.RefObject<CategorySelector>;
    comment: React.RefObject<HTMLInputElement>;

    constructor( props: CategorySelectProps & WrappedComponentProps ) {
        super( props );
        this.state = {};
        this.categoryselector = React.createRef();
        this.comment = React.createRef();
        this.assign = this.assign.bind( this );
        this.cancel = this.cancel.bind( this );
    }

	label(labelid:string):string {return this.props.intl.formatMessage({id: labelid}) }

	componentDidMount(): void {
    	this.comment.current.focus();
	}
	
    assign() :void {
        this.props.assignCategory( this.categoryselector.current.getSubCategory(), this.comment.current.value );
    }
    
    cancel() : void {
        this.props.assignCategory( undefined, this.comment.current.value );        
    }

    render() {
        return (
                <div>
                    <div> {this.label("assign.categoryassign")} </div>
                    <div>
                        <CategorySelector
                            subcategory={this.props.subcategory}
                            ref={this.categoryselector}
                            horiz={false}
                        />
                    </div>
                    <div><input className={acss.descinput}
                                type='text' 
                                defaultValue={this.props.text}
								onKeyDown={(e) => {if(e.keyCode === 13 ) {
									this.assign();
								}}}
                                ref={this.comment} />
                    </div>
                    <div><button onClick={this.assign} className={css.addonbutton} >
							{this.label("assign.assign")}
						</button>
                        <button onClick={this.cancel} 
                                style={{float: "right"}} 
                                className={css.addonbutton}>
							{this.label("cancel")}
						</button>
                    </div>
                </div>
        );
    }
}