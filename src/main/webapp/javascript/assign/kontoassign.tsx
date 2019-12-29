import * as React from 'react'
import { KontenSelector } from '../utils/kontenselector'


type HandleAssignCallback = ( konto: number, text: string ) => void;

export interface KontoAssignProps {
    handleAssign: HandleAssignCallback;
    text: string;
    group?: number;
    konto?: number;
}


export class KontoAssign extends React.Component<KontoAssignProps, {}> {

    kontoselector: React.RefObject<KontenSelector>;
    comment: React.RefObject<HTMLInputElement>;

    constructor( props: KontoAssignProps ) {
        super( props );
        this.state = {};
        this.kontoselector = React.createRef();
        this.comment = React.createRef();
        this.assign = this.assign.bind( this );
        this.cancel = this.cancel.bind( this );
    }

    assign() :void {
        this.props.handleAssign( this.kontoselector.current.getKonto(), this.comment.current.value );
    }
    
    cancel() : void {
        this.props.handleAssign( undefined, this.comment.current.value );        
    }

    render() {
        return (
            <div style={{
                position: 'fixed',
                zIndex: 1,
                left: '0', top: '0', width: '100%', height: '100%'
            }}>
                <div style={{
                    margin: '15% auto',
                    padding: '20px',
                    border: '1px solid #888',
                    width: '300px', height: '180px',
                    background: 'darkgray'
                }}>
                    <div>Zuweisen auf Konto </div>
                    <div>
                        <KontenSelector
                            group={this.props.group}
                            konto={this.props.konto}
                            ref={this.kontoselector}
                            horiz={true}
                        />
                    </div>
                    <div><input type='text' defaultValue={this.props.text} ref={this.comment} /></div>
                    <div><button onClick={this.assign}>Zuweisen</button>
                        <button onClick={this.cancel}>Abbrechen</button>
                    </div>
                </div>
            </div>
        );
    }

}