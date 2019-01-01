import React from 'react'
import PlanEditor from 'planeditor.jsx'
import SingleSelectLister from 'utils/singleselectlister'
import MonthSelect from 'utils/monthselect'

export default class Planen extends React.Component {

    constructor( props ) {
        super( props );
        var currentTime = new Date();

        this.state = { changed: false, month: currentTime.getMonth()+1, year: currentTime.getFullYear() };
        this.refreshlist = this.refreshlist.bind( this );
        this.setFilter = this.setFilter.bind( this );
        this.refresheditor = this.refresheditor.bind( this );
        this.listComponent = undefined;
        this.editorComponent = undefined;
        
        this.plancolumns = [{
            Header: 'Datum',
            accessor: 'plandate',
            width: '100px'
        }, {
            Header: 'Beschreibung',
            accessor: 'shortdescription',
            width: '50%'
        }, {
            Header: 'Betrag',
            accessor: 'wert',
            width: '100px',
            Cell: row => (

                <div style={{
                    color: row.value >= 0 ? 'green' : 'red',
                    textAlign: 'right'
                }}>
                    {( row.value / 100 ).toFixed( 2 )}
                </div>
            )
        }]
    }

    setFilter( m ,y ) {
        this.listComponent.setUrlExtension( y + "/" + m );
        this.setState({year: y, month: m})
    }

    refreshlist() {
        this.listComponent.reload();
    }

    refresheditor( planid ) {
        this.editorComponent.setPlan( planid );
    }

    render() {
        return (
            <table style={{ width: '100%', border: '1px solid black' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '20%', border: '1px solid black' }}>
                            <PlanEditor ref={( refEditor ) => { this.editorComponent = refEditor; }} onChange={() => this.refreshlist()} />
                        </td>
                        <td style={{ width: '80%' }}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td style={{ border: '1px solid black' }}>
                                            <MonthSelect label='Pläne erstellen bis:' year='2018' month='12' />
                                            <button> Erstellen </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td> 
                                            <MonthSelect label='Pläne für:' year={this.state.year} month= {this.state.month}  onChange={this.setFilter}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <SingleSelectLister ref={( refList ) => { this.listComponent = refList; }}
                                                ext={this.state.year + '/' + this.state.month}
                                                handleChange={( id ) => this.refresheditor( id )}
                                                columns={this.plancolumns}
                                                url='http://localhost:8080/plans/list/' />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

}