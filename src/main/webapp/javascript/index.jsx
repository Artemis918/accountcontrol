import ReactDOM from 'react-dom';
import React from 'react';
import InitialPage from 'initial.jsx'
import Header from 'header.jsx'
import TaskSelector from 'taskselector.jsx'
import Buchungsbelege from 'buchungsbelege.jsx'
import Templates from 'templates.jsx'
import Planen from 'planen.jsx'
import Buchen from 'buchen.jsx'

import 'index.css'



class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: 0 };
        this.changeValue = this.changeValue.bind(this);
    }

    changeValue(val) {
        this.setState({ value: val });
    }


    render() {
        if (this.state.value == 2) {
            var tasks = [
                { name: 'Laden', comp: (<Buchungsbelege sendmessage= {this.sendMessage }/>) },
            ];
            return (<div>
                <Header changeValue={this.changeValue} value={this.state.value} title="Buchungsbelege" />
                <TaskSelector tasks={tasks} />
            </div>
            );
        }
        else if (this.state.value == 3) {
            return (<div>
                <Header changeValue={this.changeValue} value={this.state.value} title="Buchen" />
                <Buchen />
            </div>
            );
        }
        else if (this.state.value == 1) {
            var tasks = [
                { name: 'Vorlagen', comp: (<Templates sendmessage={this.sendMessage }/>) },
                { name: 'Planen', comp: (<Planen sendmessage={this.sendMessage }/>) },
            ];
            return (<div>
                <Header changeValue={this.changeValue} value={this.state.value} title="Planen" />
                <TaskSelector tasks={tasks} />
            </div>
            );
        }
        else {
            return (<InitialPage changeValue={this.changeValue} />);
        }

    }
}

ReactDOM.render(<Main />, document.getElementById('react'));
