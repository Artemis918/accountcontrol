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
    tasksname: string;
}

export class TaskSelector extends React.Component<TaskSelectorProps,IState> {

    constructor( props: TaskSelectorProps ) {
        super( props );
        this.state = { currenttask: this.props.currenttask, tasksname: this.props.tasksname };
        this.selectTask = this.selectTask.bind( this );
    }

    static getDerivedStateFromProps(nextprops: TaskSelectorProps, prevstate: IState) : Partial<IState>{
        if (nextprops.tasksname !== prevstate.tasksname)
            return ( {currenttask: nextprops.currenttask, tasksname: nextprops.tasksname})
        else 
            return {};
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