import * as React from 'react';
import { Column } from 'react-table'
import { SelectLister } from './selectlister'

export type HandleSingleSelectCallback<D> = ( data: D ) => void;

export interface SingleSelectlisterProps<D> {
    ext?: string;
    url: string;
    handleChange?: HandleSingleSelectCallback<D>;
    handleSelect?: HandleSingleSelectCallback<D>;
    columns: Column[];
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

    changeSelected( data: D, index: number ): void {
        this.setState( { selectedData: data, selectedRow: index } )
        if (this.props.handleChange != undefined)
            this.props.handleChange( data );
    }
    
    executeSelected( data: D, index: number ): void {
        this.setState( { selectedData: data, selectedRow: index } )
        if (this.props.handleSelect != undefined)
            this.props.handleSelect( data );
    }

    reload(): void {
        this.setState( { selectedData: undefined, selectedRow: undefined } )
        this.lister.reload();
    }

    isSelected( index: number ): boolean {
        return this.state.selectedRow === index;
    }

    render(): JSX.Element {
        return (
            <SelectLister<D>
                columns={this.props.columns}
                ext={this.props.ext}
                url={this.props.url}
                handleSelect={( s, c, d, i ) => this.changeSelected( d, i )}
                handleExecute={( s, c, d, i ) => this.executeSelected( d, i )}
                isSelected={( i ) => this.isSelected( i )}
                ref={( r ) => { this.lister = r; }} />
        );
    }
}

