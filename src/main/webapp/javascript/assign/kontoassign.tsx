import * as React from 'react'
import { CategorySelector } from '../utils/categoryselector'


type HandleAssignCallback = ( subCategory: number, text: string ) => void;

export interface KontoAssignProps {
    handleAssign: HandleAssignCallback;
    text: string;
    category?: number;
    subcategory?: number;
}


export class KontoAssign extends React.Component<KontoAssignProps, {}> {

    categoryselector: React.RefObject<CategorySelector>;
    comment: React.RefObject<HTMLInputElement>;

    constructor( props: KontoAssignProps ) {
        super( props );
        this.state = {};
        this.categoryselector = React.createRef();
        this.comment = React.createRef();
        this.assign = this.assign.bind( this );
        this.cancel = this.cancel.bind( this );
    }

    assign() :void {
        this.props.handleAssign( this.categoryselector.current.getSubCategory(), this.comment.current.value );
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
                        <CategorySelector
                            category={this.props.category}
                            subcategory={this.props.subcategory}
                            ref={this.categoryselector}
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