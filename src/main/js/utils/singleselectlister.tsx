import React from 'react';
import { SelectLister, ColumnInfo, CreateFooterCallback } from './selectlister'

export { ColumnInfo, CellInfo } from './selectlister'

export type HandleSingleSelectCallback<D> = (data: D) => void;
export type IsEqualValue<D> = (val1: D, val2: D) => boolean;

export interface SingleSelectlisterProps<D> {
    ext?: string;
    url: string;
    value?: D;
    handleChange?: HandleSingleSelectCallback<D>;
    handleSelect?: HandleSingleSelectCallback<D>;
    createFooter?: CreateFooterCallback<D>;
    isEqualValue?: IsEqualValue<D>;
    columns: ColumnInfo<D>[];
    lines?: number;
}

class CState<D> {
    selectedData: D | undefined;
    selectedRow: number | undefined;
}

export class SingleSelectLister<D> extends React.Component<SingleSelectlisterProps<D> & { 'testdata-id'?: string }, CState<D>> {

    lister: SelectLister<D> | null;

    constructor(props: SingleSelectlisterProps<D>) {
        super(props);
        this.state = { selectedData: undefined, selectedRow: undefined };
        this.lister = null;
        this.changeSelected = this.changeSelected.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.searchSelected = this.searchSelected.bind(this);
    }

    componentDidUpdate(prevProps: SingleSelectlisterProps<D>): void {
        if (prevProps.ext !== this.props.ext) {
            this.setState({ selectedData: undefined, selectedRow: undefined })
        }
    }


    clearSelection(): void {
        this.setState({ selectedData: undefined, selectedRow: undefined })
    }

    changeSelected(data: D, index: number): void {
        this.setState({ selectedData: data, selectedRow: index })
        if (this.props.handleChange != undefined)
            this.props.handleChange(data);
    }

    searchSelected(data: D[]): D[] {
        if (this.props.value == undefined || this.props.isEqualValue == undefined)
            return data;

        var row: number = undefined;
        for (row = 0; row < data.length; row++) 
            if (this.props.isEqualValue(this.props.value, data[row]) )
                break;
        
        if ( row < data.length ) {
            this.setState({selectedRow:row, selectedData: data[row]});
            return data;
        }
        else {
            data.push(this.props.value);
            this.setState({selectedRow:data.length, selectedData: this.props.value});
            return data;
        }
    }

    executeSelected(data: D, index: number): void {
        this.setState({ selectedData: data, selectedRow: index })
        if (this.props.handleSelect != undefined)
            this.props.handleSelect(data);
    }

    reload(): void {
        this.setState({ selectedData: undefined, selectedRow: undefined })
        if (this.lister)
            this.lister.reload();
    }

    isSelected(index: number): boolean {
        return this.state.selectedRow === index;
    }

    getSelected(): D | undefined {
        return (this.state.selectedData);
    }

    getData(): D[] {
        if (this.lister == undefined)
            return [];
        return this.lister.getDataAll();
    }

    render(): React.JSX.Element {
        return (
            <SelectLister<D>
                testdata-id={this.props['testdata-id']}
                columns={this.props.columns}
                createFooter={this.props.createFooter}
                ext={this.props.ext}
                url={this.props.url}
                lines={this.props.lines}
                handleSelect={(_s, _c, d, i) => this.changeSelected(d, i)}
                handleExecute={(_s, _c, d, i) => this.executeSelected(d, i)}
                isSelected={this.isSelected}
                hasSelected={() => this.state.selectedRow != undefined}
                analyzeList={this.searchSelected}
                ref={(r) => { this.lister = r; }} />
        );
    }
}

