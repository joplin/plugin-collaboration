import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { connect } from 'react-redux';

import HostForm from 'components/Forms/HostForm';
import JoinForm from 'components/Forms/JoinForm';
import { configureUserDetails } from 'redux/actions';
import { UserConfig, Action } from 'redux/types';
import { RouteComponentProps } from 'react-router-dom';

const Container = styled.div`
  width: fit-content;
  box-shadow: 0 5px 15px #888888;
  border-radius: 10px;
  padding: 40px;
`;

const Option = styled.div`
  margin-top: 30px;
`;

const Link = styled.a`
  color: #08c;
  cursor: pointer;
`;

interface RouteParams {
  noteId?: string;
  token?: string;
  roomId?: string;
}

interface Props extends RouteComponentProps<RouteParams> {
  dispatch: any
}

function Home(props: Props) {
  let defaultIsHost = false;
  let userConfig: any = {};
  
  const { token, noteId, roomId } = props.match.params;
  if(token) {
    defaultIsHost = true;
    userConfig = { token, noteId };
  }
  else if(roomId) {
    userConfig = { roomId };
  }

  const [isHost, setIsHost] = useState(defaultIsHost);

  const onSubmit = (formData: any) => {
    const { dispatch } = props;
    const userConfig = { isHost, ...formData } as UserConfig;

    dispatch(configureUserDetails(userConfig));
  };

  const changeState = () => {
    setIsHost((prev) => !prev);
  };

  return (
    <Container>
      {isHost && <HostForm onSubmit={onSubmit} initData={userConfig}/>}
      {!isHost && <JoinForm onSubmit={onSubmit}  initData={userConfig}/>}
      <Option>
        {isHost && 'Want to join existing room? '}
        {!isHost && 'Want to host a Joplin Note? '}
        <Link onClick={changeState}>Click here</Link>
      </Option>
    </Container>
  );
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatch: (action: Action) => { dispatch(action); }
  };
};

export default connect(null, mapDispatchToProps)(Home);
