import React from 'react';
import styled, { keyframes } from 'styled-components';

interface Props {
  message: string;
  children: React.ReactNode;
}

function Tooltip({ children, message }: Props) {
  return (
    <Container>
      {children}
      <ContentContainer>
        <ContentStart />
        <Content className="tooltip">{message}</Content>
      </ContentContainer>
    </Container>
  );
}

const tooltip = keyframes`
from {
  opacity:1;
}

to{
  opacity:0;
}
  
`;

const Container = styled.div`
  position: relative;
  width: fit-content;
  height: fit-content;
  &:hover > .tooltip,
  &:active > .tooltip {
    opacity: 0;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  margin-top: 16px;

  position: absolute;
`;

const ContentStart = styled.div`
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid black;
  border-top: 0px;
  position: absolute;
  bottom: 27px;
  left: 50px;
`;

const Content = styled.div`
  border-radius: 8px;
  background-color: black;
  font-size: 11px;
  padding: 8px 10px;
  color: white;
  transition: all 0.3s;
  opacity: 1;
`;
export default Tooltip;
