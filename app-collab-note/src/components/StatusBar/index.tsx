import React, { Component } from 'react'
import loader from './loader.svg';
import styled from 'styled-components';

const Spinner = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 10px;
`;

const Image = styled.img`
  heigth: 40px;
  width: 40px;
`;

class StatusBar extends Component {
  render() {
    return (
      <Spinner>
        <Image src={ loader } alt="loader svg" />
      </Spinner>
    )
  }
}

export default StatusBar;