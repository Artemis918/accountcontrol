import React from 'react'
import { useIntl, WrappedComponentProps } from 'react-intl'

import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { Category, SubCategory } from '../utils/dtos'
import { AddTool } from './addtool'
import { YesNo } from '../utils/yesno'
import { SendMessage } from '../utils/messageid'

type Creator = (props: CategoryConfigProps) => React.JSX.Element;
export const CategoriesConfig: Creator = (p) => { return (<_CategoriesConfig {...p} intl={useIntl()} />); }

interface CategoryConfigProps {
	sendmessage: SendMessage;
}

interface IState {
	category: Category;
	subcategory: SubCategory;
	numassigns: number;
	addcat: boolean;
	addsub: boolean;
	delcat: boolean;
	delsub: boolean;

}

export class _CategoriesConfig extends React.Component<CategoryConfigProps & WrappedComponentProps, IState> {

	catlister: React.RefObject<SingleSelectLister<Category>>;
	sublister: React.RefObject<SingleSelectLister<SubCategory>>;

	constructor(props: CategoryConfigProps & WrappedComponentProps) {
		super(props);
		this.state = {
			category: undefined,
			subcategory: undefined,
			numassigns: 0,
			addcat: false,
			addsub: false,
			delcat: false,
			delsub: false,
		};
		this.setCategory = this.setCategory.bind(this);
		this.setSubCategory = this.setSubCategory.bind(this);
		this.saveCat = this.saveCat.bind(this);
		this.saveSub = this.saveSub.bind(this);
		this.delCat = this.delCat.bind(this);
		this.delSub = this.delSub.bind(this);
		this.fetchCatInfo = this.fetchCatInfo.bind(this);
		this.fetchSubInfo = this.fetchSubInfo.bind(this);
		this.catlister = React.createRef();
		this.sublister = React.createRef();
	}

	label(id: string): string {
		return this.props.intl.formatMessage({ id: id });
	}

	setCategory(category: Category): void {
		this.setState({ category: category });
		this.sublister.current.clearSelection();
	}

	setSubCategory(subcategory: SubCategory): void {
		this.setState({ subcategory: subcategory })
	}

	delSub(b: boolean): void {
		var self = this;
		if (b) {
			fetch('category/delsub/' + this.state.subcategory.id)
				.then(function(response) {
					self.setState({ delsub: false, subcategory: undefined });
					self.sublister.current.reload();
				}
				);
		}
		else {
			self.setState({ delsub: false });
		}
	}

	delCat(b: boolean): void {
		var self = this;
		if (b) {
			fetch('category/delcat/' + this.state.category.id)
				.then(function(response) {
					self.setState({ delcat: false, subcategory: undefined, category: undefined });
					self.catlister.current.reload();
				}
				);
		}
		else {
			self.setState({ delcat: false });
		}
	}


	saveSub(short: string, desc: string): void {
		var self = this;
		if (short != undefined && short != '') {
			var subCategory: SubCategory =
			{
				id: 0,
				shortdescription: short,
				description: desc,
				category: this.state.category.id,
				art: 0,
				active: true,
				favorite: false,
				categoryName: this.state.category.description
			};
			var jsonbody = JSON.stringify(subCategory);
			fetch('category/savesub', {
				method: 'post',
				body: jsonbody,
				headers: { "Content-Type": "application/json" }
			}
			).then(
				() => {
					self.setState({ addsub: false });
					self.sublister.current.reload();
				}
			);
		}
		else {
			self.setState({ addsub: false });
		}
	}

	saveCat(short: string, desc: string): void {
		var self = this;
		if (short != undefined && short != '') {
			var category: Category =
			{
				id: 0,
				shortdescription: short,
				description: desc,
				active: true
			};
			var jsonbody = JSON.stringify(category);
			fetch('category/savecat', {
				method: 'post',
				body: jsonbody,
				headers: { "Content-Type": "application/json" }
			}
			).then(
				function(response) {
					self.setState({ addcat: false });
					self.catlister.current.reload();
				}
			);
		}
		else {
			self.setState({ addcat: false });
		}
	}

	renderAdd(): React.JSX.Element {
		var create: string = this.label("create");
		var cancel: string = this.label("cancel");
		var dellabel: string = this.label("delete");

		if (this.state.addcat) {
			return (<AddTool save={this.saveCat} createlabel={create} cancellabel={cancel} />)
		}
		else if (this.state.addsub) {
			return (<AddTool save={this.saveSub} createlabel={create} cancellabel={cancel} category={this.state.category.shortdescription} />)
		}
		else if (this.state.delcat) {
			var infotext: string[] = [];
			infotext[0] = this.label("category.woulddelete");
			infotext[1] = this.label("categories") + ": 1";
			infotext[2] = this.label("subcategories") + ": " + this.sublister.current.getData().length;
			infotext[3] = this.label("assingments") + ": " + this.state.numassigns;
			return (<YesNo answer={this.delCat}
				yeslabel={dellabel}
				nolabel={cancel}
				request={infotext} />);
		}
		else if (this.state.delsub) {
			var infotext: string[] = [];
			infotext[0] = this.label("category.woulddelete");
			infotext[1] = this.label("subcategories") + ": 1";
			infotext[2] = this.label("assingments") + ": " + this.state.numassigns;
			return (<YesNo answer={this.delSub}
				yeslabel={dellabel}
				nolabel={cancel}
				request={infotext} />);
		}
	}

	fetchCatInfo(): void {
		if (this.state.category != undefined) {
			var self: _CategoriesConfig = this;
			fetch('assign/countsubcategory', {
				method: 'post',
				body: JSON.stringify(this.sublister.current.getData().map((s: SubCategory) => { return (s.id) })),
				headers: {
					"Content-Type": "application/json"
				}
			})
				.then((response: Response) => response.text())
				.then((text) => { self.setState({ numassigns: parseInt(text), delcat: true }) });
		}
	}

	fetchSubInfo(): void {
		if (this.state.subcategory != undefined) {
			var self: _CategoriesConfig = this;
			var list: number[] = [this.state.subcategory.id];
			fetch('assign/countsubcategory', {
				method: 'post',
				body: JSON.stringify(list),
				headers: {
					"Content-Type": "application/json"
				}
			})
				.then((response: Response) => response.text())
				.then((text) => { self.setState({ numassigns: parseInt(text), delsub: true }) });
		}
	}

	invertFavorite(data: SubCategory): void {
		var self: _CategoriesConfig = this;
		fetch('category/invertfavorite/' + data.id)
			.then(
				() => { self.sublister.current.reload(); }
			);
	}

	invertActiveCat(data: Category): void {
		var self: _CategoriesConfig = this;
		fetch('category/invertactivecat/' + data.id)
			.then(
				() => { self.catlister.current.reload(); }
			);
	}

	invertActiveSub(data: SubCategory): void {
		var self: _CategoriesConfig = this;
		fetch('category/invertactivesub/' + data.id)
			.then(
				() => { self.sublister.current.reload(); }
			);
	}


	render(): React.JSX.Element {
		var activelabel: string = this.label("category.active");
		var favoritelabel: string = this.label("category.favorite");
		var columnsCat: ColumnInfo<Category>[] =
			[
				{
					header: this.label("config.category"),
					getdata: (c: Category) => { return c.shortdescription; }
				},
				{
					header: activelabel,
					cellrender: (cell: CellInfo<Category>) => {
						if (cell.rownum != -1)
							return (
								<div style={{ textAlign: "center" }}>
									<input type='checkbox'
										checked={cell.data.active}
										onChange={() => this.invertActiveCat(cell.data)} />
								</div>
							)
					}
				}
			];
		var columnsSub: ColumnInfo<SubCategory>[] =
			[
				{
					header: this.label("config.subcategory"),
					getdata: (c: SubCategory) => { return c.shortdescription; }
				},
				{
					header: favoritelabel,
					cellrender: (cell: CellInfo<SubCategory>) => {
						if (cell.rownum != -1)
							return (
								<div style={{ textAlign: "center" }}>
									<input type='checkbox'
										checked={cell.data.favorite}
										onChange={() => this.invertFavorite(cell.data)} />
								</div>
							)
					}
				},
				{
					header: activelabel,
					cellrender: (cell: CellInfo<SubCategory>) => {
						if (cell.rownum != -1)
							return (
								<div style={{ textAlign: "center" }}>
									<input type='checkbox'
										checked={cell.data.active}
										onClick={() => this.invertActiveSub(cell.data)} />
								</div>
							)
					}
				}

			];
		return (
			<div>
				<table>
					<tbody>
						<tr>
							<td style={{ border: '1px solid black', verticalAlign: 'top' }}>
								<SingleSelectLister<Category>
									url='category/cat'
									ext=''
									lines={15}
									handleChange={this.setCategory}
									columns={columnsCat}
									ref={this.catlister} />
							</td>
							<td style={{ border: '1px solid black', verticalAlign: 'top' }}>
								<SingleSelectLister<SubCategory>
									url='category/sub'
									lines={15}
									handleChange={this.setSubCategory}
									ext={(this.state.category == undefined) ? undefined : "/" + this.state.category.id.toString()}
									columns={columnsSub}
									ref={this.sublister} />
							</td>
						</tr>
						<tr>
							<td>
								<button onClick={() => this.setState({ addcat: true })}> + </button>
								<button onClick={() => this.fetchCatInfo()}> - </button>
							</td>
							<td>
								<button onClick={() => this.setState({ addsub: true })} disabled={this.state.category == undefined}> + </button>
								<button onClick={() => this.fetchSubInfo()}> - </button>
							</td>
						</tr>
					</tbody>
				</table>
				{this.renderAdd()}
			</div>
		);
	}

}

