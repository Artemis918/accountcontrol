import React from 'react'
import Footer from 'footer'

export default class TaskSelector extends React.Component {

    constructor( props ) {
        super( props );
        this.state = { currentTask: 0 };
        this.selectTask = this.selectTask.bind( this );
        this.sendMessage =  this.sendMessage.bind(this);
        this.footer=undefined;
    }

    selectTask( i ) {
        this.setState( { currentTask: i } )
    }
    
    sendMessage(msg) {
        footer.setmessage(msg);
    }

    render() {
        return (
            <div>
                <table>
                    <tbody>
                        <tr style={{ height: '30px', verticalAlign: 'bottom' }}>
                            {this.props.tasks.map(( t, i ) => <td style={{ width: '100px' }} key={"tab_" + t.name} >
                                <button className='tabButton' 
                                    key={"tabBut_" + t.name}
                                    onClick={( e ) => this.selectTask( i )}
                                    style={{ width: '90%', background: this.state.currentTask == i ? 'white' : null }} > {t.name}
                                </button>
                            </td>
                            )
                            }
                        </tr>
                    </tbody>

                </table>
                <div>
                    {this.props.tasks[this.state.currentTask].comp}
                </div>
                <Footer ref={( refFooter ) => { this.footer = refFooter; }} />
            </div>   
        )
    }
}