import React from 'react';

import styled from 'styled-components';
import { connect } from 'react-redux';

import HostForm from 'components/Forms/HostForm';
import JoinForm from 'components/Forms/JoinForm';
import { configureUserDetails } from 'redux/actions';
import { resetState } from 'redux/actions';
import { UserConfig, Action } from 'redux/types';

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

interface Props {
  dispatch: any
}

interface State {
  isHost: boolean;
}

class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isHost: true,
    };
    props.dispatch(resetState());
  }

  onSubmit = (formData: any) => {
    const { dispatch } = this.props;
    const { isHost } = this.state;
    const userConfig = { isHost, ...formData } as UserConfig;

    dispatch(configureUserDetails(userConfig));
  };

  changeState = () => {
    let { isHost } = this.state;
    isHost = !isHost;
    this.setState({ isHost: isHost });
  };

  render() {
    const { isHost } = this.state;
    return (
      <Container>
        {isHost && <HostForm onSubmit={this.onSubmit} />}
        {!isHost && <JoinForm onSubmit={this.onSubmit} />}
        <Option>
          {isHost && 'Want to join existing room? '}
          {!isHost && 'Want to host a Joplin Note? '}
          <Link onClick={this.changeState}>Click here</Link>
        </Option>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatch: (action: Action) => { dispatch(action); }
  };
};

export default connect(null, mapDispatchToProps)(Home);
