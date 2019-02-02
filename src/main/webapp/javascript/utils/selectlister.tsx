import * as React from 'react';
import * as ReactTable from 'react-table';
import * as css from './css/selectlister.css';


export type HandleSelectCallback<D> = ( shift: boolean, ctrl: boolean, data: D, index: number ) => void;
export type IsSelectedCallback = ( index: number ) => boolean;

export interface SelectListerProps<D> {
    ext?: string;
    url: string;
    lines?: number
    handleSelect?: HandleSelectCallback<D>;
    handleExecute?: HandleSelectCallback<D>;
    isSelected?: IsSelectedCallback;
    columns: ReactTable.Column[];
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
        this.getTrProps = this.getTrProps.bind( this );
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

    getDataAll() :D[] {
            return this.state.data;
    }
    
    getDataRange( start: number, end: number ): D[] {
        var lo: number = start > end ? end : start;
        var hi: number = start > end ? start : end;
        return Array.from( Array( hi - lo + 1 ).keys() ).map( ( i: number ): D => this.state.data[i] );
    }

    reload(): void {
        var self = this;
        fetch( this.props.url + this.props.ext )
            .then( response => response.json() )
            .then( ( d ) => self.setState( { data: d } ) );
    }

    getTrProps( rowInfo: ReactTable.RowInfo ): object {
        var table = this;
        if ( rowInfo && rowInfo.row ) {
            return ( {
                onClick: ( e: MouseEvent ) => this.props.handleSelect( e.shiftKey,
                    e.ctrlKey,
                    this.state.data[rowInfo.index],
                    rowInfo.index ),
                onDoubleClick: ( e: MouseEvent ) => this.props.handleExecute( e.shiftKey,
                    e.ctrlKey,
                    this.state.data[rowInfo.index],
                    rowInfo.index ),
                className: this.props.isSelected( rowInfo.index ) ? css.selectedrow : css.unselectedrow
            } );
        } else {
            return ( {} );
        }
    }

    render(): JSX.Element {
        return (
            <div>
                <ReactTable.default
                    getTrProps={( state: any, rowInfo: ReactTable.RowInfo ) => this.getTrProps( rowInfo )}
                    defaultPageSize={this.props.lines}
                    data={this.state.data}
                    columns={this.props.columns} />
            </div>
        );
    }
}

