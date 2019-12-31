import * as React from 'react';
import {useIntl, WrappedComponentProps } from 'react-intl';

import { Header, Page as HeaderPage } from './header'
import { Footer } from './footer'
import { TaskSelector, Task } from './utils/taskselector'
import { BelegUploader } from './records/beleguploader'
import { BelegErfassung } from './records/belegerfassung'
import { Templates } from './planing/templates'
import { Planen } from './planing/planen'
import { PatternPlanen } from './planing/patternplanen'
import { Buchen } from './assign/buchen'
import { Categories } from './check/categories'
import { OverviewGFX } from './overviewgfx'
import CategoriesConfig from './configuration/categoriesconfig'



type ChangeValue = ( index: number ) => void;


interface TabbedPagesProps {
    page: number;
}

interface IState {
    curpage: number;
}

interface Page {
    title: string;
    tasks: Task[];
}


class _TabbedPages extends React.Component<TabbedPagesProps & WrappedComponentProps, IState> {

    footer: React.RefObject<Footer>;
    pages: Page[];
    headerpages: HeaderPage[];

    constructor( props: TabbedPagesProps &  WrappedComponentProps) {
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
    
    label(id: string) : string {
        return this.props.intl.formatMessage({id: id});
    }
    
    createPages(): void {

        this.pages = [
        {
            title: this.label("page.plan"), tasks:
                [
                    { name: this.label("task.template"), comp: ( <Templates sendmessage={this.sendMessage} /> ) },
                    { name: this.label("task.plan"), comp: ( <Planen sendmessage={this.sendMessage} /> ) },
                    { name: this.label("task.pattern"), comp: ( <PatternPlanen sendmessage={this.sendMessage} /> ) },
                ]
        },
        {
            title: this.label("page.accountRecords"), tasks:
                [
                    { name: this.label("task.upload"), comp: ( <BelegUploader sendmessage={this.sendMessage} /> ) },
                    { name: this.label("task.create"), comp: ( <BelegErfassung sendmessage={this.sendMessage} /> ) }
                ]
        },
        {
            title: this.label("page.assign"), tasks:
                [
                    { name: this.label("task.recordlist"), comp: ( <Buchen sendmessage={this.sendMessage} /> ) },
                ]
        },
        {
            title: this.label("page.check"), tasks:
                [
                    { name: this.label("task.categories"), comp: ( <Categories sendmessage={this.sendMessage} /> ) },
                ]
        },
        {
            title: this.label("page.overview"), tasks: 
                [
                    { name: this.label("task.graph"), comp: ( <OverviewGFX /> ) },
                    { name: this.label("task.table"), comp: ( <div /> ) }
                ]
        },
        {
            title: this.label("page.configuration"), tasks: 
                [
                    { name: this.label("task.catconfig"), comp: ( <CategoriesConfig sendmessage={this.sendMessage} /> ) },
                ]
        }
    ];
    }

    renderPage (page: Page): JSX.Element {
        return ( <TaskSelector tasks={page.tasks} currenttask={0} pagename={page.title} /> );
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

type CreateTabbedPages = (props:TabbedPagesProps) => JSX.Element;

const TabbedPages:CreateTabbedPages = (props : TabbedPagesProps) => {
    return (<_TabbedPages {...props} intl={useIntl()}/>);
}

export default TabbedPages;