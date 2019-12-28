import * as React from 'react';
import {useIntl, IntlShape, WrappedComponentProps } from 'react-intl';

import { Header, Page as HeaderPage } from './header'
import { Footer } from './footer'
import { TaskSelector, Task } from './utils/taskselector'
import { BelegUploader } from './belege/beleguploader'
import { BelegErfassung } from './belege/belegerfassung'
import { Templates } from './planing/templates'
import { Planen } from './planing/planen'
import { PatternPlanen } from './planing/patternplanen'
import { Buchen } from './buchen/buchen'
import { Konten } from './kontrolle/konten'
import { OverviewGFX } from './overviewgfx'



type ChangeValue = ( index: number ) => void;
type CreateTabbedPages = (props:TabbedPagesProps) => JSX.Element;

interface TabbedPagesProps {
    page: number;
}

interface TabbedPagesPropsIntl {
    page: number;
    intl: IntlShape;
}

interface IState {
    curpage: number;
}

interface Page {
    title: string;
    tasks: Task[];
}


class _TabbedPages extends React.Component<TabbedPagesPropsIntl, IState> {

    footer: React.RefObject<Footer>;
    pages: Page[];
    headerpages: HeaderPage[];

    constructor( props: TabbedPagesPropsIntl ) {
        super( props );
        this.state = { curpage: props.page };
        this.setPage = this.setPage.bind( this );
        this.sendMessage = this.sendMessage.bind( this );
        this.createPages();
        this.createHeaderData();
    }  
    

    sendMessage( msg: string, error: boolean ): void {
        this.footer.current.setmessage( msg, error );
    }
    
    setPage( page: number ): void {
        this.setState( { curpage: page } );
    }
    
    createHeaderData():void {
        this.headerpages = this.pages.map((page:Page,index:number) => {
            return { index: index, name: page.title};
        })
    }
    
    createPages(): void {

        this.pages = [
        {
            title: this.props.intl.formatMessage({id: "page.plan"}), tasks:
                [
                    { name: 'Vorlagen', comp: ( <Templates sendmessage={this.sendMessage} /> ) },
                    { name: 'Planen', comp: ( <Planen sendmessage={this.sendMessage} /> ) },
                    { name: 'Muster', comp: ( <PatternPlanen sendmessage={this.sendMessage} /> ) },
                ]
        },
        {
            title: this.props.intl.formatMessage({id: "page.accountRecords"}), tasks:
                [
                    { name: 'Laden', comp: ( <BelegUploader sendmessage={this.sendMessage} /> ) },
                    { name: 'Erfassen', comp: ( <BelegErfassung sendmessage={this.sendMessage} /> ) }
                ]
        },
        {
            title: this.props.intl.formatMessage({id: "page.assign"}), tasks:
                [
                    { name: 'Belegliste', comp: ( <Buchen sendmessage={this.sendMessage} /> ) },
                ]
        },
        {
            title: this.props.intl.formatMessage({id: "page.check"}), tasks:
                [
                    { name: 'Alle Konten', comp: ( <Konten sendmessage={this.sendMessage} /> ) },
                ]
        },
        {
            title: this.props.intl.formatMessage({id: "page.overview"}), tasks: [
                { name: 'Grafisch', comp: ( <OverviewGFX /> ) },
                { name: 'Tabelle', comp: ( <div /> ) }
            ]
        }
    ];
    }

    renderPage (page: Page): JSX.Element {
        return ( <TaskSelector tasks={page.tasks} currenttask={0} tasksname={page.title} /> );
    }

    render(): JSX.Element {
        this.createPages();
        this.createHeaderData();
        return (
              <div>
                <Header setPage={this.setPage} 
                        currentpage={this.state.curpage} 
                        title={this.pages[this.state.curpage].title} 
                        pages = {this.headerpages}
                />
                {this.renderPage(this.pages[this.state.curpage])}
                <Footer ref={this.footer} />
              </div>
        )
    }
}

const TabbedPages:CreateTabbedPages = (props : TabbedPagesProps) => {
    const intl:IntlShape = useIntl();
    return (<_TabbedPages page={props.page} intl={intl}/>);
}

export default TabbedPages;