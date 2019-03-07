import * as React from 'react'
import * as css from './css/taskselector.css'

export interface Task {
    name: string;
    comp: JSX.Element;
}

interface TaskSelectorProps {
    tasks: Task[];
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
                <div className={css.tsline}>
                    {this.props.tasks.map( ( t, i ) =>
                        <button className={ this.state.currenttask == i ? css.tsbuttonselected : css.tsbutton } 
                            key={"tabBut_" + t.name}
                            onClick={( e ) => this.selectTask( i )} > {t.name}
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