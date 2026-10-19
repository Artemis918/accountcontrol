import React from 'react'
import { label } from '../utils/misc'
import { PatternEditor, SendPatternCallback } from './patterneditor'
import { Pattern } from '../utils/dtos'
import * as pcss from './css/planing.css'
import * as css from '../css/index.css'
import { MonthSelect } from '../utils/monthselect'

type OnCPlansCreated = () => void;

interface CreationPopupProps {
    onPlansCreated: OnCPlansCreated;
}

interface IState {
    open: boolean;
    month: number;
    year: number;
}

export class CreationPopup extends React.Component<CreationPopupProps, IState> {

    constructor(props: CreationPopupProps) {
        var currentTime = new Date();
        super(props);
        this.state = { open: false, month: currentTime.getMonth() + 1, year: currentTime.getFullYear() };
        this.createPlans = this.createPlans.bind(this);
    }

    createPlans() {
        var self: CreationPopup = this;
        fetch("plans/createFromTemplates/" + this.state.month + "/" + this.state.year)
            .then((response: Response) => response.text())
            .then(() => self.props.onPlansCreated()); self.setState({ open: false });
    }

    renderCreation(): React.JSX.Element | null {
        if (this.state.open) {
            return (
                <div className={pcss.creationFrame}>
                    <div className={pcss.creationPopup} testdata-id={"creationpopup"}>
                        <div>{label("plan.createplans")}</div>
                        <div className={pcss.creationPopupMonthSelect}>
                            <MonthSelect label=''
                                year={this.state.year}
                                month={this.state.month}
                                onChange={(m: number, y: number) => this.setState({ month: m, year: y })} />
                        </div>
                        <span style={{ margin: '5px' }} >
                            <button
                                testdata-id={"cancel"}
                                className={pcss.creationButton}
                                onClick={() => this.setState({ open: false })}>
                                {label("cancel")}
                            </button>
                            <button
                                testdata-id={"create"}
                                className={pcss.creationButton}
                                onClick={this.createPlans}>
                                {label("create")}
                            </button>
                        </span>
                    </div >
                </div >
            );
        }
        else
            return null;
    }

    render(): React.JSX.Element {
        return (
            <div style={{ border: '1px solid black', marginTop: '5px', padding: '30px', textAlign: 'center' }}>
                <button testdata-id={"creationpopup-button"} onClick={() => this.setState({ open: true })} className={css.addonbutton} >
                    {label("plan.fromtemplates")}</button>
                {this.renderCreation()}
            </div>
        );
    }
}