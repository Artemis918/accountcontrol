import React from 'react'
import css from './css/taskselector.css'

export interface Task {
    name: string;
    comp: React.JSX.Element;
}

interface TaskSelectorProps {
    tasks: Task[];
    currenttask: number;
	pageindex: number
}

interface IState {
    currenttask: number;
	pageindex: number;
}

export class TaskSelector extends React.Component<TaskSelectorProps,IState> {

    constructor( props: TaskSelectorProps ) {
        super( props );
        this.state = { currenttask: this.props.currenttask, pageindex: this.props.pageindex};
        this.selectTask = this.selectTask.bind( this );
    }

    static getDerivedStateFromProps(nextProps:TaskSelectorProps, prevState:IState): IState {
        if(nextProps.pageindex !== prevState.pageindex)
          return {currenttask: nextProps.currenttask, pageindex: nextProps.pageindex};
        else
          return { currenttask: prevState.currenttask, pageindex: prevState.pageindex };
    }
    
    selectTask( i: number ): void {
        this.setState( { currenttask: i } )
    }

    render() : React.JSX.Element { 
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