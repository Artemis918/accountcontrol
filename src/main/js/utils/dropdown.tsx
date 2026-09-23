import React from 'react'
import { EnumDTO, fetchJson } from './dtos'


type HandleChange = (id: number) => void;

export interface DropdownProps {
    onChange: HandleChange;
    url: string;
    param?: string;    // undefined->ignored,  ''->no select, value-> urlextension
    value?: number;
    className?: string;
    selectDef?: boolean;
}

interface IState {
    options: EnumDTO[];
}

export class Dropdown extends React.Component<DropdownProps, IState> {

    options: EnumDTO[] = [];

    constructor(props: DropdownProps) {
        super(props);
        this.state = { options: [] };
        this.handleChange = this.handleChange.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.setData = this.setData.bind(this);
        this.setOptions = this.setOptions.bind(this);
    }

    componentDidUpdate(prevProps: DropdownProps): void {
        this.setOptions(this.state.options);
        if (this.props.param != prevProps.param)
            this.fetchData();
    }

    componentDidMount(): void {
        this.fetchData();
    }

    setOptions(data: EnumDTO[]): void {
        this.options = data;
        if (this.props.value == undefined) {
            if (this.props.selectDef && this.options.length > 0)
                this.props.onChange(this.options[0].value);
            else
                this.options.unshift({ value: -1, text: 'Select...' });
        }
        else if (this.props.value != undefined && this.options.length == 0 )
            this.options.unshift({ value: this.props.value, text: 'Select...' });
    }

    handleChange(value: string) {
        var v: number = parseInt(value);
        if (this.props.value != v) {
            this.props.onChange(v);
        }
    }

    setData(data: EnumDTO[]): void {
        this.setState({ options: data });
        this.setOptions(data);
    }

    fetchData(): void {
        if (this.props.param == '') {
            this.setData([]);
        }
        else {
            var url = this.props.url;
            var param = this.props.param;
            if (param != undefined) {
                url = url + '/' + param;
            }
            var self: Dropdown = this;
            fetchJson(url, d => { self.setData(d as EnumDTO[]) });
        }
    }

    render(): React.JSX.Element {

        return (
            <select className={this.props.className}
                value={this.props.value != undefined ? this.props.value : -1}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => this.handleChange(e.target.value)}>
                {this.options.map((t, _) => <option key={t.value} value={t.value}>{t.text}</option>)}
            </select>
        );
    }

}