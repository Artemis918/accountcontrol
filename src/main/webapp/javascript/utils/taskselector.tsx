import * as React from 'react'

export interface Tabulator {
    name: string;
    comp: JSX.Element;
}

interface TaskSelectorProps {
    tasks: Tabulator[];
    currenttask: number;
    tasksname: string
}

interface IState {
    currenttask: number;
}

export class TaskSelector extends React.Component<TaskSelectorProps,IState> {

    constructor( props: TaskSelectorProps ) {
        super( props );
        this.state = { currenttask: this.props.currenttask};
        this.selectTask = this.selectTask.bind( this );
    }

    componentDidUpdate(prevProps :TaskSelectorProps) :void {
         if (this.props.tasksname !== prevProps.tasksname) {
             this.selectTask ( this.props.currenttask );
         }
    }
    
    selectTask( i: number ): void {
        this.setState( { currenttask: i } )
    }

    render() : JSX.Element { 
        return (
            <div>
                <div style={{ height: '30px', verticalAlign: 'bottom' }}>
                    {this.props.tasks.map( ( t, i ) =>
                        <button className='tabButton'
                            key={"tabBut_" + t.name}
                            onClick={( e ) => this.selectTask( i )}
                            style={{ background: this.state.currenttask == i ? 'white' : null }} > {t.name}
                        </button>
                    )}
                </div>
                <div>
                    {this.props.tasks[this.state.currenttask].comp}
                </div>
            </div>
        )
    }
}