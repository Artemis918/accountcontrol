import * as React from 'react'
import * as css from './css/index.css'

type SetPage = ( index: number ) => void;

export interface Page {
    index: number
    name: string;
}

interface HeaderProps {
    setPage: SetPage;
    title: string;
    currentpage: number;
    pages: Page[];
}


export class Header extends React.Component<HeaderProps, {}> {

    constructor( props: HeaderProps ) {
        super( props );
        this.setPage = this.setPage.bind( this );
    }

    setPage( event: React.ChangeEvent<HTMLSelectElement> ): void {
        this.props.setPage( parseInt( event.target.value ) );
    }

    render(): JSX.Element {
        return (
            <div className={css.header}>
                <div>
                    <select value={this.props.currentpage} onChange={this.setPage} className={css.headerselector}>
                          {this.props.pages.map((page:Page) => <option key={page.index} value={page.index}>{page.name}</option>)}
                    </select>
                </div>
                <div className={css.title}> -- {this.props.title} --</div>
            </div>

        );
    }
}