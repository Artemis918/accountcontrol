import React, { MouseEvent } from 'react';

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
		if (this.props.menudef.entries[index].func != null)
			this.props.menudef.entries[index].func(index,this.props.menudef.entries[index]);
	}

	renderRow(entry: ContextMenuEntry<D>, index: number): React.JSX.Element {
		return <tr key={entry.name}>
			<td onClick={() => this.executeMenu(index)} style={{ background: index == this.state.highlighted ? 'white' : 'lightblue' }}
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
					<th key={"title"} style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', color: 'black' }} >
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
					<div style={{
						padding: '3px',
						border: '1px solid darkblue',
						background: 'lightblue',
						fontSize: '14px',
						color: 'blue'
					}}>
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