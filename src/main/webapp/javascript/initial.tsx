import * as React from 'react';
import * as css from './css/initial.css'

type ChangeValue = ( index: number ) => void;

interface InitialProps {
    changeValue: ChangeValue;
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
                        <td> <button className={css.ksbutton} onClick={() => this.props.changeValue( 1 )}> Planen </button>  </td>
                        <td> <button className={css.ksbutton} onClick={() => this.props.changeValue( 2 )}> Belege </button>  </td>
                        <td> <button className={css.ksbutton} onClick={() => this.props.changeValue( 3 )}> Buchen </button>  </td>
                    </tr>
                    <tr>
                        <td> <button className={css.ksbutton} onClick={() => this.props.changeValue( 4 )}> Konten </button>  </td>
                        <td> <button className={css.ksbutton} onClick={() => this.props.changeValue( 5 )}> Übersicht </button>  </td>
                        <td> <button className={css.ksbutton} onClick={() => this.props.changeValue( 6 )}> Stammdaten </button> </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}