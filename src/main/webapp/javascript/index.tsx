import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { InitialPage } from './initial'
import { Header } from './header'
import { TaskSelector, Tabulator } from './utils/taskselector'
import { BuchungsBelege }from './buchungsbelege'
import { Templates } from './templates'
import { Planen } from './planen'
import { Buchen } from './buchen'
import { Konten } from './konten'
import { Footer } from './footer'

import * as css from './css/index.css' 

interface IState {
    value: number;
}

class Main extends React.Component<{},IState> {
    
    footer: Footer;

    constructor( ) {
        super( {} );
        this.state = { value: 0 };
        this.footer = undefined;
        this.changeValue = this.changeValue.bind( this );
        this.sendMessage = this.sendMessage.bind( this );
    }

    changeValue( val:number ): void {
        this.setState( { value: val } );
    }

    sendMessage( msg:string , error :boolean ) :void {
        this.footer.setmessage( msg, error );
    }

    render(): JSX.Element {
        if ( this.state.value == 2 ) {
            var tasks :Tabulator[] = [
                { name: 'Laden', comp: ( <BuchungsBelege sendmessage={this.sendMessage} /> ) },
            ];
            return ( <div>
                <Header changeValue={this.changeValue} value={this.state.value} title="Buchungsbelege" />
                <TaskSelector tasks={tasks} currenttask={0} tasksname='belege'/>
                <Footer ref={( refFooter ) => { this.footer = refFooter; }} />
            </div>
            );
        }
        else if ( this.state.value == 3 ) {
            return ( <div>
                <Header changeValue={this.changeValue} value={this.state.value} title="Buchen" />
                <Buchen sendmessage={( m, e ) => this.sendMessage( m, e )} />
                <Footer ref={( refFooter ) => { this.footer = refFooter; }} />
            </div>
            );
        }
        else if ( this.state.value == 4 ) {
            return ( <div>
                <Header changeValue={this.changeValue} value={this.state.value} title="Kontenübersicht" />
                <Konten sendmessage={this.sendMessage} />
                <Footer ref={( refFooter ) => { this.footer = refFooter; }} />
            </div>
            );
        }
        else if ( this.state.value == 1 ) {
            var tasks = [
                { name: 'Vorlagen', comp: ( <Templates sendmessage={this.sendMessage} /> ) },
                { name: 'Planen', comp: ( <Planen sendmessage={this.sendMessage} /> ) },
            ];
            return ( <div>
                <Header changeValue={this.changeValue} value={this.state.value} title="Planen" />
                <TaskSelector tasks={tasks} currenttask={0} tasksname='planen'/>
                <Footer ref={( refFooter ) => { this.footer = refFooter; }} />
            </div>
            );
        }
        else {
            return ( <div>
                <InitialPage changeValue={this.changeValue} />
                <Footer ref={( refFooter ) => { this.footer = refFooter; }} />
            </div> );
        }


    }
}

ReactDOM.render( (<div className={css.body}> <Main /></div>), document.getElementById( 'react' ) );
