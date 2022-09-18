import * as React from 'react';
import { SelectLister, ColumnInfo, CreateFooterCallback } from './selectlister'

export { ColumnInfo, CellInfo } from './selectlister'

export type HandleSingleSelectCallback<D> = ( data: D ) => void;

export interface SingleSelectlisterProps<D> {
    ext?: string;
    url: string;
    handleChange?: HandleSingleSelectCallback<D>;
    handleSelect?: HandleSingleSelectCallback<D>;
    createFooter?: CreateFooterCallback<D>;
    columns: ColumnInfo<D>[];
    lines?: number;
}

class CState<D> {
    selectedData: D;
    selectedRow: number;
}

export class SingleSelectLister<D> extends React.Component<SingleSelectlisterProps<D>, CState<D>> {

    lister: SelectLister<D>;

    constructor( props: SingleSelectlisterProps<D> ) {
        super( props );
        this.state = { selectedData: undefined, selectedRow: undefined };
        this.lister = undefined;
        this.changeSelected = this.changeSelected.bind( this );
        this.isSelected = this.isSelected.bind( this );
    }

	componentDidUpdate(prevProps: SingleSelectlisterProps<D>): void {
		if (prevProps.ext !== this.props.ext) {
			this.setState({ selectedData: undefined, selectedRow: undefined })
		}
	}


	clearSelection(): void {
        this.setState( { selectedData: undefined, selectedRow: undefined } )
	}

    changeSelected( data: D, index: number ): void {
        this.setState( { selectedData: data, selectedRow: index } )
        if ( this.props.handleChange != undefined )
            this.props.handleChange( data );
    }

    executeSelected( data: D, index: number ): void {
        this.setState( { selectedData: data, selectedRow: index } )
        if ( this.props.handleSelect != undefined )
            this.props.handleSelect( data );
    }

    reload(): void {
        this.setState( { selectedData: undefined, selectedRow: undefined } )
        this.lister.reload();
    }

    isSelected( index: number ): boolean {
        return this.state.selectedRow === index;
    }

	getSelected():D {
		return (this.state.selectedData);
	}
    
    getData(): D[] {
        return this.lister.getDataAll();
    }

    render(): JSX.Element {
        return (
            <SelectLister<D>
                columns={this.props.columns}
                createFooter={this.props.createFooter}
                ext={this.props.ext}
                url={this.props.url}
                lines={this.props.lines}
                handleSelect={( _s, _c, d, i ) => this.changeSelected( d, i )}
                handleExecute={( _s, _c, d, i ) => this.executeSelected( d, i )}
                isSelected={( i ) => this.isSelected( i )}
                ref={( r ) => { this.lister = r; }} />
        );
    }
}

