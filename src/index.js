import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// basically, just combine both into a simplified file


// Minimal backend code
function parseInput(input) {
    // parsing - current/basic form - [entryType] [task name] [month] [day] [time] - task name month day time
    const elements = input.split(" ");
    const [entryType, name, month, day, time] = elements;
    const entry = {
        type: entryType,
        name: name,
        time: [time, day, month].join(" ")
    }
    return entry;
}



// React components
function Row(props) {
    return (
        <tr>
            <td>{props.entry.type}</td>
            <td>{props.entry.name}</td>
            <td>{props.entry.time}</td>
        </tr>
    )
}

function Table(props) {
    return (
        <table>
            <tbody>
                {/* column headers */}
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Time</th>
                </tr>
                {props.rows}
            </tbody>
        </table>
    )
}

function Input(props) {
    return (
        <form onSubmit={props.handleSubmit}>
            <label>
                <input type="text" value={props.value} onChange={props.handleChange}/>
            </label>
        </form>
    )
}

class EntrySystem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      columnNames: [
        "type",
        "name",
        "type"
      ],
      entries: [
      ]
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const inputValue = event.target.value;
    this.setState((state) => ({
      inputValue: inputValue,
      columnNames: state.columnNames,
      entries: state.entries
    }))
  }

  handleSubmit(event) {
    event.preventDefault();

    const entries = this.state.entries.slice();
    const newEntry = parseInput(this.state.inputValue);
    entries.unshift(newEntry);

    this.setState((state) => ({
      inputValue: "",
      columnnames: this.state.columnNames,
      entries: entries
    }))
  }
  
  render() {
    const rows = [];
    for (const [key, entry] of this.state.entries.entries()) {
      rows.push(<Row key={key} entry={entry}/>)
    }

    return (
      <div className="entrySystem">
        <div className="formContainer">
          <Input value={this.state.inputValue} handleChange={this.handleChange} handleSubmit={this.handleSubmit} />
        </div>
        <div className="tableContainer">
          {/* later change so that table creates rows from entries...? */}
          <Table rows={rows} />
        </div>
      </div>
    )
  }

}

ReactDOM.render(
  <EntrySystem />, 
  document.getElementById('root')
);