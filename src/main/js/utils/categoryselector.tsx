import React from 'react'
import { Dropdown } from './dropdown'

import * as css from '../css/index.css'
import { fetchJson, SubCategory } from './dtos';
import { lastDayOfQuarter } from 'date-fns';


export type HandleSubCategoryChange = (subCategory?: number) => void;

export interface CategorySelectorProps {
    onChange: HandleSubCategoryChange;
    subcategory?: number;
    clearCategory?: boolean;
    horiz: boolean;
}

interface IState {
    category?: number;
    allSubs: SubCategory[]
}

export class CategorySelector extends React.Component<CategorySelectorProps, IState> {

    constructor(props: CategorySelectorProps) {
        super(props);
        this.state = { category: undefined, allSubs: [] };
        this.setCategory = this.setCategory.bind(this);
        this.setSubCategory = this.setSubCategory.bind(this);
        this.setCatFromProps = this.setCatFromProps.bind(this);
    }

    componentDidMount(): void {
        fetchJson("category/suball", (d) => { this.setState({ allSubs: d }); this.setCatFromProps(d); })
    }

    componentDidUpdate(prevProps: CategorySelectorProps): void {
        if (this.state.allSubs.length > 0)
            this.setCatFromProps(this.state.allSubs);
        if (!this.props.subcategory && this.props.clearCategory)
            this.setState({ category: undefined });
    }

    private setCatFromProps(d: SubCategory[]) {
        if (this.props.subcategory) {
            var cat = d.filter((s) => { return this.props.subcategory == s.id; })[0].category;
            if (this.state.category != cat)
                this.setState({ category: cat });
        }
    }

    private setCategory(e: number | undefined): void {
        if (this.state.category != e)
            this.setState({ category: e });
    }

    private setSubCategory(e: number | undefined): void {
        if (this.props.subcategory != e)
            this.props.onChange(e);
    }

    render(): React.JSX.Element {
        if (this.state.allSubs.length == 0)
            return <></>;

        var caturlextension = this.state.category == undefined ? "" : this.state.category.toString() + "/true";
        if (this.props.horiz) {
            return (
                <span>
                    <Dropdown
                        value={this.state.category}
                        onChange={this.setCategory}
                        url='category/catenum/true'
                        selectDef={true}
                        className={css.catselector2} />
                    <Dropdown
                        value={this.props.subcategory}
                        onChange={this.setSubCategory}
                        url='category/subenum'
                        selectDef={true}
                        param={caturlextension}
                        className={css.catselector2} />
                </span>)
        }
        else {
            return (
                <table style={{ width: "100%" }}><tbody>
                    <tr><td>
                        <Dropdown className={css.catselector}
                            value={this.state.category}
                            onChange={this.setCategory}
                            selectDef={true}
                            url='category/catenum/true' />
                    </td></tr>
                    <tr><td>
                        <Dropdown className={css.catselector}
                            value={this.props.subcategory}
                            onChange={this.setSubCategory}
                            selectDef={true}
                            url='category/subenum'
                            param={caturlextension} />
                    </td></tr>
                </tbody></table>
            );
        }
    }
}