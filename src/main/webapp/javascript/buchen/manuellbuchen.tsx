import * as React from 'react'
import { KontenSelector } from '../utils/kontenselector'
import { BuchungsBeleg } from '../utils/dtos'
import * as mcss from './css/manuellbuchen.css'

type onCommitCallback = () => void;

export interface ManuellBuchenProps {
    beleg: BuchungsBeleg;
    onCommit: onCommitCallback;
}

interface IState {
    data: TeilBuchung[];
}

class TeilBuchung {
    betrag: number;
    details: string;
    konto: number;
    group: number;
    wertstring: string;

    constructor( details: string, wert: number, konto: number, group: number ) {
        this.setBetrag( wert );
        this.konto = konto;
        this.group = group;
        this.details = details;
    }


    setBetrag( wert: number ) {
        this.wertstring = ( Math.abs( wert ) / 100 ).toFixed( 2 );
        this.betrag = wert;
    }
}


export class ManuellBuchen extends React.Component<ManuellBuchenProps, IState> {

    constructor( props: ManuellBuchenProps ) {
        super( props )
        var initial: TeilBuchung = new TeilBuchung( props.beleg.details, props.beleg.wert,1,1 );
        this.state = { data: [initial] };
        this.setKonto = this.setKonto.bind( this );
        this.renderDetails = this.renderDetails.bind( this );
        this.renderKonto = this.renderKonto.bind( this );
        this.renderValue = this.renderValue.bind( this );
        this.recalcData = this.recalcData.bind( this );
    }

    save(): void {

    }

    setKonto( index: number, konto: number, group: number ): void {
        const data: TeilBuchung[] = this.state.data;
        data[index].konto = konto;
        data[index].group = group;
        this.setState( { data } );
    }


    recalcData( data: TeilBuchung[] ): TeilBuchung[] {
        var result: TeilBuchung[] = [];
        var sum: number = 0

        for ( var row of data ) {
            if ( sum + row.betrag > this.props.beleg.wert ) {
                var betrag: number = this.props.beleg.wert - sum;
                row.betrag = betrag > 0 ? betrag : 0;
                row.wertstring = ( row.betrag / 100 ).toFixed( 2 );
            }
            result.push( row );
            sum += row.betrag;
        }

        if ( sum < Math.abs( this.props.beleg.wert ) ) {

            if ( result[result.length - 1].details == 'Rest' ) {
                result[result.length - 1].setBetrag( result[result.length - 1].betrag + this.props.beleg.wert - sum );
            }
            else {
                var newbuch: TeilBuchung = new TeilBuchung( 'Rest', this.props.beleg.wert - sum, result[result.length - 1].konto, result[result.length - 1].group)
                result.push( newbuch );
            }
        }
        return result;
    }

    removeRow( index: number ): void {
        var data: TeilBuchung[] = this.state.data;
        data.splice( index, 1 );
        this.setState( { data: this.recalcData( data ) } );
    }

    renderDetails( index: number ): JSX.Element {
        return (
            <input type='text'
                value={this.state.data[index].details}
                className={mcss.maninput}
                onChange={e => {
                    const data: TeilBuchung[] = this.state.data;
                    data[index].details = e.target.value;
                    this.setState( { data } );
                }}
            />
        )
    }

    renderKonto( index: number ): JSX.Element {
        return (
            <KontenSelector horiz={true}
                konto={this.state.data[index].konto}
                group={this.state.data[index].group}
                onChange={( konto, group ) => this.setKonto( index, konto, group )} />
        )
    }

    renderValue( index: number ): JSX.Element {
        return (
            <input type='text'
                value={this.state.data[index].wertstring}
                className={mcss.maninput}
                onChange={( e: React.ChangeEvent<HTMLInputElement> ) => {
                    const data: TeilBuchung[] = this.state.data;
                    data[index].wertstring = e.target.value;
                    this.setState( { data } );

                }}
                onBlur={( e: React.FocusEvent<HTMLInputElement> ) => {
                    var newval: number = parseFloat( e.target.value.replace( ',', '.' ) ) * 100;
                    const data: TeilBuchung[] = this.state.data;
                    data[index].setBetrag( newval == NaN ? data[index].betrag : newval );
                    this.setState( { data: this.recalcData( this.state.data ) } );
                }}
            />
        )
    }

    renderDelButton( index: number ): JSX.Element {
        if ( this.state.data.length > 1 && index < this.state.data.length-1)
            return ( <button onClick={e => { this.removeRow( index ) }}>x</button> );
        else
            return ( <div/> );
    }

    renderRow( index: number ): JSX.Element {
        return (
            <tr key={'row' + index}>
                <td>{this.renderDetails( index )}</td>
                <td>{this.renderKonto( index )}</td>
                <td>{this.renderValue( index )}</td>
                <td>{this.renderDelButton( index )}</td>
            </tr> )
    }

    render(): JSX.Element {
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Details</th>
                            <th>Konto</th>
                            <th>Betrag</th>
                            <th>-</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map( ( d: TeilBuchung, i: number ) => this.renderRow( i ) )}
                    </tbody>
                </table>
                <button onClick={this.save} > Speichern </button>
            </div>
        )
    }
}