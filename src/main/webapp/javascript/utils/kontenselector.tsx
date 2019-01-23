import * as React from 'react'
import { DropdownService } from './dropdownservice'


export type HandleKontoChange = ( kontoid: number, group: number ) => void;

export interface KontenSelectorProps {
    onChange?: HandleKontoChange;
    group?: number;
    konto?: number;
    horiz?: boolean;
}

class CState {
    group: number;
    konto: number;
}

export class KontenSelector extends React.Component<KontenSelectorProps, CState>{

    kontoselect: React.RefObject<DropdownService>;

    constructor( props: KontenSelectorProps ) {
        super( props );
        this.state = { group: this.props.group, konto: this.props.konto };
        this.setGroup = this.setGroup.bind( this );
        this.setKonto = this.setKonto.bind( this );
        this.kontoselect = React.createRef();
    }

    setGroup( e: number ): void {
        this.setState( { group: e } );
        this.kontoselect.current.setparam( '' + e );
    }

    setKonto( e: number ): void {
        this.setState( { konto: e } )
        this.props.onChange( e, this.state.group );
    }

    getKonto(): number {
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
                        onChange={( e ) => this.setState( { konto: e } )}
                        url='collections/konto'
                        param={this.state.group == undefined ? '' : '' + this.state.group}
                        ref={this.kontoselect} />
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
                            onChange={( e ) => this.setState( { konto: e } )}
                            url='collections/konto'
                            param={this.state.group == undefined ? '' : '' + this.state.group}
                            ref={this.kontoselect} />
                    </div>
                </div>
            );
        }
    }
}