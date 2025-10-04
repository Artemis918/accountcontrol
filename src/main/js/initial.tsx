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
            <td className={css.buttonfield}>
                <button testdata-id={id} className={css.acbutton} onClick={() => this.props.setPage(idx)}>
                    <FormattedMessage id={"page." + id} defaultMessage={id} />
                </button>
            </td>
        );
    }


    render(): React.JSX.Element {
        return (
            <div>
                <div className={css.title}> <FormattedMessage id={"page.welcome"} defaultMessage={'Welcome to'} />&nbsp; AccountControl </div>
                <table className={css.maintable}>
                    <tbody>
                        <tr>
                            {this.renderButton(0, 'plan')}
                            {this.renderButton(1, 'accountRecords')}
                            {this.renderButton(2, 'assign')}
                        </tr>
                        <tr>
                            {this.renderButton(3, 'check')}
                            {this.renderButton(4, 'overview')}
                            {this.renderButton(5, 'configuration')}
                        </tr>
                    </tbody>
                </table>
            </div >
        );
    }
}    
