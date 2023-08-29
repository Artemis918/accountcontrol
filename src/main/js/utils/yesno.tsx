import React from 'react';

type Answer = ( answer: boolean ) => void;

export interface YesNoProps {
    answer: Answer;
    request: string[];
    yeslabel: string;
    nolabel:string;
    width?: number;
    height?:number;
}

export class YesNo extends React.Component<YesNoProps, {}> {

    static defaultProps = {width: '250px', height: '180px'}
    
    constructor( props: YesNoProps ) {
        super( props );
        this.state = {};
        this.answer = this.answer.bind( this );
    }

    answer(b:boolean) : void {
        this.props.answer( b );
    }
    
    createLine(s: string, i:number): JSX.Element {
            return ( <p key={"info"+i} style={{ textAlign: 'center', fontSize: '15px' }} > {s} </p>)
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
                    width: '250px', height: '180px',
                    background: 'darkgray',
                    fontSize: '15px'
                }}>
                    {this.props.request.map(this.createLine)}
                    <div><button onClick={()=>this.answer(true)} style={{ fontSize: '15px'}}>{this.props.yeslabel}</button>
                        <button onClick={()=>this.answer(false)} style={{ fontSize: '15px'}}>{this.props.nolabel}</button>
                    </div>
                </div>
            </div>
        );
    }

}