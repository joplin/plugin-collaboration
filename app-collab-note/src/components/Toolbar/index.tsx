import React from 'react';
import styled from 'styled-components';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faClipboard, faDownload } from '@fortawesome/free-solid-svg-icons';

import { connect } from 'react-redux';
import { loadNote, saveNote } from 'redux/actions';
import { AppState } from 'redux/types';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  overflow-x: auto;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06), 0 2px 5px 0 rgba(0, 0, 0, 0.2);
`;

const OptionsContainer = styled.div`
  display: flex;
  gap: 5px;
  margin: 2px 10px;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  min-width: 30px;
  padding: 10px;
  gap: 5px;
  color: #738598;
  border-radius: 3px;
  :hover {
    cursor: pointer;
    background-color: #CBDAF1;
  }
`;

export interface ToolbarItemProps {
  label: string;
  icon: IconProp;
  text: string;
  onlyHost?: boolean;
  action: () => void;
}

interface Props {
  isHost: boolean;
  toolbarItems: ToolbarItemProps[];
  toolbarRoutine?: () => void;
  loadNote: () => void;
  save: () => void;
  copyRoomIdToClipboard: () => void;
}


function ToolbarItem(props: ToolbarItemProps & { isHost: boolean }) {
  if(props.onlyHost && !props.isHost) {
    return <></>;
  }
  return (
    <Option title={props.label} onClick={props.action}>
      { props.text }
      <FontAwesomeIcon icon={props.icon}/>
    </Option>
  );
}
  
function Toolbar(props: Props) {
  const defaultOptions: ToolbarItemProps[] = [
    {
      label: 'Fetch note from Joplin',
      icon: faDownload,
      text: '',
      onlyHost: true,
      action: () => {
        if(confirm('This will override the current contents of the note.\nare you sure?')) {
          props.loadNote();
        }
      }
    },
    {
      label: 'Save note to Joplin',
      icon: faSave,
      text: '',
      onlyHost: true,
      action: () => {
        if(confirm('Do you want to save the changes to Joplin?')) {
          props.save();
        }
      }
    },
    {
      label: 'Copy Room ID',
      icon: faClipboard,
      text: '',
      onlyHost: false,
      action: () => { 
        props.copyRoomIdToClipboard(); 
      }
    },
  ];

  const { toolbarItems, isHost } = props;
  function renderToolbarItems() {
    if(!toolbarItems || !toolbarItems.length) return <></>;
    return toolbarItems.map(toolbarItem => <ToolbarItem key={toolbarItem.label} {...toolbarItem} isHost={isHost}/>);
  }

  return (
    <Container>
      <OptionsContainer onClick={props.toolbarRoutine}>
        {renderToolbarItems()}
      </OptionsContainer>
      <OptionsContainer>
        {defaultOptions.map(option => <ToolbarItem key={option.label} {...option} isHost={isHost}/>)}
      </OptionsContainer>
    </Container>
  );
}

function copyToClipboard(value: string) {
  const tempInput = document.createElement('input');
  tempInput.value = value;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
}

const mapStateToProps = (state: { app: AppState }) => {
  const { isHost, roomId } = state.app;
  return {
    isHost,
    copyRoomIdToClipboard: () => {
      copyToClipboard(roomId || '');
    }
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    save: () => {
      dispatch(saveNote());
    },
    loadNote: () => {
      dispatch(loadNote());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
