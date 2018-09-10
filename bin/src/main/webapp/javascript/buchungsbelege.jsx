import React from 'react'
import Dropzone from 'react-dropzone'
import axios from 'axios'


class Uploader extends React.Component {

    constructor() {
        super()
        this.uploadit = this.uploadit.bind(this);
        this.buttonClear = this.buttonClear.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.uploadit = this.uploadit.bind(this);
        this.loadOK = this.loadOK.bind(this);
        this.loadError = this.loadError.bind(this);
        this.state = {
            accepted: [],
            fileok: [],
            fileerr: []
        }
    }

    buttonClear() {
        this.setState({ accepted: [] });
    }

    onDrop(accepted) {
        this.setState({ accepted: this.state.accepted.concat(accepted) });
    }

    loadOK(response) {
        if (response.data.status==1)
            this.setState({ fileok: this.state.fileok.concat(response.data.message) });
        else
            this.setState({ fileerr: this.state.fileerr.concat(response.data.message) });
    }

    loadError(error) {
        this.setState({ fileerr: this.state.fileerr.concat(error.response) });
    }


    uploadit() {
        this.state.accepted.forEach(file => {

            const data = new FormData();
            data.append('file', file);

            axios.post('/upload', data)
                .then(this.loadOK)
                .catch(this.loadError)
        });
    }

    render() {
        return (
            <section>
                <div className="dropzone">
                    <Dropzone
                        accept="text/*"
                        onDrop={this.onDrop}
                    >
                        <ul>
                            {
                                this.state.accepted.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                            }
                        </ul>
                    </Dropzone>
                </div>
                <ul>
                    {
                        this.state.fileerr.map(f => <li> fail: {f} </li>)
                    }
                    {
                        this.state.fileok.map(f => <li> ok: {f} </li>)
                    }
                </ul>
                <aside>
                    <button className="button" onClick={(e) => this.buttonClear()}> Clear </button>
                    <button className="button" onClick={(e) => this.uploadit()}> Upload </button>
                </aside>
            </section>
        );
    }
}



export default class Header extends React.Component {
    render() {
        return (<div> <table width='100%' > <tr> <td></td><td> <Uploader /> </td> </tr> </table> </div>);
    }
}