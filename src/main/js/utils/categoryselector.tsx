import React from 'react'
import { DropdownService } from './dropdownservice'

import css from '../css/index.css'
import { fetchJson, SubCategory } from './dtos';


export type HandleCategoryChange = (subCategory: number, category: number) => void;

export interface CategorySelectorProps {
    onChange?: HandleCategoryChange;
    subcategory?: number;
    horiz: boolean;
}

interface IState {
    category?: number;
    allSubs: SubCategory[]
}

interface LocalState {
    subcategory?: number
}

export class CategorySelector extends React.Component<CategorySelectorProps, IState> {

    lstate: LocalState;

    constructor(props: CategorySelectorProps) {
        super(props);
        this.state = { category: undefined, allSubs: [] };
        this.lstate = { subcategory: this.props.subcategory };
        this.setCategory = this.setCategory.bind(this);
        this.setSubCategory = this.setSubCategory.bind(this);
        this.setCatFromProps = this.setCatFromProps.bind(this);
    }

    componentDidMount(): void {
        fetchJson("category/suball", this.setCatFromProps)
    }

    private setCatFromProps(d: SubCategory[]) {
        if (this.props.subcategory) {
            var cat = d.filter((s) => { return this.props.subcategory == s.id; })[0].category;
            this.setState({ allSubs: d, category: cat });
        } else
            this.setState({ allSubs: d });

    }

    private setCategory(e: number): void {
        this.lstate.subcategory = undefined;
        this.setState({ category: e });
    }

    private setSubCategory(e: number | undefined): void {
        if (this.props.onChange != undefined && this.state.category != undefined && e != undefined)
            this.props.onChange(e, this.state.category);
        this.lstate.subcategory = e;
    }

    render(): React.JSX.Element {
        var caturlextension = this.state.category == undefined ? "" : this.state.category.toString() + "/true";
        if (this.props.horiz) {
            return (
                <span>
                    <DropdownService
                        value={this.state.category}
                        onChange={this.setCategory}
                        url='category/catenum/true'
                        className={css.catselector2} />
                    <DropdownService
                        value={this.lstate.subcategory}
                        onChange={this.setSubCategory}
                        url='category/subenum'
                        param={caturlextension}
                        className={css.catselector2} />
                </span>)
        }
        else {
            return (
                <table style={{ width: "100%" }}><tbody>
                    <tr><td>
                        <DropdownService className={css.catselector}
                            value={this.state.category}
                            onChange={this.setCategory}
                            url='category/catenum/true' />
                    </td></tr>
                    <tr><td>
                        <DropdownService className={css.catselector}
                            value={this.lstate.subcategory}
                            onChange={this.setSubCategory}
                            url='category/subenum'
                            param={caturlextension} />
                    </td></tr>
                </tbody></table>
            );
        }
    }
}