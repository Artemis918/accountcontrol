import React from 'react'
import { EnumDTO, fetchJson } from './dtos'


type HandleChange = (id: number) => void;

export interface DropdownServiceProps {
    onChange: HandleChange;
    url: string;
    param?: string;    // undefined->ignored,  ''->no select, value-> urlextension
    value?: number;
    className?: string;
}

interface IState {
    data: EnumDTO[];
    curval: number | undefined;
}

export class DropdownService extends React.Component<DropdownServiceProps, IState> {

    constructor(props: DropdownServiceProps) {
        super(props);
        this.state = { data: [], curval: props.value };
        this.handleChange = this.handleChange.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.setData = this.setData.bind(this);
    }

    componentDidUpdate(prevProps: DropdownServiceProps): void {
        if (this.props.param != prevProps.param)
            this.fetchData();
    }

    componentDidMount(): void {
        this.fetchData();
    }

    handleChange(value: string) {
        var v: number = parseInt(value);
        if (this.props.onChange)
            this.props.onChange(v);
    }

    setData(data: EnumDTO[]): void {
        var curval = this.props.value;
        if (curval == undefined && data.length > 0)
            curval = data[0].value;

        this.setState({ data: data, curval: curval });

        if (this.props.value == undefined && curval != undefined)
            this.props.onChange(curval);
    }

    fetchData(): void {
        var url = this.props.url;
        var param = this.props.param;
        if (param != undefined) {
            url = url + '/' + param;
        }
        if (param == undefined || param != '') {
            var self: DropdownService = this;
            fetchJson(url, d => { self.setData(d as EnumDTO[]) });
        }
    }

    render(): React.JSX.Element {

        return (
            <select className={this.props.className} value={this.state.curval}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => this.handleChange(e.target.value)}>
                {this.state.data.map((t, _) => <option key={t.value} value={t.value}>{t.text}</option>)}
            </select>
        );
    }

}