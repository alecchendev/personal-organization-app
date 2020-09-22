import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// first commit

class App extends React.Component {
  render() {
    return (
      <div>
        Hello react!
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));