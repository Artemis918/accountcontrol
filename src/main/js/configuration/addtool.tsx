import React from 'react'
import { FormattedMessage } from 'react-intl';

type SaveData = ( short: string, descripition:string ) => void;

export interface AddToolProps {
    save: SaveData;
    createlabel: string;
    cancellabel:string
    category?: string;
}


export class AddTool extends React.Component<AddToolProps, {}> {

    short: React.RefObject<HTMLInputElement>;
    description: React.RefObject<HTMLInputElement>;

    constructor( props: AddToolProps ) {
        super( props );
        this.state = {};
        this.short = React.createRef();
        this.description = React.createRef();
        this.createcat = this.createcat.bind( this );
        this.cancel = this.cancel.bind( this );
    }

    createcat() :void {
        this.props.save( this.short.current.value, this.description.current.value );
    }
    
    cancel() : void {
        this.props.save( undefined, undefined );
    }
    
    createTitle(): JSX.Element {
        if (this.props.category == undefined ) {
            return ( <p style={{ textAlign: 'center' }} ><FormattedMessage id="category.createcat" /> </p>)
        }
        else return ( <div style={{ textAlign: 'center' }}>
                    <FormattedMessage id="category.createsub"/>
                    <p> {this.props.category} </p>
                </div>
        );
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
                    width: '250px', height: '160px',
                    background: 'darkgray',
                    fontSize: '15px'
                }}>
                    {this.createTitle()}
                    <FormattedMessage id='shortdescription'/>
                    <div><input type='text' ref={this.short} size={20} style={{ fontSize: '15px'}}/></div>                    
                    <FormattedMessage id='description'/>
                    <div><input type='text' ref={this.description} size={20} style={{ fontSize: '15px'}}/></div>
                    <div style={{marginTop: '10px'}}><button onClick={this.createcat} style={{ width: '47%', fontSize: '15px'}}>{this.props.createlabel}</button>
                        <button onClick={this.cancel} style={{width: '47%', fontSize: '15px'}}>{this.props.cancellabel}</button>
                    </div>
                </div>
            </div>
        );
    }

}