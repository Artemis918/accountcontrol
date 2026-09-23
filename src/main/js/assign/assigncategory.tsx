import React from 'react'
import { CategorySelector } from '../utils/categoryselector'
import { label } from '../utils/misc';

import * as acss from './css/assign.css'


export type OnCatChange = (subCategory: number | undefined , text?: string ) => void;

export interface AssignCategoryProps {
    onChange: OnCatChange;
    text?: string;
    subCatId?: number;
}

export class AssignCategory extends React.Component<AssignCategoryProps, {}> {

    comment_obj: React.RefObject<HTMLInputElement | null>;
    cur_subcategory: number | undefined;
    cur_comment?: string;

    constructor(props: AssignCategoryProps) {
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

    setCategory(subcategory: number | undefined) {
        if (this.cur_subcategory != subcategory ) {
            this.cur_subcategory = subcategory;
            this.props.onChange(this.cur_subcategory,this.cur_comment);
        }
    }

    setComment(comment: string) {
        if (this.cur_comment != comment ) {
            this.cur_comment = comment;
            this.props.onChange(this.cur_subcategory,this.cur_comment)
        }
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