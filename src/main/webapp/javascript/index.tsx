import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { InitialPage } from './initial'
import { Header } from './header'
import { TaskSelector, Tabulator } from './utils/taskselector'
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
    render: renderMethod;
}

class Main extends React.Component<{}, IState> {

    footer: Footer;
    pages: Page[] = [
        { title: "Planen", render: this.renderPlaning },
        { title: "Buchungsbelege", render: this.renderBelege },
        { title: "Buchen", render: this.renderBuchen },
        { title: "Konten Kontrolle", render: this.renderKontrolle },
        { title: "Übersicht", render: this.renderOverview }
    ];

    constructor( props: any ) {
        super( props );
        this.state = { value: -1, production: false };
        this.footer = undefined;
        this.changeValue = this.changeValue.bind( this );
        this.sendMessage = this.sendMessage.bind( this );
    }

    componentDidMount() {
        var self = this;
        fetch( "collections/production" )
            .then( ( response: Response ) => response.json() )
            .then( ( json ) => { self.setState( { production: json.production } ) } )
    }
    changeValue( val: number ): void {
        this.setState( { value: val } );
    }

    sendMessage( msg: string, error: boolean ): void {
        this.footer.setmessage( msg, error );
    }

    renderPlaning(): JSX.Element {
        var tasks = [
            { name: 'Vorlagen', comp: ( <Templates sendmessage={this.sendMessage} /> ) },
            { name: 'Planen', comp: ( <Planen sendmessage={this.sendMessage} /> ) },
            { name: 'Muster', comp: ( <PatternPlanen sendmessage={this.sendMessage} /> ) },
        ];
        return ( <TaskSelector tasks={tasks} currenttask={0} tasksname='planen' /> );
    }

    renderBelege(): JSX.Element {
        var tasks: Tabulator[] = [
            { name: 'Laden', comp: ( <BelegUploader sendmessage={this.sendMessage} /> ) },
            { name: 'Erfassen', comp: ( <BelegErfassung sendmessage={this.sendMessage} /> ) }
        ];
        return ( <TaskSelector tasks={tasks} currenttask={0} tasksname='belege'/> );
    }

    renderBuchen(): JSX.Element {
        return ( <Buchen sendmessage={this.sendMessage} /> );
    }

    renderKontrolle(): JSX.Element {
        return ( <Konten sendmessage={this.sendMessage} /> );
    }

    renderOverview(): JSX.Element {
        var tasks: Tabulator[] = [
            { name: 'Grafisch', comp: ( <OverviewGFX /> ) },
            { name: 'Tabelle', comp: ( <div /> ) }
        ];
        return ( <TaskSelector tasks={tasks} currenttask={0} tasksname='belege'/> );
    }

    render(): JSX.Element {
        var cname: string = this.state.production ? css.production : css.testing;
        var index = this.state.value;
        if ( this.pages[index] == undefined  ) {
            return ( <div className={cname}>
                <InitialPage changeValue={this.changeValue} />
                <Footer ref={( refFooter ) => { this.footer = refFooter; }} />
            </div> );
        }
        else {
            return (
                <div className={cname}>
                    <Header changeValue={this.changeValue} value={index} title={this.pages[index].title} />
                    {this.pages[index].render()}
                    <Footer ref={( refFooter ) => { this.footer = refFooter; }} />
                </div>
            )
        }
    }
}

ReactDOM.render( ( <Main />), document.getElementById( 'react' ) );
