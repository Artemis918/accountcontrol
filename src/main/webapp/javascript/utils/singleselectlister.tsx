import * as React from 'react';
import {SelectLister} from './selectlister'

export type HandleSingleSelectCallback<D> = ( data: D ) => void;

export interface SingleSelectlisterProps<D> {
    ext: string;
    url: string;
    handleChange: HandleSingleSelectCallback<D>;
    columns: any[];
}

class CState<D> {
    selectedData: D;
    selectedRow: number;
}

export default class SingleSelectLister<D> extends React.Component<SingleSelectlisterProps<D>,CState<D>> {
    
    lister: SelectLister<D>;
    
    constructor( props: SingleSelectlisterProps<D> ) {
        super( props );
        this.state = { selectedData: undefined, selectedRow: undefined };
        this.lister=undefined;
        this.changeSelected = this.changeSelected.bind(this);
        this.setUrlExtension = this.setUrlExtension.bind(this);
        this.isSelected = this.isSelected.bind(this);
    }
    
    changeSelected( data: D, index: number  ): void {
        this.setState( { selectedData: data, selectedRow: index } )
        this.props.handleChange( data );
    }
    
    reload(): void {
        this.setState( { selectedData: undefined, selectedRow: undefined } )
    }
    
    setUrlExtension(ext : string): void {
        this.setState( { selectedData: undefined, selectedRow: undefined } )
        this.lister.setUrlExtension(ext);
    }
    
    isSelected(index: number ): boolean {
        return this.state.selectedRow === index;
    }

    render() : JSX.Element {
        return (
            <SelectLister<D>
                columns= {this.props.columns}
                ext={this.props.ext} 
                url={this.props.url} 
                handleSelect={(s,c,d,i)=> this.changeSelected(d,i)} 
                isSelected={(i)=>this.isSelected(i)}
                ref={( r ) => { this.lister = r; }}/>
        ); 
    }
}

