import React from "react";
import styled from "styled-components";
import { MAIN_HEADER_HEIGHT, MAIN_SIDER_WIDTH } from "constant";
// antd
import { Layout } from "antd";

interface Props {
  children?: React.ReactNode;
  menuVisible: boolean;
}

function Content({ children, menuVisible }: Props) {
  return (
    <StyledContent
      style={{
        marginLeft: menuVisible ? "80px" : MAIN_SIDER_WIDTH,
      }}
    >
      <Contents>{children}</Contents>
    </StyledContent>
  );
}

const StyledContent = styled(Layout.Content)`
  margin-top: ${MAIN_HEADER_HEIGHT};
  padding: 20px;
  min-height: calc(100vh - 60px);
  overflow: inherit;
  transition: margin 0.25s;
`;

const Contents = styled.div`
  background-color: white;
  border-radius: 12px;
  & > * {
    padding: 12px 24px;
  }
`;

export default Content;
