import * as React from 'react'

type HandleChange = ( index: number ) => void;

interface HeaderProps {
    changeValue: HandleChange;
    title: string;
    value: number;
}


export class Header extends React.Component<HeaderProps, {}> {

    constructor( props: HeaderProps ) {
        super( props );
        this.handleChange = this.handleChange.bind( this );
    }

    handleChange( event: React.ChangeEvent<HTMLSelectElement> ): void {
        this.props.changeValue( parseInt( event.target.value ) );
    }

    render(): JSX.Element {
        return (
            <div>
                <span style={{ width: '70%' }}> {this.props.title} </span>
                <span>
                    <select value={this.props.value} onChange={this.handleChange}>
                        <option value="0">Planen</option>
                        <option value="1">Belege</option>
                        <option value="2">Buchen</option>
                        <option value="3">Konten</option>
                        <option value="4">Übersicht</option>
                        <option value="5">Stammdaten</option>
                    </select>
                </span>
                <hr />
            </div>

        );
    }
}