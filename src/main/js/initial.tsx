import React from 'react';
import { FormattedMessage } from 'react-intl';

import css from './css/initial.css';

type SetPage = ( page: number ) => void;

interface InitialProps {
    setPage: SetPage;
}

export class InitialPage extends React.Component<InitialProps, {}> {

    constructor( props: InitialProps ) {
        super( props );
    }
    
    render(): JSX.Element {
        return (
            <table className={css.maintable}>
                <tbody>
                    <tr>
                        <td> 
                            <button className={css.acbutton} onClick={() => this.props.setPage( 0 )}> 
                              <FormattedMessage id="page.plan" defaultMessage="planing"/>
                            </button>
                        </td>
                        <td> 
                            <button className={css.acbutton} onClick={() => this.props.setPage( 1 )}> 
                              <FormattedMessage id="page.accountRecords" defaultMessage="accountRecords"/>
                            </button>
                        </td>
                        <td> 
                            <button className={css.acbutton} onClick={() => this.props.setPage( 2 )}> 
                                <FormattedMessage id="page.assign" defaultMessage="assign"/>
                            </button>  </td>
                    </tr>
                    <tr>
                        <td> 
                            <button className={css.acbutton} onClick={() => this.props.setPage( 3 )}> 
                                <FormattedMessage id="page.check" defaultMessage="check"/>
                            </button>
                        </td>
                        <td> 
                            <button className={css.acbutton} onClick={() => this.props.setPage( 4 )}> 
                                 <FormattedMessage id="page.overview" defaultMessage="overview"/>
                            </button>
                        </td>
                        <td> 
                            <button className={css.acbutton} onClick={() => this.props.setPage( 5 )}>
                                <FormattedMessage id="page.configuration" defaultMessage="configuration"/>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}