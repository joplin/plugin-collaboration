import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import Editor from './Editor/Editor';

import Home from './Home'



function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/collab' exact component={Editor} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
