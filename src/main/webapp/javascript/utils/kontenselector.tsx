import * as React from 'react'
import { DropdownService } from './dropdownservice'


export type HandleKontoChange = ( kontoid: number, group: number ) => void;

export interface KontenSelectorProps {
    onChange?: HandleKontoChange;
    group?: number;
    konto?: number;
    horiz?: boolean;
}

interface IState {
    group: number;
    konto: number
}

export class KontenSelector extends React.Component<KontenSelectorProps, IState>{

    constructor( props: KontenSelectorProps ) {
        super( props );
        this.state = { group: this.props.group, konto: this.props.konto };
        this.setGroup = this.setGroup.bind( this );
        this.setKonto = this.setKonto.bind( this );
    }
    
    setGroup( e: number ): void {
        this.setState( { group: e, konto: undefined } );
    }

    setKonto( e: number ): void {
        if (this.props.onChange != undefined )
            this.props.onChange( e, this.state.group );
        this.setState( { konto: e} );
    }
    
    componentDidUpdate(prevProps: KontenSelectorProps) :void {
        if (prevProps.konto != this.props.konto || prevProps.group != this.props.group)
            this.setState({ group: this.props.group, konto: this.props.konto } )
    }
    
    getKonto() : number {
        return this.state.konto;
    }

    render(): JSX.Element {
        if ( this.props.horiz ) {
            return (
                <div>
                    <DropdownService value={this.state.group}
                        onChange={this.setGroup}
                        url='collections/kontogroups' />
                    <DropdownService value={this.state.konto}
                        onChange={this.setKonto}
                        url='collections/konto'
                        param={'' + this.state.group} />
                </div> )
        }
        else {
            return (
                <div>
                    <div>
                        <DropdownService value={this.state.group}
                            onChange={this.setGroup}
                            url='collections/kontogroups' />
                    </div>
                    <div>
                        <DropdownService value={this.state.konto}
                            onChange={this.setKonto}
                            url='collections/konto'
                            param={'' + this.state.group} />
                    </div>
                </div>
            );
        }
    }
}