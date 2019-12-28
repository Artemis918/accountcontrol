import * as React from 'react'
import * as css from './css/index.css'

type HandleChange = ( index: number ) => void;

export interface Page {
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
                    <select value={this.props.currentpage} onChange={this.handleChange}>
                          {this.props.pages.map((page:Page) => <option value={page.index}>{page.name}</option>)}
                    </select>
                </div>
                <div className={css.title}> -- {this.props.title} --</div>
            </div>

        );
    }
}