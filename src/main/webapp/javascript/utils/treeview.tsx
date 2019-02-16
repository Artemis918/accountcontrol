import * as React from 'react'
import * as tcss from './css/treeview.css'

export type GetURLCallback = ( level: number, id: number ) => string;
export type HandleSelectCallback = ( level: number, id: number ) => void;

class Enum {
    text: string;
    value: number;
}

class CState {
    root: Node;
    selected: Node;
}

class Node {
    id: number;
    level: number;
    name: string;
    expanded: boolean;
    url?: string;
    children?: Node[];
}

export interface TreeViewProperties {
    getURL: GetURLCallback;
    handleSelect: HandleSelectCallback;
}

export class TreeView extends React.Component<TreeViewProperties, CState> {

    root: Node;

    constructor( props: TreeViewProperties ) {
        super( props );
        this.root = { id: 0, level: 0, name: '', expanded: false, url: this.props.getURL( 0, 0 ) };
        this.state = { root: this.root, selected: undefined };
        this.renderButton = this.renderButton.bind( this );
        this.renderNode = this.renderNode.bind( this );
        this.renderChildren = this.renderChildren.bind( this );
        this.fillNode = this.fillNode.bind( this );
        this.expandNode = this.expandNode.bind( this );
    }

    createNode( data: Enum, level: number ): Node {
        return (
            {
                id: data.value,
                level: level,
                name: data.text,
                expanded: false,
                url: this.props.getURL( level, data.value )
            }
        )
    }

    fillNode( data: Enum[], node: Node ): void {
        node.children = data.map( ( e ) => this.createNode( e, node.level + 1 ) )
        node.expanded = true;
        this.setState( { root: this.root } );
        if ( this.state.selected == undefined ) {
            this.treeSelect(this.root.children[0]);
        }
    }

    expandNode( node: Node ): void {
        if ( node.children == undefined && node.url != undefined ) {
            fetch( node.url )
                .then( response => response.json() )
                .then( data => { this.fillNode( data, node ) } )
        }
        else {
            node.expanded = !node.expanded;
            this.setState( { root: this.root } );
        }

    }

    componentDidMount(): void {
        this.expandNode( this.root );
    }

    treeSelect( node: Node ): void {
        this.setState( { selected: node } );
        this.props.handleSelect( node.level, node.id );
    }

    renderButton( node: Node ): JSX.Element {
        if ( node.url ) {
            return ( <div>
                <button className={tcss.expandbutton} onClick={( e ) => this.expandNode( node )}>+</button>
                <button className={node == this.state.selected ? tcss.selected : tcss.button} onClick={( e ) => this.treeSelect( node )}>{node.name}</button>
            </div>
            )
        }
        else
            return ( <button className={tcss.button} onClick={( e ) => this.treeSelect( node )}>{node.name}</button> )
    }

    renderNode( node: Node ): JSX.Element {
        if ( node.children && node.expanded ) {
            return ( <li key={node.name + node.id} >{this.renderButton( node )}{this.renderChildren( node )}</li> );
        }
        else {
            return ( <li key={node.name + node.id}>{this.renderButton( node )}</li> );
        }
    }


    renderChildren( node: Node ): JSX.Element {
        if ( node.children != undefined ) {
            return ( <div className={tcss.treeview}><ul className={node.level==0?tcss.list0:tcss.list}>{node.children.map( this.renderNode )}</ul></div> )
        }
        else {
            return ( <div></div> );
        }
    }

    render(): JSX.Element {
        return this.renderChildren( this.state.root );
    }

}