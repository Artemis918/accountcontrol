import React from 'react'
import { useIntl, WrappedComponentProps } from 'react-intl'
import { CategorySelector } from '../utils/categoryselector'

import css from '../css/index.css'
import acss from './css/assign.css'


type Create = (props: CategorySelectProps) => React.JSX.Element;
export const CategorySelect: Create = (p) => { return (<_CategorySelect {...p} intl={useIntl()} />); }


export default CategorySelect;

export type AssignCategoryCallback = (subCategory: number | undefined, text: string) => void;

export interface CategorySelectProps {
    assignCategory: AssignCategoryCallback;
    text: string;
    subcategory?: number;
}

interface IState {
    category?: number;
    subcategory?: number;
    comment: string;
}


class _CategorySelect extends React.Component<CategorySelectProps & WrappedComponentProps, IState> {

        comment: React.RefObject<HTMLInputElement |null>;

    constructor(props: CategorySelectProps & WrappedComponentProps) {
        super(props);
        this.state = { category: undefined, subcategory: this.props.subcategory, comment: "" };
        this.comment = React.createRef<HTMLInputElement |null >();
        this.assign = this.assign.bind(this);
        this.cancel = this.cancel.bind(this);
        this.setCategory = this.setCategory.bind(this); 
    }

    label(labelid: string): string { return this.props.intl.formatMessage({ id: labelid }) }

    componentDidMount(): void {
        if (this.comment.current !== null)
            this.comment.current.focus();
    }

    assign(): void {
        this.props.assignCategory(this.state.subcategory, this.state.comment);
    }

    cancel(): void {
        this.props.assignCategory(undefined, this.state.comment); 
    }

    setCategory(category? : number, subcategory?: number) {
        this.setState({ category: category, subcategory: subcategory });    
    }

    render() {
        return (
            <div>
                <div> {this.label("assign.categoryassign")} </div>
                <div>
                    <CategorySelector
                        subcategory={this.props.subcategory}
                        horiz={false}
                        onChange={this.setCategory}
                    />
                </div>
                <div><input className={acss.descinput}
                    type='text'
                    defaultValue={this.props.text}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            this.assign();
                        }
                    }}
                    onChange={(e)=>{this.setState({comment: e.currentTarget.value});}}
                    placeholder={this.label("assign.description")}  
                    ref={this.comment} />
                </div>
                <div><button onClick={this.assign} className={css.addonbutton} >
                    {this.label("assign.assign")}
                </button>
                    <button onClick={this.cancel}
                        style={{ float: "right" }}
                        className={css.addonbutton}>
                        {this.label("cancel")}
                    </button>
                </div>
            </div>
        );
    }
}