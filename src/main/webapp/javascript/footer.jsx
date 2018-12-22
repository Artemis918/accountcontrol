import React from 'react'

export default class Footer extends React.Component {

  constructor(props ) {
    super(props);
    this.state = {message: "", error: false};
    this.setmessage = this.setmessage.bind(this);
  }

  setmessage(message, error) {
      this.setState( {message: {message}, error: {error}});
  }  
    
  render() {
    return (
      <div>
            {message}
      </div>
    );
  }
}