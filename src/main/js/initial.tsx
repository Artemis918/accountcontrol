import React from 'react';
import { FormattedMessage } from 'react-intl';

import css from './css/initial.css';

type SetPage = (page: number) => void;

interface InitialProps {
    setPage: SetPage;
}

export class InitialPage extends React.Component<InitialProps, {}> {

    constructor(props: InitialProps) {
        super(props);
    }

    renderButton(idx: number, id: string): React.JSX.Element {
        return (
            <button id={id} className={css.acbutton} onClick={() => this.props.setPage(idx)}>
                <FormattedMessage id={"page." + id} defaultMessage={id} />
            </button>
        );
    }


    render(): React.JSX.Element {
        return (
            <div>
                <div className={css.title}> <FormattedMessage id={"page.welcome"} defaultMessage={'Welcome to'} />&nbsp; AccountControl </div>
                <table className={css.maintable}>
                    <tbody>
                        <tr>
                            <td className={css.buttonfield}> {this.renderButton(0, 'plan')} </td>
                            <td className={css.buttonfield}> {this.renderButton(1, 'accountRecords')} </td>
                            <td className={css.buttonfield}> {this.renderButton(2, 'assign')} </td>
                        </tr>
                        <tr>
                            <td className={css.buttonfield}> {this.renderButton(3, 'check')} </td>
                            <td className={css.buttonfield}> {this.renderButton(4, 'overview')} </td>
                            <td className={css.buttonfield}> {this.renderButton(5, 'configuration')} </td>
                        </tr>
                    </tbody>
                </table>
            </div >
        );
    }
}    
