import React from 'react'

export default class TaskSelector extends React.Component {

    constructor( props ) {
        super( props );
        this.state = { currentTask: 0 };
        this.selectTask = this.selectTask.bind( this );
    }

    selectTask( i ) {
        this.setState( { currentTask: i } )
    }

    render() {
        return (
            <div>
                <table>
                    <tbody>
                        <tr style={{ height: '30px', verticalAlign: 'bottom' }}>
                            {this.props.tasks.map(( t, i ) => <td style={{ width: '100px' }}>
                                <button className='tabButton'
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
            </div>
        )
    }
}