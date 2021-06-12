import React, { Component } from "react";
import loader from "./icons/loader.svg";
import error from "./icons/error.svg";
import success from "./icons/success.svg";
import styled from "styled-components";
import { MessageType } from "../../redux/actions";
import { connect } from "react-redux";

const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 10px;
  display: flex;
  align-items: center;
`;

const Message = styled.div`
  margin: 10px 20px;
`;

const Image = styled.img`
  heigth: 40px;
  width: 40px;
`;

interface Props {
  message: string;
  messageType: string;
  showStatus: boolean;
}

class StatusBar extends Component<Props> {
  render() {
    const { message, messageType, showStatus } = this.props;

    if(!showStatus) {
      return (
        <></>
      )
    }

    return (
      <Container>
        {messageType === MessageType.LOADING && (
          <Image src={loader} alt="loader svg" />
        )}
        {messageType === MessageType.ERROR && (
          <Image src={error} alt="loader svg" />
        )}
        {messageType === MessageType.SUCCESS && (
          <Image src={success} alt="loader svg" />
        )}
        <Message>{message}</Message>
      </Container>
    );
  }
}

const mapStateToProps = (state: any) => {
  const { apiStatus } = state.app;
  return {
    messageType: apiStatus?.messageType,
    message: apiStatus?.message,
    showStatus: !!apiStatus,
  };
};

export default connect(mapStateToProps)(StatusBar);
