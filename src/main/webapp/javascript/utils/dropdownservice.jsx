import React from 'react'

export default class DropdownService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
    this.handleChange = this.handleChange.bind(this);
    this.setparam = this.setparam.bind(this);
    this.fetchData = this.fetchData.bind(this);
    }
  
  handleChange(event) {
      this.props.onChange(event.target.value);
  }
  
  componentWillMount() {
      this.fetchData(this.props.param);
  }
  
  fetchData(value) {
      var url = this.props.url;
      if (value != undefined) {
          url = url + '/' + value;
      }
      fetch(url)
          .then(response => response.json())
          .then(data => { this.setState({data: data})} )
  }
  
  setparam(value) {
      this.fetchData(value);
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