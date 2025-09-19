import React  from 'react'
import css from './css/index.css'

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
        this.handlePageClick = this.handlePageClick.bind( this );
    }

    handlePageClick( pageIndex: number ): void {
        this.props.setPage( pageIndex );
    }

    render(): React.JSX.Element {
        return (
            <div className={css.header}>
                <div className={css.pageNavigation}>
                    {this.props.pages.map((page: Page) => (
                        <span
                            key={page.index}
                            className={page.index === this.props.currentpage ? css.activePageLink : css.pageLink}
                            onClick={() => this.handlePageClick(page.index)}
                        >
                            {page.name}
                        </span>
                    ))}
                </div>
            </div>

        );
    }
}