import React from 'react'
import { label } from '../utils/misc'
import { PatternEditor, SendPatternCallback } from './patterneditor'
import { Pattern } from '../utils/dtos'
import * as css from '../css/index.css'


interface PatternEditorButtonProps {
    pattern: Pattern;
    sendPattern: SendPatternCallback;
}

interface IState {
    open: boolean;
}

export class PatternEditorButton extends React.Component<PatternEditorButtonProps, IState> {

    constructor(props: PatternEditorButtonProps) {
        super(props);
        this.state = { open: false }
    }

    render(): React.JSX.Element {
        return (
            <div className={css.boxborder} >
                <div className={css.boxinnerpart} >
                    <label className={css.boxlabel} > {label("plan.pattern")}</label>
                    <br />
                    <button
                        onClick={() => this.setState({ open: true })}
                        className={css.addonbutton}>
                        {label("plan.edit")}</button>
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
                </div>
            </div >)
    }
}