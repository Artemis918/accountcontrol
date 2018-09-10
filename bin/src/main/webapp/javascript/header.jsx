import React from 'react'

class WorkSelect extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.handleChange(event.target.value);
  }

  render() {
    return (
      <div>
        <form>
          <select value={this.props.value} onChange={this.handleChange}>
            <option value="1">Planen</option>
            <option value="2">Belege</option>
            <option value="3">Buchen</option>
            <option value="4">Konten</option>
            <option value="5">Übersicht</option>
            <option value="6">Stammdaten</option>
          </select>
        </form>
      </div>
    );
  }
}


export default class Header extends React.Component {
  render() {
    return (
      <div>
        <table width='100%' >
          <tbody>
            <tr>
              <td><h1> {this.props.title}</h1> </td>
              <td> <WorkSelect handleChange={this.props.changeValue} value={this.props.value} /> </td>
            </tr>
          </tbody>
        </table>
        <hr />
      </div>
    );
  }
}