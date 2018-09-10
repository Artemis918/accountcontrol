import ReactDOM from 'react-dom';
import React from 'react';
import InitialPage from 'initial.jsx'
import Header from 'header.jsx'
import BuchungsBelege from 'buchungsbelege.jsx'

import 'index.css'



class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: 0};
        this.changeValue = this.changeValue.bind(this);
      }
    
    changeValue(val) {
        this.setState({value: val});
    }
    
    render() {
        if (this.state.value == 0)
            return ( <InitialPage changeValue = {this.changeValue}/> );
        else
            return ( <div> 
                     <Header changeValue = {this.changeValue} value = {this.state.value} title="Buchungsbelege"/>
                     <BuchungsBelege />
                     </div>
                   );
    }

}


ReactDOM.render(<Main/>,document.getElementById('react'));