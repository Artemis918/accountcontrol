import * as React from 'react';
import {useIntl, WrappedComponentProps } from 'react-intl';

import { Header, Page as HeaderPage } from './header'
import { Footer } from './footer'
import { TaskSelector, Task } from './utils/taskselector'
import { RecordUploader } from './records/recorduploader'
import { RecordCreator } from './records/recordcreator'
import { Templates } from './planing/templates'
import { Planen } from './planing/planen'
import { PatternPlanen } from './planing/patternplanen'
import Assign from './assign/assign'
import { Categories } from './check/categories'
import { OverviewGFX } from './overviewgfx'
import CategoriesConfig from './configuration/categoriesconfig'
import { MessageID } from './utils/messageid';


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
        this.footer = React.createRef();
        this.setPage = this.setPage.bind( this );
        this.sendMessage = this.sendMessage.bind( this );
        this.createPages();
        this.createHeaderData();
    }  
    

    sendMessage( msg: string, error: MessageID ): void {
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
                    { name: this.label("task.upload"), comp: ( <RecordUploader sendmessage={this.sendMessage} /> ) },
                    { name: this.label("task.create"), comp: ( <RecordCreator sendmessage={this.sendMessage} /> ) }
                ]
        },
        {
            title: this.label("page.assign"), tasks:
                [
                    { name: this.label("task.recordlist"), comp: ( <Assign sendmessage={this.sendMessage} /> ) },
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

    renderPage (page: Page,index:number): JSX.Element {
        return ( <TaskSelector tasks={page.tasks} pageindex={index} currenttask={0} /> );
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
                {this.renderPage(this.pages[this.state.curpage],this.state.curpage)}
                <Footer intl={this.props.intl} ref={this.footer} />
              </div>
        )
    }
}

type CreateTabbedPages = (props:TabbedPagesProps) => JSX.Element;

const TabbedPages:CreateTabbedPages = (props : TabbedPagesProps) => {
    return (<_TabbedPages {...props} intl={useIntl()}/>);
}

export default TabbedPages;