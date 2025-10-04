import React from 'react'
import { useIntl, WrappedComponentProps } from 'react-intl'
import { CategorySelector } from '../utils/categoryselector'

import css from '../css/index.css'
import acss from './css/assign.css'


type Create = (props: CategorySelectProps) => React.JSX.Element;
export const CategorySelect: Create = (p) => { return (<_CategorySelect {...p} intl={useIntl()} />); }


export default CategorySelect;

export type OnCatChange = (subCategory: number | undefined, text: string) => void;

export interface CategorySelectProps {
    onChange: OnCatChange;
    text: string;
    subCatId?: number;
}

class _CategorySelect extends React.Component<CategorySelectProps & WrappedComponentProps,{}> {

    comment_obj: React.RefObject<HTMLInputElement | null>;
    cur_category: number| undefined;
    cur_subcategory: number | undefined;
    cur_comment: string;

    constructor(props: CategorySelectProps & WrappedComponentProps) {
        super(props);
        this.cur_comment = props.text;
        this.cur_category = undefined;
        this.cur_subcategory = props.subCatId;

        this.comment_obj = React.createRef<HTMLInputElement | null>();
        this.setCategory = this.setCategory.bind(this);
    }

    label(labelid: string): string { return this.props.intl.formatMessage({ id: labelid }) }

    componentDidMount(): void {
        if (this.comment_obj.current !== null)
            this.comment_obj.current.focus();
    }

    setCategory(subcategory?: number, category?: number) {
        this.cur_category = category;
        this.cur_subcategory =subcategory;
        if (this.props.onChange)
            this.props.onChange(this.cur_subcategory,this.cur_comment)
    }

    setComment(comment: string) {
        this.cur_comment = comment;
        if (this.props.onChange)
            this.props.onChange(this.cur_subcategory,this.cur_comment)
    }

    render() {
        return (
            <div testdata-id={'categoryselect'}>
                <div>
                    <CategorySelector
                        subcategory={this.cur_subcategory}
                        horiz={false}
                        onChange={this.setCategory}
                    />
                </div>
                <div>
                    <input className={acss.descinput}
                        type='text'
                        defaultValue={this.cur_comment}
                        onChange={(e) => { this.setComment(e.currentTarget.value); }}
                        placeholder={this.label("assign.description")}
                        ref={this.comment_obj}
                    />
                </div>
            </div>
        );
    }
}