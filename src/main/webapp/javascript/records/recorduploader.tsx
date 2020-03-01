import * as React from 'react'
import * as Dropzone from 'react-dropzone'
import {useIntl, WrappedComponentProps} from 'react-intl'
import * as axios from 'axios'
import css from '../css/index.css'

import { SendMessage } from '../utils/messageid'


type Create = (props:RecordUploaderProps) => JSX.Element;
export const RecordUploader:Create = (p) => {return (<_RecordUploader {...p} intl={useIntl()}/>);}

interface RecordUploaderProps {
    sendmessage: SendMessage;
}

interface IState {
    accepted: File[];
    fileok: string[];
    fileerr: string[];
}

class _RecordUploader extends React.Component<RecordUploaderProps & WrappedComponentProps, IState> {

    constructor( props: RecordUploaderProps & WrappedComponentProps) {
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

	label(labelid:string):string {return this.props.intl.formatMessage({id: labelid}) }

    buttonClear(): void {
        this.setState( { accepted: [] } );
    }

    onDrop( accepted: File[], _rejected: File[], _event: React.DragEvent<HTMLElement> ): void {
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

    render(): JSX.Element {
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
								{this.label("records.filelist")}
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
                                <Dropzone.default accept="text/*" onDrop={this.onDrop} >
                                    {( { getRootProps, getInputProps, open } ) => (
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <p style={{textAlign: 'center'}}>{this.label("records.drophere")}</p>
                                            <button className={css.addonbutton} type="button" onClick={() => open()}>
                                                {this.label("records.opendialog")}
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
                                {this.label("records.upload")}
                            </button>
                            <button 
                                 className= {css.addonbutton} 
                                 onClick={( _e ) => this.buttonClear()}>
                                {this.label("reset")}
                            </button>

                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
