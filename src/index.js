import { render } from '@testing-library/react';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import {readJson} from './backend';
//const fileSync = require('fs');
//readJson();


// basically, just combine both into a simplified file

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
      checked: false,
      type: "",
      name: "",
      when: "",
      toWhen: ""
    }
  }
  const entry = {};
  const entryProps = ["checked", "type", "name", "when", "toWhen"];
  const entryDefaultValues = {
    checked: false,
    type: "",
    name: "",
    when: "",
    toWhen: ""
  }

  for (let index in entryProps) {
    const prop = entryProps[index];
    if (entryData.hasOwnProperty(prop)) {
      entry[prop] = entryData[prop];
    } else {
      entry[prop] = entryDefaultValues[prop];
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
      <td className="checkboxContainer" ><input type="checkbox" className="checkbox" onClick={(event) => props.onClick(props.index, event)} defaultChecked={props.checked}/></td>
      {props.data}
      <td className="deleteContainer"><input type="checkbox" className="deletebox" onClick={(event) => props.onDelete(props.index, event)} /></td>
    </tr>
  )
}

// eventually put the parsing back into the entrysystem component

function Table(props) {
  const columnKey = "columnHeader";
  const columnHeaders = [];
  for (let [key, header] of props.columnHeaders.entries()) {
    columnHeaders.push(<th key={key}>{header}</th>);
  }

  const rows = [];
  rows.push(<Row key={columnKey} data={columnHeaders} />);

  let filterFunc = (entry) => Object.keys(props.filter).every((objKey) => props.filter[objKey] === entry[objKey]);
  const addEntries = Object.values(props.entries).filter(filterFunc);

  for (let [rowKey, entry] of addEntries.entries()) {
    const rowData = [];
    for (let [dataKey, entryProp] of props.values.entries()) {
      rowData.push(<td key={dataKey}>{entry[entryProp]}</td>);
    }
    rows.push(<Row key={entry.index} data={rowData} onClick={props.onClick} onDelete={props.onDelete} index={entry.index} checked={entry.checked} />);
  }
  
  return (
    <div className="tableContainer">
      <h3 className="tableTitle">{props.title}</h3>
      <table>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
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

function EntrySystem() {
  const [inputValue, setInputValue] = useState("");
  const [nextIndex, setNextIndex] = useState(0);
  const [entries, setEntries] = useState({});

  function handleChange(event) {
    setInputValue(event.target.value);
  };

  function handleSubmit(event) {
    event.preventDefault();
    const newEntries = {...entries}; // copy
    const newEntry = parseInput(inputValue);
    newEntry.index = nextIndex;
    newEntries[nextIndex] = newEntry;
    setInputValue("");
    setNextIndex(nextIndex + 1);
    setEntries(newEntries)
  }

  function handleClick(index, event) {
    console.log(index);
    console.log(event.target.checked);
    const entry = entries[index];
    const newEntries = {...entries};
    const newEntry = entry;
    newEntry.checked = event.target.checked;
    newEntries[index] = newEntry;
    setEntries(newEntries);
  }

  function handleDelete(index, event) {
    const newEntries = {...entries};
    delete newEntries[index];
    setEntries(newEntries);
  }

  const taskFilter = {
    checked: false,
    type: "task",
    toWhen: ""
  }
  const eventFilter = {
    checked: false,
    type: "event"
  }
  const thingFilter = {
    checked: false,
    type: "thing",
    when: "",
    toWhen: ""
  }
  const todoFilter = {
    checked: false
  }
  const logFilter = {
    checked: true
  }
  return (
    <div className="entrySystemContainer">
      <div className="formTableContainer">
        <Input value={inputValue} handleChange={handleChange} handleSubmit={handleSubmit} />
        <Table title={"Tasks"} columnHeaders={["Type", "Name", "When"]} values={["type", "name", "when"]} entries={entries} type={"task"} filter={taskFilter} onClick={handleClick} onDelete={handleDelete} />
        <Table title={"Events"} columnHeaders={["Type", "Name", "When", "To When"]} values={["type", "name", "when", "toWhen"]} entries={entries} type={"event"} filter={eventFilter} onClick={handleClick} onDelete={handleDelete} />
        <Table title={"Things"} columnHeaders={["Type", "Name"]} values={["type", "name"]} entries={entries} type={"thing"} filter={thingFilter} onClick={handleClick} onDelete={handleDelete} />
      </div>
      <div className="tableContainer2">
        <Table title={"To do"} columnHeaders={["Type", "Name", "When", "To When"]} values={["type", "name", "when", "toWhen"]} entries={entries} type={["task", "event", "thing"]} filter={todoFilter} onClick={handleClick} onDelete={handleDelete} />
        <Table title={"Log"} columnHeaders={["Type", "Name", "When", "To When"]} values={["type", "name", "when", "toWhen"]} entries={entries} type={["task", "event", "thing"]} filter={logFilter} onClick={handleClick} onDelete={handleDelete} />
      </div>
    </div>
  )
}

function Page() {
  const [apiResponse, setApiResponse] = useState("");

  useEffect(() => {
    function callAPI() {
      fetch("http://localhost:9000/testAPI")
        .then(res => res.text())
        .then(res => setApiResponse(res))
        .catch(err => err);
    }
    console.log(' asnyhifnthing');
    callAPI();
  })

  return (
    <div className="pageContainer">
      <div className="pageTitle">
        <h1>Page Title</h1>
        {<p>{apiResponse}</p>}
      </div>
      <EntrySystem />
    </div>
  )
}

ReactDOM.render(
  <Page />, 
  document.getElementById('root')
);