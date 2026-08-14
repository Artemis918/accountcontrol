import React from 'react';
import { InfoBox } from './utils/infobox';
import { MessageID } from './utils/messageid';
import { getIntl } from './utils/misc';
import { FormattedMessage } from 'react-intl';



interface CState {
    message: string;
    errorcode: MessageID;
};


export class Footer extends React.PureComponent<{}, CState> {

  private infobox: InfoBox | null = null; 

  constructor(p: any) {
    super(p);
	this.state = { message:"", errorcode: MessageID.OK }
    this.setmessage = this.setmessage.bind(this);
  }

  setmessage(m: string, e: MessageID) : void {
	  var msg: string = m;
	  if (!m) {
  		  msg =getIntl().formatMessage({id: "returncode_" + e})
	  }
      this.infobox?.setInfo( {info: [
	     msg,
	     `Errorcode: ${e}`
      ]});
  }
  
  getLabel() : React.JSX.Element {
      if ( this.state.errorcode == MessageID.OK ) {
          return ( <FormattedMessage id="footer.state" defaultMessage="state" />)
      }
      else {
          return ( <FormattedMessage  defaultMessage="!! ERROR !!" id="footer.error" /> );
      }
                  
  }
  
  render():React.JSX.Element {
    return (
      <div>
          <label>
              version: 0.2  
          </label>
          <InfoBox ref={(r)=> { this.infobox=r;}} />
      </div>

    );
  }
}