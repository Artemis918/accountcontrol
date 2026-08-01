import React from 'react'
import { IntlShape } from 'react-intl'

import { Pattern } from '../utils/dtos'
import css from '../css/index.css'

type SendPatternCallback = (pattern: Pattern) => void

interface PatternEditorProps {
    pattern: Pattern;
    sendPattern: SendPatternCallback;
    intl: IntlShape;
    zIndex: number;
}

interface IState {
    details?: string;
    mandate?: string;
    receiver?: string;
    referenceID?: string;
    sender?: string;
    submitter?: string;
}

export class PatternEditor extends React.Component<PatternEditorProps, IState> {

    constructor(props: PatternEditorProps) {
        super(props);
        this.state = {
            details: this.props.pattern.details,
            mandate: this.props.pattern.mandate,
            receiver: this.props.pattern.receiver,
            referenceID: this.props.pattern.referenceID,
            sender: this.props.pattern.sender,
            submitter: this.props.pattern.senderID
        }
        this.sendPattern = this.sendPattern.bind(this);
    }

    label(labelid: string): string { return this.props.intl.formatMessage({ id: labelid }) }

    sendPattern(): void {
        if (this.state.details != this.props.pattern.details
            || this.state.mandate != this.props.pattern.mandate
            || this.state.receiver != this.props.pattern.receiver
            || this.state.referenceID != this.props.pattern.referenceID
            || this.state.sender != this.props.pattern.sender
            || this.state.submitter != this.props.pattern.senderID
        ) {
            var p: Pattern = new Pattern();
            p.details = this.state.details;
            p.mandate = this.state.mandate;
            p.receiver = this.state.receiver;
            p.referenceID = this.state.referenceID;
            p.sender = this.state.sender;
            p.senderID = this.state.submitter;
            this.props.sendPattern(p);
        }
        else {
            this.props.sendPattern(undefined);
            console.log('paatern not send');
        }
    }

    getState(stateKey: string): string {
        var key: keyof IState = stateKey as keyof IState;
        return this.state[key];
    }

    changeState(stateKey: string, newValue: string): void {
        var key: keyof IState = stateKey as keyof IState;
        this.setState({ [key]: newValue });
    }

    renderInput(patid: string): React.JSX.Element {
        return <tr>
            <td> {this.label(patid)}</td>
            <td>
                <input className={css.stringinput}
                    value={this.getState(patid)}
                    type='text'
                    onChange={(e) => { this.changeState(patid, e.target.value) }}
                />
            </td>
        </tr>;
    }

    render(): React.JSX.Element {
        return (
            <div style={{
                position: 'fixed',
                zIndex: this.props.zIndex,
                left: '0', top: '0', width: '100%', height: '100%'
            }}>
                <div testdata-id={'pattern.editor'}
                    style={{
                        margin: '15% auto',
                        padding: '20px',
                        border: '1px solid #888',
                        width: '300px', height: '220px',
                        background: 'darkgray'
                    }}>
                    <table>
                        <tbody>
                            {this.renderInput('sender')}
                            {this.renderInput('receiver')}
                            {this.renderInput('referenceID')}
                            {this.renderInput('mandate')}
                            {this.renderInput('submitter')}
                            {this.renderInput('details')}
                        </tbody>
                    </table>
                    <div style={{ alignContent: 'center', width: '100%' }} >
                        <button style={{ width: '100%' }}
                            className={css.addonbutton}
                            onClick={() => this.sendPattern()}
                            testdata-id={'pattern.ok'}> OK</button>
                    </div>
                </div>
            </div>
        );
    }
}