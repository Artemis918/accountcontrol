import * as React from 'react'

class CState {
    message: string = "";
    error: boolean = false;
};


export default class Footer extends React.PureComponent<any, CState> {

    readonly state = new CState();
    
  constructor() {
    super({});
    this.setmessage = this.setmessage.bind(this);
  }

  setmessage(m: string, e: boolean) {
      this.setState( {message: m, error: e });
  }  
    
  render() {
    return (
      <table>
            <tbody>
            <tr>
            <td>
            {this.state.message}
            </td>
            <td>
                copyright
            </td>
            </tr>
            </tbody>
      </table>
    );
  }
}