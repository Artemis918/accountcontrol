import * as React from 'react';
import { SelectLister, ColumnInfo, CellInfo, CreateFooterCallback } from "./selectlister";

export { ColumnInfo, CellInfo } from "./selectlister";

export type HandleMultiSelectCallback<D> = ( data: D[] ) => void;

export interface MultiSelectlisterProps<D> {
    ext?: string;
    url: string;
    handleselect?: HandleMultiSelectCallback<D>;
    createFooter?: CreateFooterCallback<D>;
    columns: ColumnInfo<D>[];
    lines?: number;
}

class Range {
    first: number;
    second: number;

    constructor( f: number, s: number ) {
        this.first = f;
        this.second = s;
    }

    getHi(): number {
        return this.first >= this.second ? this.first : this.second;
    }

    getLo(): number {
        return this.first >= this.second ? this.second : this.first;
    }

}

class CState {
    selectedRows: number[];
    range: Range;
}

export class MultiSelectLister<D> extends React.Component<MultiSelectlisterProps<D>, CState> {
    lister: SelectLister<D>;

    constructor( props: MultiSelectlisterProps<D> ) {
        super( props );
        this.lister = undefined;
        this.state = { range: undefined, selectedRows: undefined }
        this.handleSelect = this.handleSelect.bind( this );
        this.isSelected = this.isSelected.bind( this );
    }

    handleSelect( shift: boolean, ctrl: boolean, index: number ): void {
        var selectedData: D[];
        if ( shift ) {
            var f: number;
            if ( this.state.range == undefined ) {
                f = index;
            }
            else {
                f = this.state.range.first
            }
            selectedData = this.lister.getDataRange( f, index );
            this.setState( { selectedRows: undefined, range: new Range( f, index ) } );
        }
        else if ( ctrl ) {
            var rows: number[];
            if ( this.state.range != undefined ) {
                var lo: number = this.state.range.getLo();
                var hi: number = this.state.range.getHi();
                rows = Array.from( Array( hi - lo + 1 ), ( val, i ) => { return i + lo } );
            }
            else if ( this.state.selectedRows != undefined ) {
                rows = Array.from( this.state.selectedRows );
            }
            else {
                rows = [];
            }
            rows.push( index );
            selectedData = this.lister.getData( rows );
            this.setState( { selectedRows: rows, range: undefined } );
        }
        else {
            selectedData = this.lister.getDataRange( index, index );
            this.setState( { selectedRows: undefined, range: new Range( index, index ) } );
        }

        if ( this.props.handleselect != undefined )
            this.props.handleselect( selectedData );
    }

    hasSelectedData(): boolean {
        return this.state.range != undefined || this.state.selectedRows != undefined;
    }

    getSelectedData(): D[] {
        if ( this.state.range != undefined )
            return this.lister.getDataRange( this.state.range.getLo(), this.state.range.getHi() );
        else if ( this.state.selectedRows != undefined )
            return this.lister.getData( this.state.selectedRows );
        else
            return [];
    }

    getDataAll(): D[] {
        return this.lister.getDataAll();
    }

    reload(): void {
        this.setState( { range: undefined, selectedRows: undefined } );
        this.lister.reload();
    }

    isSelected( index: number ): boolean {
        if ( this.state.range != undefined ) {
            return index >= this.state.range.getLo() && index <= this.state.range.getHi();
        }
        else if ( this.state.selectedRows != undefined ) {
            return ( this.state.selectedRows.indexOf( index ) > -1 );
        }
        return false;
    }

    render(): JSX.Element {
        return (
            <SelectLister<D>
                columns={this.props.columns}
                createFooter={this.props.createFooter}
                ext={this.props.ext}
                url={this.props.url}
                lines={this.props.lines}
                handleSelect={( s: boolean, c: boolean, d: D, i: number ) => this.handleSelect( s, c, i )}
                isSelected={( i ) => this.isSelected( i )}
                ref={( r ) => { this.lister = r; }} />
        );
    }
}
