import React from 'react'

export default class DropdownService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event) {
      this.props.onChange(event.target.value);
  }
  
  componentWillMount() {
          fetch('http://localhost:8080/'+ this.props.url)
              .then(response => response.json())
              .then(data => { this.setState({data: data})} )
  }
  
  render() {
      var enumdata = this.state.data;
      return (
        <div>
          <form>
            <select value={this.props.value} onChange={this.handleChange}>
              //{enumdata.map(( t )=> <option value={t[this.props.valuefield]}>{t[this.props.textfield]}</option>)}
            </select>
          </form>
        </div>
      );
    }

}