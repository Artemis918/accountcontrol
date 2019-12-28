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
    locale: string;
}

const messages: { [key: string]: Record<string,string> } = {
    "de": messages_de,
    "en": messages_en
};

class Main extends React.Component<{}, IState> {
  
    constructor( props: any ) {
        super( props );
        this.state = { production: false, startpage: -1,  locale: "de" };
        this.setPage = this.setPage.bind( this );
        this.setLang = this.setLang.bind( this );
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

    setLang(event: React.ChangeEvent<HTMLSelectElement> ): void {
        this.setState( { locale: event.target.value } );
    }
    
    createLangSelector(): JSX.Element {
        return (
                <div style={{textAlign: "right"}}> 
                    <select value={this.state.locale} onChange={this.setLang} className={css.langselector} >
                       <option key="en" value="en"> en </option>
                       <option key="de" value="de"> de </option>
                     </select>
                </div>
        )
    }

    render():JSX.Element {
        return (<IntlProvider locale={this.state.locale} messages={messages[this.state.locale]} >
                   {this.renderContent()}
                </IntlProvider>
               )
    }
    
    renderContent(): JSX.Element {
        var cname: string = this.state.production ? css.production : css.testing;
        if ( this.state.startpage == -1 ) {
            return ( <div className={cname}>
                       <InitialPage setPage={this.setPage} />
                       {this.createLangSelector()}
                    </div> );
        }
        else {
            return (
                <div className={cname}>
                    <TabbedPages page={this.state.startpage} />
                    {this.createLangSelector()}
                </div>
            )
        }
    }
}

ReactDOM.render( <Main /> , document.getElementById( 'react' )  );
