import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { setNoteTitle } from 'redux/actions';
import { AppState } from 'redux/types';
import styled from 'styled-components';
import { yUtils } from 'utils/WebRTCUtils/y-utils';

const Container = styled.div`
  display: flex;
  padding: 10px;
`;
const TitleInput = styled.input`
  display: block;
  border: none;
  font-size: xx-large;
`;

interface Props {
  title: string;
  updateTitle: (title: string) => void;
}

function Titlebar(props: Props) {
  const titleInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(titleInput.current)
      yUtils().bindNoteTitle(titleInput.current);
  }, []);

  const { title, updateTitle } = props;

  return (
    <Container>
      <TitleInput
        ref={titleInput}
        value={title}
        onInput={() => updateTitle(titleInput.current?.value || '')}
        onChange={() => updateTitle(titleInput.current?.value || '')}
      />
    </Container>
  );
}

const mapStateToProps = (state: { app: AppState }) => {
  return {
    title: state.app.note?.title || ''
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateTitle: (title: string) => dispatch(setNoteTitle(title))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Titlebar);
