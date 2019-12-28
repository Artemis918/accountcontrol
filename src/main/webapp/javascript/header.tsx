import * as React from 'react'
import * as css from './css/index.css'

type HandleChange = ( index: number ) => void;

interface Page {
    index: number
    name: string;
}

interface HeaderProps {
    changePage: HandleChange;
    title: string;
    currentpage: number;
    pages: Page[];
}


export class Header extends React.Component<HeaderProps, {}> {

    constructor( props: HeaderProps ) {
        super( props );
        this.handleChange = this.handleChange.bind( this );
    }

    handleChange( event: React.ChangeEvent<HTMLSelectElement> ): void {
        this.props.changePage( parseInt( event.target.value ) );
    }

    render(): JSX.Element {
        return (
            <div className={css.header}>

                <div className={css.headerselector}>
                    <select value={this.props.value} onChange={this.handleChange}>
                        <option value="0">Planen</option>
                        <option value="1">Belege</option>
                        <option value="2">Buchen</option>
                        <option value="3">Konten</option>
                        <option value="4">Übersicht</option>
                        <option value="5">Stammdaten</option>
                    </select>
                </div>
                <div className={css.title}> -- {this.props.title} --</div>
            </div>

        );
    }
}