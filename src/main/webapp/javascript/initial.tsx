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
                        <td> <button className={css.ksbutton} onClick={() => this.props.changeValue( 0 )}> Planen </button>  </td>
                        <td> <button className={css.ksbutton} onClick={() => this.props.changeValue( 1 )}> Belege </button>  </td>
                        <td> <button className={css.ksbutton} onClick={() => this.props.changeValue( 2 )}> Buchen </button>  </td>
                    </tr>
                    <tr>
                        <td> <button className={css.ksbutton} onClick={() => this.props.changeValue( 3 )}> Konten </button>  </td>
                        <td> <button className={css.ksbutton} onClick={() => this.props.changeValue( 4 )}> Übersicht </button>  </td>
                        <td> <button className={css.ksbutton} onClick={() => this.props.changeValue( 5 )}> Stammdaten </button> </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}