import React from 'react';

import { Header, Page as HeaderPage } from './header'
import { Footer } from './footer'
import { TaskSelector, Task } from './utils/taskselector'
import { RecordUploader } from './records/recorduploader'
import { RecordCreator } from './records/recordcreator'
import { Templates } from './planing/templates'
import { Planing } from './planing/planing'
import { PatternPlaning} from './planing/patternplaning'
import { Assign } from './assign/assign'
import { Categories } from './check/categories'
import { OverviewGFX } from './stats/overviewgfx'
import { OverviewTab } from './stats/overviewtab'
import { CategoriesConfig } from './configuration/categoriesconfig'
import { MessageID } from './utils/messageid';
import { label } from './utils/misc';

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


export class TabbedPages extends React.Component<TabbedPagesProps, IState> {

    footer: React.RefObject<Footer|null> = React.createRef();
    pages: Page[] = [];
    headerpages: HeaderPage[] = [];

    constructor( props: TabbedPagesProps) {
        super( props );
        this.state = { curpage: props.page };
        this.setPage = this.setPage.bind( this );
        this.sendMessage = this.sendMessage.bind( this );
        this.createPages();
        this.createHeaderData();
    }  
    

    sendMessage( msg: string, error: MessageID ): void {
        this.footer.current?.setmessage( msg, error );
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
            title: label("page.plan"), tasks:
                [
                    { name: label("task.template"), comp: ( <Templates sendmessage={this.sendMessage} /> ) },
                    { name: label("task.plan"), comp: ( <Planing sendmessage={this.sendMessage} /> ) },
                    { name: label("task.pattern"), comp: ( <PatternPlaning sendmessage={this.sendMessage} /> ) },
                ]
        },
        {
            title: label("page.accountRecords"), tasks:
                [
                    { name: label("task.upload"), comp: ( <RecordUploader sendmessage={this.sendMessage} /> ) },
                    { name: label("task.create"), comp: ( <RecordCreator sendmessage={this.sendMessage} /> ) }
                ]
        },
        {
            title: label("page.assign"), tasks:
                [
                    { name: label("task.recordlist"), comp: ( <Assign sendmessage={this.sendMessage} /> ) },
                ]
        },
        {
            title: label("page.check"), tasks:
                [
                    { name: label("task.categories"), comp: ( <Categories sendmessage={this.sendMessage} /> ) },
                ]
        },
        {
            title: label("page.overview"), tasks: 
                [
                    { name: label("task.graph"), comp: ( <OverviewGFX /> ) },
                    { name: label("task.table"), comp: ( <OverviewTab /> ) }
                ]
        },
        {
            title: label("page.configuration"), tasks: 
                [
                    { name: label("task.catconfig"), comp: ( <CategoriesConfig sendmessage={this.sendMessage} /> ) },
                ]
        }
    ];
    }

    renderPage (page: Page,index:number): React.JSX.Element {
        return ( <TaskSelector tasks={page.tasks} pageindex={index} currenttask={0} /> );
    }

    render(): React.JSX.Element {
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
                <Footer ref={this.footer} />
              </div>
        )
    }
}
