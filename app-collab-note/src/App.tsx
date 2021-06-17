import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import './App.css';

import CollabNote from './containers/CollabNote';
import Home from './containers/Home';
import StatusBar from './components/StatusBar';
import { history } from './redux/configStore';

function App(): JSX.Element {
  return (
    <div className="App">
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/collab" exact component={CollabNote} />
        </Switch>
      </ConnectedRouter>
      <StatusBar />
    </div>
  );
}

export default App;
