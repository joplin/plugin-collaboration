import React from 'react';
import loader from './icons/loader.svg';
import error from './icons/error.svg';
import success from './icons/success.svg';
import styled from 'styled-components';
import { MessageType, AppState } from 'redux/types';
import { connect } from 'react-redux';

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
  height: 40px;
  width: 40px;
`;

interface Props {
  message: string | undefined;
  messageType: string | undefined;
  showStatus: boolean;
}

const showImg = {
  display: 'block',
};
const hideImg = {
  display: 'none',
};

function StatusBar(props: Props) {
  const { message, messageType, showStatus } = props;

  if (!showStatus) {
    return <></>;
  }

  return (
    <Container>
      <Image
        src={loader}
        alt="loader svg"
        style={messageType === MessageType.LOADING ? showImg : hideImg}
      />
      <Image
        src={success}
        alt="success svg"
        style={messageType === MessageType.SUCCESS ? showImg : hideImg}
      />
      <Image
        src={error}
        alt="error svg"
        style={messageType === MessageType.ERROR ? showImg : hideImg}
      />
      <Message>{message}</Message>
    </Container>
  );
}

const mapStateToProps = (state: { app: AppState }) => {
  const { apiStatus } = state.app;
  return {
    messageType: apiStatus?.messageType,
    message: apiStatus?.message,
    showStatus: !!apiStatus,
  };
};

export default connect(mapStateToProps)(StatusBar);
