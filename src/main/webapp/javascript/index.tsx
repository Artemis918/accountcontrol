import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl'
import { InitialPage } from './initial'
import TabbedPages from './tabbedPages'



import * as css from './css/index.css'

import messages_de from "./i18n/de.json";
import messages_en from "./i18n/en.json";

type renderMethod = () => JSX.Element;

interface IState {
    production: boolean;
    startpage: number;
}

const messages: { [key: string]: Record<string,string> } = {
    "de": messages_de,
    "en": messages_en
};

var curlocale:string = "en";

class Main extends React.Component<{}, IState> {
  
    constructor( props: any ) {
        super( props );
        this.state = { production: false, startpage: -1 };
        this.setPage = this.setPage.bind( this );
    }     

    componentDidMount() {
        var self = this;
        fetch( "production" )
            .then( ( response: Response ) => response.json() )
            .then( ( json ) => { self.setState( { production: json.production } ) } )
    }
    
    setPage( val: number ): void {
        this.setState( { startpage: val } );
    }
    
    changeLang(local:string) {
        
    }
    
    render(): JSX.Element {
        var cname: string = this.state.production ? css.production : css.testing;
        if ( this.state.startpage == -1 ) {
            return ( <div className={cname}>
                <InitialPage setPage={this.setPage} />
            </div> );
        }
        else {
            return (
                <div className={cname}>
                    <TabbedPages page={this.state.startpage} />
                </div>
            )
        }
    }
}

ReactDOM.render( 
        (<IntlProvider locale={curlocale} messages={messages[curlocale]} >
         <Main />
         </IntlProvider> )
        , document.getElementById( 'react' )
      );
