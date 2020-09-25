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

function reverseString(str) {
  return str.split("").reverse().join("");
}

function parseTask(input) {
  // cs 196 shit sep 25 1159p
  const reversedInput = reverseString(input);

  const monthRegex = /[a-z]+\s/i; // gets the first block of letters
  const month = reverseString(reversedInput.match(monthRegex)[0].trim());
  
  const dayRegex = /[^\w]\d{1,2}\s/;
  const day = reverseString(reversedInput.match(dayRegex)[0].trim());

  const timeRegex = /[a-z]{1,2}\d{1,4}\s/i;
  const time = reverseString(reversedInput.match(timeRegex)[0].trim());

  const when = [month, day, time].join(" ");

  const name = input.replace(when, "").trim();

  const type = "task";

  const task = {
    type: type,
    name: name,
    when: when
  }
  console.log(task);

  // follup on tuition friday

  return task;
}

function parseEvent(input) {
  // macs 100 lecture sep 25 10-1050a
  const reversedInput = reverseString(input);

  const monthRegex = /[a-z]+\s/i; // gets the first block of letters
  const month = reverseString(reversedInput.match(monthRegex)[0].trim());

  const dayRegex = /[^\w-]\d{1,2}\s/; // important distinction: specifices not hyphen
  const day = reverseString(reversedInput.match(dayRegex)[0].trim());

  const timeRegex = /[a-z]{1,2}\d{1,4}-\d{1,4}\s/i;
  const time = reverseString(reversedInput.match(timeRegex)[0].trim());
  const [time1, time2] = time.split("-");

  const when = [month, day, time1].join(" ");
  const toWhen = [month, day, time2].join(" ");

  const name = input.replace([month, day, time].join(" "), "").trim();

  const type = "event";

  const event = {
    type: type,
    name: name,
    when: when,
    toWhen: toWhen,
  }
  console.log(event);

  return event;
}

function parseThing(input) {
  const name = input;
  const type = "thing";
  const thing = {
    type: type,
    name: name
  }
  console.log(thing);
  return thing;
}

parseTask("cs 196 shit sep 25 1159p");
parseEvent("macs 100 lecture sep 25 10-1050a");
parseThing("call chris");

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