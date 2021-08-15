import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import styled from 'styled-components';

import './App.css';

import CollabNote from './containers/CollabNote';
import Home from './containers/Home';
import StatusBar from './components/StatusBar';
import { history } from './redux/configStore';

const AppContainer = styled.div`
  font-family: "Open Sans", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 40px;
`;

function App(): JSX.Element {
  return (
    <>
      <AppContainer>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/collab" exact component={CollabNote} />
            <Route path="/:roomId" exact component={Home} />
            <Route path="/:noteId/:token" exact component={Home} />
          </Switch>
        </ConnectedRouter>
      </AppContainer>
      <StatusBar />
    </>
  );
}

export default App;
