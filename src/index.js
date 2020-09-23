import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// first commit

function InputForm(props) {
  return (
    <form>
      <label>
        <input type="text" />
      </label>
      <input type="submit" value={props.submitLabel} onClick={props.onClick}/>
    </form>
  )
}

function Entry(props) {
  return (
    <tr>
      <td className="name">{props.data.name}</td>
      <td className="time">{props.data.time}</td>
    </tr>
  )
};

function Table(props) {
  return (
    <div>
      <table>
        <tr>
          <th>Name</th>
          <th>Time</th>
        </tr>
        {/*props*/}
      </table>
    </div>
  )
}

class EntrySystem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      columnNames: [
        
      ],
      entries: [
        {
          name: "testName",
          time: "testTime"
        }
      ]
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      inputValue: event.target.value,
      columnNames: this.state.columnNames,
      entries: this.state.entries
    })
  }

  handleSubmit(event) {
    
    // Update list of entries
    const entries = this.state.entries.slice();
    entries.unshift(this.state.inputValue);
    this.setState({
      inputValue: this.state.inputValue,
      columnNames: this.state.columnNames,
      entries: entries
    })
    console.log(this.state.entries);
    //alert(event.target.value);
    // empty the input box
    event.preventDefault();
  }

  render() {


    const rows = [];
    for (const [index, entry] of this.state.entries.entries()) {
      rows.push(<Entry key={index} data={entry}/>)
    }

    return (
      <div>
        <div className="formContainer">
          <form onSubmit={(event) => this.handleSubmit(event)}>
            <label>
              <input type="text" onChange={(event) => this.handleChange(event)}/>
            </label>
            <input type="submit"/>
          </form>
        </div>
        <div className="tableContainer">
          {/*<Table props={rows} />*/}
          <table>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

}

ReactDOM.render(
  <EntrySystem />, 
  document.getElementById('root')
);
