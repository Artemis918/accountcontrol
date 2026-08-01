import React, { MouseEvent } from 'react';
import css from './css/contextmenu.css';

export type HandleMenu<D> = (index: number, entry: ContextMenuEntry<D>) => void;

export interface ContextMenuEntry<D> {
	name: string;
	func: HandleMenu<D>;
}

export interface ContextMenuDef<D> {
	entries?: ContextMenuEntry<D>[];
	title?: string;
}

export interface ContextMenuEntry<D> {
	name: string;
	func: HandleMenu<D>;
	data?: any; 
	active: boolean;
}

export interface ContextMenuProps<D> {
	menudef: ContextMenuDef<D>;
	menuOn: boolean;
	menuX?: number;
	menuY?: number;
}

interface CState {
	highlighted: number
}

export class ContextMenu<D> extends React.Component<ContextMenuProps<D>, CState> {

	constructor(props: ContextMenuProps<D>) {
		super(props);
		this.state = { highlighted: -1 };
		this.renderRow = this.renderRow.bind(this);
		this.executeMenu = this.executeMenu.bind(this);
	}

	highlightMenu(index: number, on: boolean): void {
		this.setState({ highlighted: on ? index : -1 })
	}

	executeMenu(index: number): void {
		if (this.props.menudef.entries[index].func != null && ( this.props.menudef.entries[index].active==null 
			                                                 || this.props.menudef.entries[index].active==true))
			this.props.menudef.entries[index].func(index,this.props.menudef.entries[index]);
	}

	renderRow(entry: ContextMenuEntry<D>, index: number): React.JSX.Element {
		var classname = ""
		if (index == this.state.highlighted) {
			classname = entry.active ? css.entryactivehighlight : css.entryinactivehighlight
		}
		else {
			classname = entry.active ? css.entryactive : css.entryinactive
		}
		return <tr key={entry.name}>
			<td onClick={() => this.executeMenu(index)} 
			    className = {classname}
				onMouseEnter={() => { this.highlightMenu(index, true) }}
				onMouseLeave={() => { this.highlightMenu(index, false) }}
				key={entry.name}
			>{entry.name}  </td>
		</tr>
	}

	renderHead(title: string): React.JSX.Element {
		if (title != null) {
			return (
				<tr key={"head"}>
					<th key={"title"} className = {css.contextmenuhead} >
						{title}
					</th>
				</tr>
			)
		}
	}

	render(): React.JSX.Element {
		if (this.props.menuOn && this.props.menudef != null) {
			return (
				<div style={{
					position: 'fixed',
					zIndex: 1,
					left: this.props.menuX, top: this.props.menuY
				}}>
					<div className={css.contextmenubody}>
						<table>
							<thead>
								{this.renderHead(this.props.menudef.title)}
							</thead>
							<tbody>
								{this.props.menudef.entries.map(this.renderRow)}
							</tbody>
						</table>
					</div>
				</div>);
		}
		else {
			return null
		}
	}
}