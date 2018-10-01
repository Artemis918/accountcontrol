import React from 'react'
import ReactTable from "react-table";
import TemplateEditor from 'templateeditor.jsx'
import "react-table/react-table.css";

class TemplateAction extends React.Component {
    render() {
        return (<h1> TemplateAction </h1>);
    }
}

class TemplateList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
    }

    render() {
        var columns = [{
            Header: 'Gültig von',
            accessor: 'gueltigVon',
            width: '100px'
        }, {
            Header: 'Gültig bis',
            accessor: 'gueltigBis',
            width: '100px'
        }, {
            Header: 'Rhythmus',
            accessor: 'rhythm',
            width: '100px'
        }, {
            Header: 'Beschreibung',
            accessor: 'shortDescription',
            width: '50%'
        }, {
            Header: 'Betrag',
            accessor: 'betrag',
            width: '100px',
            Cell: row => (

                <div style={{
                    color: row.value >= 0 ? 'green' : 'red',
                    textAlign: 'right'
                }}>
                    {(row.value / 100).toFixed(2)}
                </div>
            )
        }]

        return (<ReactTable
            defaultPageSize={10}
            data={this.state.data}
            columns={columns} />);
    }
}


export default class Buchen extends React.Component {

    render() {
        return (
            <table style={{ width: '20%',border: '1px solid black'}}>
                <tbody>
                    <tr>
                        <td style={{ width: '20%',border: '1px solid black'}}>
                            <TemplateEditor />
                        </td>
                        <td style={{ width: '80%' }}>
                            <table>
                                <tbody>
                                    <tr><td style={{border: '1px solid black'}}><TemplateAction /></td></tr>
                                    <tr><td style={{border: '1px solid black'}}><TemplateList /></td></tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

}