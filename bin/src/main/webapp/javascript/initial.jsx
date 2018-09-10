import React from 'react';
import 'initial.css'

class Button extends React.Component {
    constructor(props) {
        super(props);
        this.buttonClick = this.buttonClick.bind(this);
    }

    buttonClick() {
        this.props.changeValue(this.props.value);
    }

    render() {
        return (
            <div>
                <button className="ksbutton" onClick={this.buttonClick}> {this.props.name} </button>
            </div>
        );
    }
}

export default class InitialPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <table className='maintable'>
                    <tbody>
                        <tr>
                            <td> <Button name="Planen" className='maincell' changeValue={this.props.changeValue} value='1' /> </td>
                            <td> <Button name="Belege" className='maincell' changeValue={this.props.changeValue} value='2' /> </td>
                            <td> <Button name="Buchen" className='maincell' changeValue={this.props.changeValue} value='3' /> </td>
                        </tr>
                        <tr>
                            <td> <Button name="Konten" className='maincell' changeValue={this.props.changeValue} value='4' /> </td>
                            <td> <Button name="Ubersicht" className='maincell' changeValue={this.props.changeValue} value='5' /> </td>
                            <td> <Button name="Stammdaten" className='maincell' changeValue={this.props.changeValue} value='6' /> </td>
                        </tr>
                    </tbody>
                </table>


            </div>
        );
    }
}