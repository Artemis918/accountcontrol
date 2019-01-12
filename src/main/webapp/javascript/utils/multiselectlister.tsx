import * as React from 'react';
import { SelectLister } from "./selectlister";

export type HandleMultiSelectCallback<D> = ( data: D[] ) => void;

export interface MultiSelectlisterProps<D> {
    ext: string;
    url: string;
    handleselect: HandleMultiSelectCallback<D>;
    columns: any[];
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

class CState<D> {
    selectedRows: number[];
    range: Range;
}

export default class MultiSelectLister<D> extends React.Component<MultiSelectlisterProps<D>, CState<D>> {
    lister: SelectLister<D>;

    constructor( props: MultiSelectlisterProps<D> ) {
        super( props );
        this.lister = undefined;
        this.state = { range: undefined, selectedRows: undefined }
        this.setUrlExtension = this.setUrlExtension.bind( this );
        this.handleSelect = this.handleSelect.bind( this );
        this.isSelected = this.isSelected.bind( this );
    }

    setUrlExtension( extension: string ): void {
        this.lister.setUrlExtension( extension );
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
                rows = Array.from( Array( this.state.range.getHi() - this.state.range.getLo() ).keys() );
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

    getSelectedData(): D[] {
        if ( this.state.range != undefined )
            return this.lister.getDataRange( this.state.range.getLo(), this.state.range.getHi() );
        else if ( this.state.selectedRows != undefined )
            return this.lister.getData( this.state.selectedRows );
        else
            return [];
    }

    relaod(): void {
        this.lister.reload();
    }

    isSelected( index: number ): boolean {
        if ( this.state.range != undefined ) {
            return index >= this.state.range.getLo() && index >= this.state.range.getHi();
        }
        else if ( this.state.selectedRows != undefined ) {
            return ( index in this.state.selectedRows );
        }
        return false;
    }

    render() :JSX.Element {
        return (
            <SelectLister<D>
                columns={this.props.columns}
                ext={this.props.ext}
                url={this.props.url}
                handleSelect={( s: boolean, c: boolean, d: D, i: number ) => this.handleSelect( s, c, i )}
                isSelected={( i ) => this.isSelected( i )}
                ref={( r ) => { this.lister = r; }} />
        );
    }
}
