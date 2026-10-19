import React from 'react'
import { Dropdown } from './dropdown'

import * as css from '../css/index.css'
import { fetchJson, SubCategory } from './dtos';


export type HandleSubCategoryChange = (subCategory: number) => void;

export interface CategorySelectorProps {
    onChange: HandleSubCategoryChange;
    subcategory?: number;
    horiz: boolean;
}

interface IState {
    category?: number;
    subcategory?: number;
    allSubs: SubCategory[];
}

export class CategorySelector extends React.Component<CategorySelectorProps, IState> {

    constructor(props: CategorySelectorProps) {
        super(props);
        this.state = { category: undefined, subcategory: undefined, allSubs: [] };
        this.setCategory = this.setCategory.bind(this);
        this.setSubCategory = this.setSubCategory.bind(this);
        this.setCat = this.setCat.bind(this);
    }

    componentDidMount(): void {
        fetchJson("category/suball", (d) => {
            this.setState({ allSubs: d });
            this.setCat(d, this.props.subcategory);
        })
    }

    componentDidUpdate(prevProps: CategorySelectorProps): void {
        if (this.state.allSubs.length > 0
            && prevProps.subcategory != this.props.subcategory
            && this.props.subcategory != this.state.subcategory) {
            this.setCat(this.state.allSubs, this.props.subcategory);
        }
    }

    private setCat(d: SubCategory[], sub: number | undefined) {
        if (sub) {
            var cat = d.filter((s) => { return sub == s.id; })[0].category;
            this.setState({ category: cat, subcategory: sub });
        }
        else
            this.setState({ category: undefined, subcategory: undefined });
    }

    private setCategory(e: number | undefined): void {
        if (this.state.category != e) {
            this.setState({ category: e, subcategory: undefined });
        }
    }

    private setSubCategory(e: number | undefined): void {
        if (this.props.subcategory != e) {
            this.setCat(this.state.allSubs, e);
            if (e != undefined)
                this.props.onChange(e);
        }
    }

    render(): React.JSX.Element {
        if (this.state.allSubs.length == 0)
            return <></>;

        var subcaturlextension = this.state.category == undefined ? "" : this.state.category.toString() + "/true";

        if (this.props.horiz) {
            return (
                <span>
                    <Dropdown
                        testdataid={"catselector"}
                        value={this.state.category}
                        onChange={this.setCategory}
                        url='category/catenum/true'
                        selectDef={true}
                        className={css.catselector2} />
                    <Dropdown
                        testdataid={"subselector"}
                        value={this.state.subcategory}
                        onChange={this.setSubCategory}
                        url='category/subenum'
                        selectDef={true}
                        param={subcaturlextension}
                        className={css.catselector2} />
                </span>)
        }
        else {
            return (
                <table style={{ width: "100%" }}><tbody>
                    <tr><td>
                        <Dropdown className={css.catselector}
                            testdataid={"catselector"}
                            value={this.state.category}
                            onChange={this.setCategory}
                            selectDef={true}
                            url='category/catenum/true' />
                    </td></tr>
                    <tr><td>
                        <Dropdown className={css.catselector}
                            testdataid={"subselector"}
                            value={this.state.subcategory}
                            onChange={this.setSubCategory}
                            selectDef={true}
                            url='category/subenum'
                            param={subcaturlextension} />
                    </td></tr>
                </tbody></table>
            );
        }
    }
}