import React from 'react'
import { CategorySelector } from '../utils/categoryselector'
import { label } from '../utils/misc';

import * as acss from './css/assign.css'


export type OnCatChange = (subCategory: number , text?: string ) => void;

export interface CategorySelectProps {
    onChange: OnCatChange;
    text?: string;
    subCatId?: number;
}

export class CategorySelect extends React.Component<CategorySelectProps, {}> {

    comment_obj: React.RefObject<HTMLInputElement | null>;
    cur_subcategory: number | undefined;
    cur_comment?: string;

    constructor(props: CategorySelectProps) {
        super(props);
        this.cur_comment = props.text;
        this.cur_subcategory = props.subCatId;

        this.comment_obj = React.createRef<HTMLInputElement | null>();
        this.setCategory = this.setCategory.bind(this);
    }

    componentDidMount(): void {
        if (this.comment_obj.current !== null)
            this.comment_obj.current.focus();
    }

    setCategory(subcategory: number, category: number) {
        this.cur_subcategory =subcategory;
        if (this.props.onChange && this.cur_subcategory != undefined)
            this.props.onChange(this.cur_subcategory,this.cur_comment);
    }

    setComment(comment: string) {
        this.cur_comment = comment;
        if (this.props.onChange && this.cur_subcategory != undefined)
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
                        placeholder={label("assign.description")}
                        ref={this.comment_obj}
                    />
                </div>
            </div>
        );
    }
}