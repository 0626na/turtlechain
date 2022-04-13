import React from "react";
import styled from "styled-components";
import { MAIN_HEADER_HEIGHT, MAIN_SIDER_WIDTH } from "constant";
// antd
import { Layout } from "antd";
import { useLocation } from "react-router-dom";

interface Props {
  children?: React.ReactNode;
  menuVisible: boolean;
}

function Content({ children, menuVisible }: Props) {
  const location = useLocation();

  return (
    <StyledContent
      style={{
        marginLeft: menuVisible ? "80px" : MAIN_SIDER_WIDTH,
      }}
    >
      {location.pathname.includes("/home") ? (
        <HomeBox>{children}</HomeBox>
      ) : (
        <Contents>{children}</Contents>
      )}
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

const HomeBox = styled.div`
  & > * {
    margin: 12px 0px;
  }
`;

const Contents = styled.div`
  background-color: white;
  border-radius: 12px;
  & > * {
    padding: 12px 24px;
  }
`;

export default Content;
