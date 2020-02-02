import * as React from 'react'
import { IntlShape } from 'react-intl'

import {Pattern} from '../utils/dtos'
import css from '../css/index.css'

type SendPatternCallback= (pattern: Pattern)=>void

interface PatternEditorProps {
    pattern: Pattern;
    sendPattern: SendPatternCallback;
	intl: IntlShape;
	zIndex: number;
}

interface IState {
    pattern: Pattern;
}

export class PatternEditor extends React.Component<PatternEditorProps,IState> {

    pattern: Pattern;
    
    constructor( props: PatternEditorProps ) {
        super( props );
        this.state = {pattern: props.pattern }
        this.pattern = props.pattern;
		this.setValue = this.setValue.bind(this);
		this.sendPattern = this.sendPattern.bind(this);
    }

	label(labelid:string):string {return this.props.intl.formatMessage({id: labelid}) }
    
    setValue( index :string, event :React.ChangeEvent<HTMLInputElement> ) :void {
        this.pattern[index] = event.target.value;
        this.setState( { pattern: this.state.pattern } );
    }

    sendPattern(): void {
        this.props.sendPattern( this.state.pattern );
    }

    render() : JSX.Element {
        return (
            <div style={{
                position: 'fixed',
                zIndex: this.props.zIndex,
                left: '0', top: '0', width: '100%', height: '100%'
            }}>
                <div style={{
                    margin: '15% auto',
                    padding: '20px',
                    border: '1px solid #888',
                    width: '300px', height: '220px',
                    background: 'darkgray'
                }}>
                    <table>
                        <tbody>
                        <tr> <td>{this.label("sender")}</td> 
                             <td> <input className={css.stringinput}
                                         value={this.state.pattern.sender} 
                                         type='text' 
                                         onChange={( e ) => this.setValue( 'sender', e )}  />
                            </td>
                        </tr>
                        <tr> <td>{this.label("receiver")}</td> 
                             <td> <input className={css.stringinput} 
                                         value={this.state.pattern.receiver} 
                                         type='text'
                                         onChange={( e ) => this.setValue( 'receiver', e )}  />
                            </td>
                        </tr>
                        <tr> <td>{this.label("refid")}</td>
                             <td> <input className={css.stringinput} 
                                         value={this.state.pattern.referenceID}
                                         type='text' 
                                         onChange={( e ) => this.setValue( 'referenceID', e )}  />
                             </td>
                        </tr>
                        <tr> <td>{this.label("mandate")}</td> 
                             <td> <input className={css.stringinput}
                                         value={this.state.pattern.mandate} 
                                         type='text' 
                                         onChange={( e ) => this.setValue( 'mandate', e )}  />
                             </td>
                        </tr>
                        <tr> <td>{this.label("submitter")}</td> 
                             <td> <input className={css.stringinput}
                                         value={this.state.pattern.senderID}
                                         type='text'
                                         onChange={( e ) => this.setValue( 'senderID', e )}  />
                             </td>
                         </tr>
                        <tr> <td>{this.label("details")} </td> 
                             <td> <input className={css.stringinput}
                                         value={this.state.pattern.details}
                                         type='text' 
                                         onChange={( e ) => this.setValue( 'details', e )}  />
                             </td>
                         </tr>
                        </tbody>
                    </table>
                    <div style={{alignContent: 'center' , width: '100%'}} >
                       <button style= {{width: '100%'}} className={css.addonbutton} onClick={() => this.sendPattern()}> OK</button>
					</div>
                </div>
            </div>
        );
    }
}