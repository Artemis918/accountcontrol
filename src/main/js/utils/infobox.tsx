import * as React from 'react';

export interface InfoBoxData {
    info: string[];
    label?: string;
    buttonlabel?:string;
    error?: boolean
    width?: number;
    height?:number;
}

interface InfoBoxState {
	showMe: boolean,
	data: InfoBoxData,
}


export class InfoBox extends React.Component<{}, InfoBoxState> {

    static defaultProps = {width: '250px', height: '180px'}
    
    constructor() {
        super( {} );
        close()
        this.state = {
			showMe: false,
			data: { info: ['']},
		};
    }

	public setInfo (data: InfoBoxData) {
		this.setState({showMe:true,data});
	}	
	
    close () : void {
        this.setState({
	        showMe: false, 
	        data: {
	          info: ['']
	        },
	     });
    }
    
    createLine(s: string, i:number): JSX.Element {
            return ( <p key={"info"+i} style={{ textAlign: 'center', fontSize: '15px' }} > {s} </p>)
    }

    render() {
		if (!this.state.showMe) {
			return null;
		}
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
                    {this.state.data.info.map(this.createLine)}
                    <div>
                        <button 
                            onClick={()=>this.close()} 
                            style={{ fontSize: '15px'}}>
                            {this.state.data.buttonlabel}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

}