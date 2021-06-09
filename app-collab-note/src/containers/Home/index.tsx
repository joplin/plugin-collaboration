import React from "react";

import styled from "styled-components";
import { connect } from "react-redux";

import HostForm from "../../components/Forms/HostForm";
import JoinForm from "../../components/Forms/JoinForm";
import { configUser, setNoteDetails } from "../../redux/actions";
import { UserConfig } from "../../redux/actions";
import { bridge } from "../../utils/DataApiUtils/bridge";

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
  history: any,
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
  }

  componentDidMount() {}

  onSubmit = (formData: any) => {
    const { history, dispatch } = this.props;
    const { isHost } = this.state;
    const config = { isHost, ...formData } as UserConfig

    dispatch(configUser(config));

    if(isHost) {
      bridge().init(dispatch, formData.token)
      .then(() => {
        return bridge().getNote(formData.noteId, ['title', 'body'])
      })
      .then(note => {
        dispatch(setNoteDetails(note));
        history.push('/collab');
      })
      .catch(err => {
        alert(err.message);
      });
    }
    else {
      history.push('/collab');
    }
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
          {isHost && "Want to join existing room? "}
          {!isHost && "Want to host a Joplin Note? "}
          <Link onClick={this.changeState}>Click here</Link>
        </Option>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatch: (action: any) => { dispatch(action) }
  }
}

// This adds dispatch as a default prop
export default connect(null, mapDispatchToProps)(Home);
