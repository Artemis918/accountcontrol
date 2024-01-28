import React, { MouseEvent } from 'react';

export type HandleMenu<D> = (index: number) => void;

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
		this.props.menudef.entries[index].func(index);
	}

	renderRow(entry: ContextMenuEntry<D>, index: number): JSX.Element {

		return <tr>
			<td onClick={() => this.executeMenu(index)} style={{ background: index == this.state.highlighted ? 'white' : 'lightblue' }}
				onMouseEnter={() => { this.highlightMenu(index, true) }}
				onMouseLeave={() => { this.highlightMenu(index, false) }}
			>{entry.name}  </td>
		</tr>
	}

	renderHead(title: string): JSX.Element {
		if (title != null) {
			return (
				<th style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', color: 'black' }} >
					{title}
				</th>
			)
		}
	}

	render(): JSX.Element {
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
							{this.renderHead(this.props.menudef.title)}
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