import { css } from '@emotion/react';
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface Props {
  message: string;
  children: React.ReactNode;
}

function Tooltip({ children, message }: Props) {
  const [bVisible, bSetVisible] = useState(true);
  return (
    <Container
      onClick={() => {
        bSetVisible(false);
      }}
    >
      {children}
      <ContentContainer>
        <div css={bVisible ? visible : invisible}>
          <ContentStart />
          <Content>{message}</Content>
        </div>
      </ContentContainer>
    </Container>
  );
}

const invisible = css({ display: 'none' });
const visible = css({ display: 'block' });

const Container = styled.div`
  position: relative;
  width: fit-content;
  height: fit-content;
`;

const ContentContainer = styled.div`
  display: flex;
  padding-top: 16px;
  position: absolute;
`;

const ContentStart = styled.div`
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid black;
  border-top: 0px;
  position: absolute;
  bottom: 34px;
  left: 50px;
`;

const ContentStartBottom = styled.div`
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid black;
  border-bottom: 0px;
  position: absolute;
  top: 50px;
  left: 50px;
`;

const Content = styled.div`
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  text-align: center;
  text-overflow: clip;
  height: 34px;
  border-radius: 8px;
  background-color: black;
  padding: 8px 10px;
  color: white;
  position: absolute;
  font-size: 13px;
  position: fixed;
  font-weight: 400;
`;
export default Tooltip;
