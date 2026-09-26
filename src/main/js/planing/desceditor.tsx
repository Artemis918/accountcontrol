import React from 'react'
import { label } from '../utils/misc'

import { Pattern } from '../utils/dtos'
import * as css from '../css/index.css'
import { ACDayPickerInput } from '../utils/acdaypickerinput'

export type SendDataCallback = (data: DescData) => void

export interface DescData {
    short: string;
    desc: string;
    validFrom: Date | undefined;
    validUntil: Date | undefined;
}

export interface DescEditorProps {
    data: DescData;
    sendData: SendDataCallback;
}

export class DescEditor extends React.Component<DescEditorProps, DescData> {

    constructor(props: DescEditorProps) {
        super(props);
        this.state = {
            short: this.props.data.short,
            desc: this.props.data.desc,
            validFrom: this.props.data.validFrom,
            validUntil: this.props.data.validUntil
        };
        this.sendData = this.sendData.bind(this);
        this.renderValidity = this.renderValidity.bind(this);
    }

    componentDidUpdate(prevProps: DescEditorProps) {
        if (prevProps.data.short !== this.props.data.short || prevProps.data.desc !== this.props.data.desc || prevProps.data.validFrom !== this.props.data.validFrom || prevProps.data.validUntil !== this.props.data.validUntil) {
            this.setState({
                short: this.props.data.short,
                desc: this.props.data.desc,
                validFrom: this.props.data.validFrom,
                validUntil: this.props.data.validUntil
            });
        }
    }

    sendData(): void {
        this.props.sendData(this.state);
    }

    renderValidity(): React.JSX.Element | null {
        if (this.props.data.validFrom != undefined) {
            return <tr><td>{label("templates.validfrom")}</td>
                <td><ACDayPickerInput
                    onChange={(d: Date) => { this.setState({ validFrom: d }); this.sendData() }}
                    startdate={this.state.validFrom} />
                </td>
                <td>{label("templates.validuntil")}</td>
                <td><ACDayPickerInput
                    onChange={(d: Date) => { this.setState({ validUntil: d }); this.sendData(); }}
                    startdate={this.state.validUntil} />
                </td>
            </tr>
        }
        else {
            return null
        };
    }

    render(): React.JSX.Element {
        return (
            <div className={css.boxborder} >
                <div className={css.boxinnerpart} >
                    <label className={css.boxlabel} > {label("plan.plandata")}</label>
                    <table>
                        <tbody style={{ verticalAlign: 'top' }} >
                            <tr><td>{label("shortdescription")}</td>
                                <td colSpan={3} >
                                    <input className={css.stringinput}
                                        testdata-id={'shortdescription'}
                                        value={this.state.short} type='text'
                                        onChange={(e) => { this.setState({ short: e.target.value }, this.sendData ); }} />
                                </td>
                            </tr>
                            <tr><td>{label("description")}</td>
                                <td colSpan={3} ><textarea cols={38} rows={3}
                                    className={css.stringinput}
                                    testdata-id={'description'}
                                    value={this.state.desc}
                                    onChange={(e) => { this.setState({ desc: e.target.value }, this.sendData ); }} />
                                </td>
                            </tr>
                            {this.renderValidity()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}