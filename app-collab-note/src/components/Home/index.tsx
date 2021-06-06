import "./Home.css";

import styled from "styled-components";
import { useHistory } from 'react-router-dom';

import React from "react";
import HostForm from "./HostForm";
import JoinForm from "./JoinForm";

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
  history: any
}

interface State {
  isHostSelected: boolean;
}

class Home extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      isHostSelected: true,
    };
  }

  componentDidMount() {}

  onSubmit = (formData: any) => {
    console.log(formData);
    const { history } = this.props;
    history.push('/collab');
  };

  changeState = () => {
    let { isHostSelected } = this.state;

    isHostSelected = !isHostSelected;

    this.setState({ isHostSelected });
  };

  render() {
    const { isHostSelected } = this.state;
    return (
      <Container>
        {isHostSelected && <HostForm onSubmit={this.onSubmit} />}
        {!isHostSelected && <JoinForm onSubmit={this.onSubmit} />}
        <Option>
          {isHostSelected && "Want to join existing room? "}
          {!isHostSelected && "Want to host a Joplin Note? "}
          <Link onClick={this.changeState}>Click here</Link>
        </Option>
      </Container>
    );
  }
}

export default Home;
