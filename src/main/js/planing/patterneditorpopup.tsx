import React from 'react'
import { label } from '../utils/misc'
import { PatternEditor, SendPatternCallback } from './patterneditor'
import { Pattern } from '../utils/dtos'
import * as css from '../css/index.css'


interface PatternEditorButtonProps {
    pattern: Pattern;
    sendPattern: SendPatternCallback;
    decorateButton: boolean;
    label: string;
    hidden?: boolean;
}

interface IState {
    open: boolean;
}

export class PatternEditorButton extends React.Component<PatternEditorButtonProps, IState> {

    constructor(props: PatternEditorButtonProps) {
        super(props);
        this.state = { open: false }
    }

    renderButton(): React.JSX.Element {
        return (<div>

            <button
                testdata-id="patterneditbutton"
                onClick={() => this.setState({ open: true })}
                className={css.addonbutton}
                hidden={this.props.hidden}>
                {this.props.label}</button>
            {
                this.state.open ?
                    <PatternEditor
                        zIndex={1}
                        pattern={this.props.pattern}
                        sendPattern={(e) => {
                            this.setState({ open: false })
                            this.props.sendPattern(e)
                        }}
                    />
                    : null
            }
        </div>);
    }

    render(): React.JSX.Element {
        if (this.props.decorateButton)
            return (
                <div className={css.boxborder} >
                    <div className={css.boxinnerpart} >
                        <label className={css.boxlabel} > {label("plan.pattern")}</label>
                        <br />
                        {this.renderButton()}
                    </div>
                </div >)
        else
            return this.renderButton();
    }
}