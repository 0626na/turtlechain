import React from "react";
import styled from "styled-components";
import { MAIN_HEADER_HEIGHT, MAIN_SIDER_WIDTH } from "constant";
// antd
import { Layout } from "antd";

interface Props {
  children?: React.ReactNode;
}

const Content = function ({ children }: Props) {
  return (
    <Container>
      <Contents>{children}</Contents>
    </Container>
  );
};

const Container = styled(Layout.Content)`
  margin-top: ${MAIN_HEADER_HEIGHT};
  margin-left: ${MAIN_SIDER_WIDTH};
  padding: 20px;
  min-height: calc(100vh - 60px);
  overflow: inherit;
`;

const Contents = styled.div`
  border-radius: 2rem;
  background-color: white;
  & > * {
    padding: 1.5rem;
  }
`;

export default Content;
