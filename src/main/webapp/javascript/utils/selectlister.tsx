import * as React from 'react';
import { myParseJson } from './misc'
import * as css from './css/selectlister.css';


export type HandleSelectCallback<D> = ( shift: boolean, ctrl: boolean, data: D, index: number ) => void;
export type IsSelectedCallback = ( index: number ) => boolean;
export type SelectTableCellRender<D> = ( cell: CellInfo<D> ) => JSX.Element;
export type SelectTableGetter<D> = ( data: D ) => string;
export type CreateFooterCallback<D> = ( data: D[] ) => D;

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

export interface SelectListerProps<D> {
    ext?: string;
    url: string;
    lines?: number;
    createFooter?: CreateFooterCallback<D>;
    handleSelect?: HandleSelectCallback<D>;
    handleExecute?: HandleSelectCallback<D>;
    isSelected?: IsSelectedCallback;
    columns: ColumnInfo<D>[];
}

class CState<D> {
    data: D[];
}

export class SelectLister<D> extends React.Component<SelectListerProps<D>, CState<D>> {

    static defaultProps = {
        ext: '',
        lines: 10,
    }

    constructor( props: SelectListerProps<D> ) {
        super( props );
        this.state = { data: [] };
        this.renderRow = this.renderRow.bind( this );
        this.renderHeadCol = this.renderHeadCol.bind( this );
        this.renderDataCol = this.renderDataCol.bind( this );
        this.handleClick = this.handleClick.bind( this );
        this.handleDoubleClick = this.handleDoubleClick.bind( this );
    }

    componentDidMount(): void {
        this.reload();
    }

    componentDidUpdate( prevProps: SelectListerProps<D> ): void {
        if ( prevProps.ext !== this.props.ext )
            this.reload();
    }

    getData( rows: number[] ): D[] {
        return rows.map( ( i: number ): D => { return this.state.data[i]; } );
    }

    getDataAll(): D[] {
        return this.state.data;
    }

    getDataRange( start: number, end: number ): D[] {
        var lo: number = start > end ? end : start;
        var hi: number = start > end ? start : end;
        return Array.from( Array( hi - lo + 1 ).keys() )
            .map( ( i: number ): D => this.state.data[i + start] );
    }

    reload(): void {
        var self = this;
        fetch( this.props.url + this.props.ext )
            .then( ( response: Response ) => response.text() )
            .then( ( text ) => { self.setState( { data: myParseJson( text ) } ) } )
    }

    renderHeadCol( col: ColumnInfo<D> ): JSX.Element {
        return (
            <td key={col.header + "_head"}> {col.header} </td>
        )
    }


    handleDoubleClick( e: React.MouseEvent<HTMLTableRowElement, MouseEvent> ): void {
        var rownum: number = e.currentTarget.rowIndex - 1;
        this.props.handleExecute( e.shiftKey,
            e.ctrlKey,
            this.state.data[rownum],
            rownum )
    }


    handleClick( e: React.MouseEvent<HTMLTableRowElement, MouseEvent> ): void {
        var rownum: number = e.currentTarget.rowIndex - 1;
        this.props.handleSelect( e.shiftKey,
            e.ctrlKey,
            this.state.data[rownum],
            rownum )
    }

    renderRow( data: D, rownum: number ): JSX.Element {
        return (
            <tr onClick={this.handleClick}
                onDoubleClick={this.handleDoubleClick}
                className={this.props.isSelected( rownum ) ? css.selectedrow : css.unselectedrow}
                key={"slrow" + rownum}>
                {this.props.columns.map( ( col: ColumnInfo<D> ) => this.renderDataCol( col, data, rownum ) )}
            </tr>
        );
    }

    renderDataCol( col: ColumnInfo<D>, data: D, index: number ): JSX.Element {
        if ( col.cellrender != undefined )
            return ( <td key={col.header + index}> {col.cellrender( { data: data, rownum: index, col: col } )} </td>);
        else if ( col.getdata != undefined ) {
            return ( <td className={css.singledata} key={col.header + index}> {col.getdata( data )} </td> );
        }
        else
            return (<td> </td>);
    }

    renderFooter(): JSX.Element {
        if ( this.props.createFooter != undefined ) {
            var data: D = this.props.createFooter( this.state.data );
            return (
                <tfoot>
                    <tr>
                        {this.props.columns.map( ( col: ColumnInfo<D> ) => this.renderDataCol( col, data, -1 ) )}
                    </tr>
                </tfoot>
            )
        }
        else
            return null;
    }

    render(): JSX.Element {
        return (
            <table className={css.selectlister} style= {{height: '' + (this.props.lines * 24 + 22) + 'px' }}>
                <thead>
                    <tr>
                        {this.props.columns.map( ( col: ColumnInfo<D> ) => this.renderHeadCol( col ) )}
                    </tr>
                </thead>
                <tbody >
                    {this.state.data.map( this.renderRow )}
                </tbody>
                {this.renderFooter()}
            </table>
        );
    }
}

