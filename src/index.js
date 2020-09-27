import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// basically, just combine both into a simplified file

parseInput("task cs 196 stuff sep 25 1159p");
parseInput("event macs 100 lecture sep 25 10-1050a");
parseInput("thing call chris");

// Minimal backend code
function parseInput(input) {

  const elements = input.split(" ");
  const type = elements.shift();
  const parseType = {
    "task": parseTask,
    "event": parseEvent,
    "thing": parseThing
  }

  let entryData;
  try {
    entryData = parseType[type](elements.join(" "));
  } catch {
    entryData = {
      type: "",
      name: "",
      when: "",
      toWhen: ""
    }
  }
  const entry = {};
  const entryProps = ["type", "name", "when", "toWhen"];

  for (let index in entryProps) {
    const prop = entryProps[index];
    if (entryData.hasOwnProperty(prop)) {
      entry[prop] = entryData[prop];
    } else {
      entry[prop] = "";
    }
  }

  //console.log(entry);
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
  //console.log(task);

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
  //console.log(event);

  return event;
}

function parseThing(input) {
  const name = input;
  const type = "thing";
  const thing = {
    type: type,
    name: name
  }
  //console.log(thing);
  return thing;
}

// React components

function Row(props) {
  return (
    <tr>
      <td className="checkboxContainer" onClick={props.onClick}><input type="checkbox" className="checkbox" /></td>
      {props.data}
      <td className="deleteContainer"><input type="checkbox" className="deletebox" /></td>
    </tr>
  )
}

// eventually make columns and row entries separate things
// also take a filter object as a prop and use it to compare entries

class Table extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const columnKey = "columnHeader";
    const columnHeaders = [];
    for (let [key, header] of this.props.columnHeaders.entries()) {
      columnHeaders.push(<th key={key}>{header}</th>);
    }

    const rows = [];
    rows.push(<Row key={columnKey} data={columnHeaders} onClick={this.props.onClick}/>);

    for (let [rowKey, entry] of this.props.entries.entries()) {
      entry = parseInput(entry);
      if (this.props.type.includes(entry.type)) {
        const rowData = [];
        for (let [dataKey, entryProp] of this.props.values.entries()) {
          rowData.push(<td key={dataKey}>{entry[entryProp]}</td>);
        }
        rows.push(<Row key={rowKey} data={rowData} />);
      }
    }

    return (
      <div>
        <h3 className="tableTitle">{this.props.title}</h3>
        <table>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    )
  }
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
      entries: [
      ]
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
    //const newEntry = parseInput(this.state.inputValue);
    const newEntry = this.state.inputValue;
    entries.unshift(newEntry);

    this.setState((state) => ({
      inputValue: "",
      columnnames: this.state.columnNames,
      entries: entries
    }))
  }

  handleClick(event) {
    console.log("ooga booga");
    console.log(event.target.checked);
  }
  
  render() {

    return (
      <div className="entrySystem">
      <div className="formTableContainer">
          <div className="formContainer">
            <Input value={this.state.inputValue} handleChange={this.handleChange} handleSubmit={this.handleSubmit} />
          </div>
          <div className="tableContainer">
            {/* later change so that table creates rows from entries...? */}
            {/* <Table rows={rows} /> */}
            <Table title={"Tasks"} columnHeaders={["Type", "Name", "When"]} values={["type", "name", "when"]} entries={this.state.entries} type={"task"} onClick={this.handleClick}/>
            <Table title={"Events"} columnHeaders={["Type", "Name", "When", "To When"]} values={["type", "name", "when", "toWhen"]} entries={this.state.entries} type={"event"}/>
            <Table title={"Things"} columnHeaders={["Type", "Name"]} values={["type", "name"]} entries={this.state.entries} type={"thing"}/>
          </div>
        </div>
        <div className="tableContainer2">
          <Table title={"To do"} columnHeaders={["Type", "Name", "When", "To When"]} values={["type", "name", "when", "toWhen"]} entries={this.state.entries} type={["task", "event", "thing"]}/>
          <Table title={"Log"} columnHeaders={["Type", "Name", "When", "To When"]} values={["type", "name", "when", "toWhen"]} entries={this.state.entries} type={["task", "event", "thing"]}/>
        </div>
      </div>
    )
  }

}

class Page extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="pageTitle">
          <h1>Page Title</h1>
        </div>
        <EntrySystem />
      </div>
    )
  }
}

ReactDOM.render(
  <Page />, 
  document.getElementById('root')
);