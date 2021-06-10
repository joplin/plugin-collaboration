import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";

import CollabNote from "./containers/CollabNote";
import Home from "./containers/Home";
import StatusBar from "./components/StatusBar";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/collab" exact component={CollabNote} />
        </Switch>
      </Router>
      <StatusBar />
    </div>
  );
}

export default App;
