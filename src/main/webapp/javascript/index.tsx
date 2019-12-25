import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { IntlProvider } from 'react-intl'
import { InitialPage } from './initial'
import { Header } from './header'
import { TaskSelector, Task } from './utils/taskselector'
import { BelegUploader } from './belege/beleguploader'
import { BelegErfassung } from './belege/belegerfassung'
import { Templates } from './planing/templates'
import { Planen } from './planing/planen'
import { PatternPlanen } from './planing/patternplanen'
import { Buchen } from './buchen/buchen'
import { Konten } from './kontrolle/konten'
import { OverviewGFX } from './overviewgfx'
import { Footer } from './footer'

import * as css from './css/index.css'

type renderMethod = () => JSX.Element;


interface IState {
    value: number;
    production: boolean;
}

interface Page {
    title: string;
    tasks: Task[];
}

class Main extends React.Component<{}, IState> {

    
    footer: React.RefObject<Footer>;

    pages: Page[];

    constructor( props: any ) {
        super( props );
        this.state = { value: -1, production: false };
        this.footer = React.createRef();
        this.changeValue = this.changeValue.bind( this );
        this.sendMessage = this.sendMessage.bind( this );
        this.createPages();
    }
    
    createPages(): void { 
        this.pages = [
        {
            title: "Planen", tasks:
                [
                    { name: 'Vorlagen', comp: ( <Templates sendmessage={this.sendMessage} /> ) },
                    { name: 'Planen', comp: ( <Planen sendmessage={this.sendMessage} /> ) },
                    { name: 'Muster', comp: ( <PatternPlanen sendmessage={this.sendMessage} /> ) },
                ]
        },
        {
            title: "Buchungsbelege", tasks:
                [
                    { name: 'Laden', comp: ( <BelegUploader sendmessage={this.sendMessage} /> ) },
                    { name: 'Erfassen', comp: ( <BelegErfassung sendmessage={this.sendMessage} /> ) }
                ]
        },
        {
            title: "Buchen", tasks:
                [
                    { name: 'Belegliste', comp: ( <Buchen sendmessage={this.sendMessage} /> ) },
                ]
        },
        {
            title: "Konten Kontrolle", tasks:
                [
                    { name: 'Alle Konten', comp: ( <Konten sendmessage={this.sendMessage} /> ) },
                ]
        },
        {
            title: "Übersicht", tasks: [
                { name: 'Grafisch', comp: ( <OverviewGFX /> ) },
                { name: 'Tabelle', comp: ( <div /> ) }
            ]
        }
    ];
    }


    componentDidMount() {
        var self = this;
        fetch( "production" )
            .then( ( response: Response ) => response.json() )
            .then( ( json ) => { self.setState( { production: json.production } ) } )
    }
    changeValue( val: number ): void {
        this.setState( { value: val } );
    }

    sendMessage( msg: string, error: boolean ): void {
        this.footer.current.setmessage( msg, error );
    }

    renderPage (page: Page): JSX.Element {
        return ( <TaskSelector tasks={page.tasks} currenttask={0} tasksname={page.title} /> );
    }
    
    render(): JSX.Element {
        var cname: string = this.state.production ? css.production : css.testing;
        var index = this.state.value;
        if ( this.pages[index] == undefined ) {
            return ( <div className={cname}>
                <InitialPage changeValue={this.changeValue} />
                <Footer ref={this.footer} />
            </div> );
        }
        else {
            return (
                <div className={cname}>
                    <Header changeValue={this.changeValue} value={index} title={this.pages[index].title} />
                    {this.renderPage(this.pages[index])}
                    <Footer ref={this.footer} />
                </div>
            )
        }
    }
}

ReactDOM.render( 
        (<IntlProvider locale="de" >
         <Main />
         </IntlProvider> )
        , document.getElementById( 'react' )
      );
