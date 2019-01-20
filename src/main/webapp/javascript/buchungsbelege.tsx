import * as React from 'react'
import * as Dropzone from 'react-dropzone'
import * as axios from 'axios'

interface IState {
    accepted: File[];
    fileok: string[];
    fileerr: string[];
}

interface BuchungsBelegeProps {
    
}

export class BuchungsBelege extends React.Component<BuchungsBelegeProps,IState> {
    
    constructor(props: BuchungsBelegeProps) {
        super(props);
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

    onDrop( accepted: File[], rejected: File[],event: React.DragEvent<HTMLElement> ) :void {
        this.setState( { accepted: this.state.accepted.concat(accepted), fileok: [], fileerr: [] } );
    }

    loadOK( response : any) :void {
        var message: string = response.data.message;
        if ( response.data.status == 1 ) {
            var oklist: string[] = this.state.fileok;
            oklist.push(message)
            this.setState( { fileok: oklist } );
        }
        else {
            var errlist: string[] = this.state.fileerr;
            errlist.push(message)
            this.setState( { fileerr: errlist } );
        }
    }

    loadError( error : any ):void {
        var errlist: string[] = this.state.fileok;
        errlist.push(error.response)
        this.setState( { fileerr: errlist } );
    }

    uploadit() :void {
        this.state.accepted.forEach( file => {

            const data = new FormData();
            data.append( 'file', file );

            axios.default.post( '/upload', data )
                .then( this.loadOK )
                .catch( this.loadError )
        } );
        this.setState( { accepted: [] } )
    }

    render() : JSX.Element{
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
                                    <ul>
                                        {
                                            this.state.accepted.map( f => <li key={f.name}>{f.name} - {f.size} bytes</li> )
                                        }
                                        {
                                            this.state.fileerr.map( f => <li> fail: {f} </li> )
                                        }
                                        {
                                            this.state.fileok.map( f => <li> ok: {f} </li> )
                                        }
                                    </ul>
                                </div>
                            </td>
                            <td>
                                <div className="dropzone">
                                    <Dropzone.default accept="text/*" onDrop={this.onDrop} >                                      
                                        {({getRootProps, getInputProps, open}) => (
                                                <div {...getRootProps()}>
                                                  <input {...getInputProps()} />
                                                    <p>Drop files here</p>
                                                    <button type="button" onClick={() => open()}>
                                                      Open File Dialog
                                                    </button>
                                                </div>
                                        )}
                                    </Dropzone.default>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button className="button" onClick={( e ) => this.buttonClear()}> Clear </button>
                                <button className="button" onClick={( e ) => this.uploadit()}> Upload </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
        );
    }
}
