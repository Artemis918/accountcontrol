import React from 'react';
import { FormattedMessage, IntlShape } from 'react-intl';
import { InfoBox } from './utils/infobox';
import { MessageID } from './utils/messageid';

interface FooterProps {
	intl: IntlShape;
};

interface CState {
    message: string;
    errorcode: MessageID;
};


export class Footer extends React.PureComponent<FooterProps, CState> {

  private infobox: InfoBox

  constructor(p: any) {
    super(p);
	this.state = { message:"", errorcode: MessageID.OK }
    this.setmessage = this.setmessage.bind(this);
  }

  setmessage(m: string, e: MessageID) : void {
	  var msg: string = m;
	  if (!m) {
  		  msg = this.props.intl.formatMessage({id: "returncode_" + e})
	  }
      this.infobox.setInfo( {info: [
	     msg,
	     `Errorcode: ${e}`
      ]});
  }
  
  getLabel() : JSX.Element {
      if ( this.state.errorcode == MessageID.OK ) {
          return ( <FormattedMessage id="footer.state" defaultMessage="state" />)
      }
      else {
          return ( <FormattedMessage  defaultMessage="!! ERROR !!" id="footer.error" /> );
      }
                  
  }
  
  render():JSX.Element {
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