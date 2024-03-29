import React from 'react'
import {useIntl, WrappedComponentProps } from 'react-intl'
import { CategorySelector } from '../utils/categoryselector'

import css from '../css/index.css'
import acss from './css/assign.css'

type Create = (props:CategoryAssignProps) => JSX.Element;
export const CategoryAssign:Create = (p) => { return (<_CategoryAssign {...p} intl={useIntl()}/>); }


export default CategoryAssign;

type HandleAssignCallback = ( subCategory: number, text: string ) => void;

export interface CategoryAssignProps {
    handleAssign: HandleAssignCallback;
    text: string;
    category?: number;
    subcategory?: number;
}


class _CategoryAssign extends React.Component<CategoryAssignProps & WrappedComponentProps, {}> {

    categoryselector: React.RefObject<CategorySelector>;
    comment: React.RefObject<HTMLInputElement>;

    constructor( props: CategoryAssignProps & WrappedComponentProps ) {
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
        this.props.handleAssign( this.categoryselector.current.getSubCategory(), this.comment.current.value );
    }
    
    cancel() : void {
        this.props.handleAssign( undefined, this.comment.current.value );        
    }

    render() {
        return (
            <div style={{
                position: 'fixed',
                zIndex: 1,
                left: '0', top: '0', width: '100%', height: '100%'
            }}>
                <div style={{
                    margin: '15% auto',
                    padding: '20px',
                    border: '1px solid #888',
                    width: '300px', height: '180px',
                    background: 'darkgray'
                }}>
                    <div> {this.label("assign.categoryassign")} </div>
                    <div>
                        <CategorySelector
                            category={this.props.category}
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
            </div>
        );
    }
}