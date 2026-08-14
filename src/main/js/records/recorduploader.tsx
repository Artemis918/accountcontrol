import React from 'react'
import * as Dropzone from 'react-dropzone'
import * as axios from 'axios'
import * as css from '../css/index.css'

import { SendMessage } from '../utils/messageid'
import { label } from '../utils/misc'


const accept: Dropzone.Accept = {
	'text/csv' : [],
	'text/xml' : [],
	'application/xml' : [],
	'text/plain' : []
}

interface RecordUploaderProps {
    sendmessage: SendMessage;
}

interface IState {
    accepted: File[];
    fileok: string[];
    fileerr: string[];
}

export class RecordUploader extends React.Component<RecordUploaderProps, IState> {

    constructor( props: RecordUploaderProps) {
        super( props );
        this.uploadit = this.uploadit.bind( this );
        this.buttonClear = this.buttonClear.bind( this );
        this.onDrop = this.onDrop.bind( this );
        this.uploadit = this.uploadit.bind( this );
        this.loadOK = this.loadOK.bind( this );
        this.loadError = this.loadError.bind( this );
        this.state = {
            accepted: [],
            fileok: [],
            fileerr: []
        }
    }

    buttonClear(): void {
        this.setState( { accepted: [] } );
    }

    onDrop( accepted: File[], _rejected: Dropzone.FileRejection[], _event: Dropzone.DropEvent ): void {
        this.setState( { accepted: this.state.accepted.concat( accepted ), fileok: [], fileerr: [] } );
    }

    loadOK( response: any ): void {
        var message: string = response.data.message;
        if ( response.data.status == 1 ) {
            var oklist: string[] = this.state.fileok;
            oklist.push( message )
            this.setState( { fileok: oklist } );
        }
        else {
            var errlist: string[] = this.state.fileerr;
            errlist.push( message )
            this.setState( { fileerr: errlist } );
        }
    }

    loadError( error: any ): void {
        var errlist: string[] = this.state.fileok;
        errlist.push( error.response )
        this.setState( { fileerr: errlist } );
    }

    uploadit(): void {
        this.state.accepted.forEach( file => {

            const data = new FormData();
            data.append( 'file', file );

            axios.default.post( 'upload', data )
                .then( this.loadOK )
                .catch( this.loadError )
        } );
        this.setState( { accepted: [] } )
    }

    render(): React.JSX.Element {
        return (
            <table>
                <colgroup>
                    <col style={{ width: '80%' }} />
                    <col style={{ width: '20%' }} />
                </colgroup>
                <tbody>
                    <tr>
                        <td>
                            <div style={{ textAlign: 'center' }}>
								{label("records.filelist")}
                                <ul style={{borderStyle: 'solid'}}>
                                    {
                                        this.state.accepted.map( f => <li key={f.name}>{f.name} - {f.size} bytes</li> )
                                    }
                                    {
                                        this.state.fileerr.map( f => <li> fail: {f} </li> )
                                    }
                                    {
                                        this.state.fileok.map( f => <li> ok: {f} </li> )
                                    }
                                <li> ... </li>
                                </ul>
                            </div>
                        </td>
                        <td>
                            <div className={css.dropzone}>
                                <Dropzone.default accept={accept} onDrop={this.onDrop} >
                                    {( { getRootProps, getInputProps, open } ) => (
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <p style={{textAlign: 'center'}}>{label("records.drophere")}</p>
                                            <button className={css.addonbutton} type="button" onClick={() => open()}>
                                                {label("records.opendialog")}
                                            </button>
                                        </div>
                                    )}
                                </Dropzone.default>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button 
                                 className= {css.addonbutton} 
                                 onClick={( _e ) => this.uploadit()}>
                                {label("records.upload")}
                            </button>
                            <button 
                                 className= {css.addonbutton} 
                                 onClick={( _e ) => this.buttonClear()}>
                                {label("reset")}
                            </button>

                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
