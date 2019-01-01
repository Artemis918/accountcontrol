/*
 * 
 */

import React from 'react';
import SelectLister from 'utils/selectlister'


export default class SingleSelectLister extends React.Component {
    
    constructor( props ) {
        super( props );
        this.state = { selected: undefined };
        this.lister=undefined;
        this.changeSelected = this.changeSelected.bind(this);
        this.setUrlExtension = this.setUrlExtension.bind(this);
        this.isSelected = this.isSelected.bind(this);
    }
    
    changeSelected( index ) {
        this.setState( { selected: index } )
        this.props.handleChange( this.state.data[index].id);
    }
    
    setUrlExtension(ext) {
        this.lister.setUrlExtension(ext);
    }
    
    isSelected(index) {
        return this.state.seleted == index;
    }

    render() {
        return (
            <SelectLister
                columns= {this.props.columns}
                ext={this.props.ext} 
                url={this.props.url} 
                handleSelect={(s,c,i)=> this.changeSelected(i)} 
                isSelected={(i)=>this.isSelected(i)}
                ref={( r ) => { this.lister = r; }}/>
        ); 
    }
}
