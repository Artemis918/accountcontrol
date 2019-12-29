import * as React from 'react'
import * as css from './css/taskselector.css'

export interface Task {
    name: string;
    comp: JSX.Element;
}

interface TaskSelectorProps {
    tasks: Task[];
    currenttask: number;
    pagename: string
}

interface IState {
    currenttask: number;
    pagename: string
}

export class TaskSelector extends React.Component<TaskSelectorProps,IState> {

    constructor( props: TaskSelectorProps ) {
        super( props );
        this.state = { currenttask: this.props.currenttask, pagename: this.props.pagename};
        this.selectTask = this.selectTask.bind( this );
    }

    static getDerivedStateFromProps(nextProps:TaskSelectorProps, prevState:IState): IState {
        if(nextProps.pagename !== prevState.pagename)
          return {currenttask: nextProps.currenttask, pagename: nextProps.pagename};
        else
          return null;
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