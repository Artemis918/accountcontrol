import * as React from 'react'
import { FormattedMessage } from 'react-intl'

class CState {
    message: string = "";
    error: boolean = false;
};


export class Footer extends React.PureComponent<any, CState> {

    readonly state = new CState();
    
  constructor(p: any) {
    super(p);
    this.setmessage = this.setmessage.bind(this);
  }

  setmessage(m: string, e: boolean) : void {
      this.setState( {message: m, error: e });
  }
  
  getLabel() : JSX.Element {
      if ( this.state.error ) {
          return ( <FormattedMessage  defaultMessage="!! ERROR !!" id="footer.error" /> );
      }
      else {
         return ( <FormattedMessage id="footer.state" defaultMessage="state" />)
      }
                  
  }
  
  render():JSX.Element {
    return (
      <div>
             <label>
                { this.getLabel() }  
             </label> : {this.state.message}
      </div>
    );
  }
}