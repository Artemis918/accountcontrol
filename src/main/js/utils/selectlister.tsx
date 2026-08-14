import React, { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES } from 'react';
import { myParseJson } from './misc'
import * as css from './css/selectlister.css';
import { ContextMenu, ContextMenuDef } from './contextmenu';
import { fetchJson } from './dtos';

export type HandleSelectCallback<D> = (shift: boolean, ctrl: boolean, data: D, index: number) => void;
export type IsSelectedCallback = (index: number) => boolean;
export type SelectTableCellRender<D> = (cell: CellInfo<D>) => React.JSX.Element | null;
export type SelectTableGetter<D> = (data: D) => string;
export type CreateFooterCallback<D> = (data: D[]) => D;
export type HasSelectedCallback = () => boolean;
export type AnalyzeListCallback<D> = (data: D[]) => D[];
export type GetExtendedData<D> = () => D[];


export interface ColumnInfo<D> {
	header: string;
	getdata?: SelectTableGetter<D>;
	cellrender?: SelectTableCellRender<D>;
}

export interface CellInfo<D> {
	data: D;
	rownum: number;
	col: ColumnInfo<D>;
}

// ext can have three states
// ext == value --> extend url to urlext
// ext == '' --> dont extend url
// ext == undefined -> dont call fetch at all

export interface SelectListerProps<D> {
	ext?: string;
	url: string;
	extendedData?: GetExtendedData<D>;
	lines: number;
	createFooter?: CreateFooterCallback<D>;
	handleSelect: HandleSelectCallback<D>;
	handleExecute?: HandleSelectCallback<D>;
	analyzeList?: AnalyzeListCallback<D>;
	hasSelected?: HasSelectedCallback;
	isSelected: IsSelectedCallback;
	columns: ColumnInfo<D>[];
	menu?: ContextMenuDef<D>;
}

interface CState<D> {
	data: D[];
	menuOn: boolean;
	menuX: number;
	menuY: number;
}

export class SelectLister<D> extends React.Component<SelectListerProps<D> & { 'testdata-id'?: string }, CState<D>> {

	static defaultProps = {
		lines: 10
	}

	constructor(props: SelectListerProps<D>) {
		super(props);
		this.state = {
			data: [],
			menuOn: false,
			menuX: 0,
			menuY: 0
		};
		this.renderRow = this.renderRow.bind(this);
		this.renderHeadCol = this.renderHeadCol.bind(this);
		this.renderDataCol = this.renderDataCol.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleDoubleClick = this.handleDoubleClick.bind(this);
		this.openContextMenu = this.openContextMenu.bind(this);
		this.closeContextMenu = this.closeContextMenu.bind(this);
		this.setMenuOff = this.setMenuOff.bind(this);
		this.reload();
	}

	componentDidUpdate(prevProps: SelectListerProps<D>): void {
		if (prevProps.ext !== this.props.ext || prevProps.extendedData !== this.props.extendedData) {
			this.setState({ data: [] })
			this.reload();
		}
	}

	setMenuOff(): void {
		this.setState({ menuOn: false });
	}

	getData(rows: number[]): D[] {
		return rows.map((i: number): D => { return this.state.data[i]; });
	}

	getDataAll(): D[] {
		return this.state.data;
	}

	getDataRange(start: number, end: number): D[] {
		var lo: number = start > end ? end : start;
		var hi: number = start > end ? start : end;
		return Array.from(Array(hi - lo + 1).keys())
			.map((i: number): D => this.state.data[i + lo]);
	}

	reload(): void {
		if (this.props.ext != undefined) {
			var self = this;
			fetchJson(this.props.url + this.props.ext,
				(r) => {
					var ext: D[] = this.props.extendedData ? this.props.extendedData() : [];

					if (self.props.analyzeList != undefined)
					 	self.setState({ data: self.props.analyzeList(r.concat(ext)) })
					else
					 	self.setState({ data: r.concat(ext) }) 
				}
			)
		}
	}

	renderHeadCol(col: ColumnInfo<D>): React.JSX.Element {
		return (
			<td key={col.header + "_head"} > {col.header} </td>
		)
	}


	handleDoubleClick(e: React.MouseEvent<HTMLTableRowElement, MouseEvent>): void {
		if (this.props.handleExecute) {
			var rownum: number = e.currentTarget.rowIndex - 1;
			this.props.handleExecute(e.shiftKey,
				e.ctrlKey,
				this.state.data[rownum],
				rownum)
		}
	}


	handleClick(e: React.MouseEvent<HTMLTableRowElement, MouseEvent>): void {
		var rownum: number = e.currentTarget.rowIndex - 1;
		this.props.handleSelect(e.shiftKey,
			e.ctrlKey,
			this.state.data[rownum],
			rownum)
	}

	openContextMenu(e: React.MouseEvent<HTMLTableRowElement>): void {
		if (this.props.menu != null) {
			e.preventDefault();
			if (this.props.hasSelected && !this.props.hasSelected()) {
				var rownum: number = e.currentTarget.rowIndex - 1;
				this.props.handleSelect(false, false, this.state.data[rownum],
					rownum)
			}
			this.setState({ menuOn: true, menuX: e.pageX, menuY: e.pageY });
			window.addEventListener("click", this.setMenuOff)
		}
	}

	closeContextMenu(): void {
		this.setState({ menuOn: false });
		window.removeEventListener("click", this.setMenuOff);
	}

	renderRow(data: D, rownum: number): React.JSX.Element {
		return (
			<tr onClick={this.handleClick}
				onDoubleClick={this.handleDoubleClick}
				onContextMenu={this.openContextMenu}
				className={this.props.isSelected(rownum) ? css.selectedrow : css.unselectedrow}
				key={"slrow" + rownum}>
				{this.props.columns.map((col: ColumnInfo<D>) => this.renderDataCol(col, data, rownum))}
			</tr>
		);
	}

	renderDataCol(col: ColumnInfo<D>, data: D, index: number): React.JSX.Element {
		if (col.cellrender != undefined)
			return (<td key={col.header + index}> {col.cellrender({ data: data, rownum: index, col: col })} </td>);
		else if (col.getdata != undefined) {
			return (<td className={css.singledata} key={col.header + index}> {col.getdata(data)} </td>);
		}
		else
			return (<td> </td>);
	}

	renderFooter(): React.JSX.Element | undefined{
		if (this.props.createFooter != undefined && this.state.data != undefined) {
			var data: D = this.props.createFooter(this.state.data);
			return (
				<tfoot>
					<tr>
						{this.props.columns.map((col: ColumnInfo<D>) => this.renderDataCol(col, data, -1))}
					</tr>
				</tfoot>
			)
		}
		else
			return undefined;
	}

	renderData(): React.JSX.Element {
		if (this.state.data == undefined) {
			return (<tbody />);
		}
		else {
			return (
				<tbody>
					{this.state.data.map(this.renderRow)}
				</tbody>
			);
		}
	}

	renderContextMenu(): React.JSX.Element | undefined {
		if (this.props.menu != undefined) {
			return (
				<ContextMenu<D> menudef={this.props.menu} menuOn={this.state.menuOn} menuX={this.state.menuX} menuY={this.state.menuY} />
			)
		}
		else
			return undefined;
	}

	render(): React.JSX.Element {
		console.log("SelectLister render: " + this.state.data.length);
		return (
			<div testdata-id={this.props['testdata-id']} style={{ position: 'relative', display: 'inline-block' }} >
				<table className={css.selectlister} style={{ height: '' + (this.props.lines * 24 + 22) + 'px' }} >
					<thead>
						<tr>
							{this.props.columns.map((col: ColumnInfo<D>) => this.renderHeadCol(col))}
						</tr>
					</thead>
					{this.renderData()}
					{this.renderFooter()}
				</table>
				{this.renderContextMenu()}
			</div>
		);
	}
}
