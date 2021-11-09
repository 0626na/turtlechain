import styled from "styled-components";
import { Layout, Menu } from "antd";

const Sider = function () {
  return (
    <Container width={200}>
      <Menu mode="inline"></Menu>
    </Container>
  );
};

const Container = styled(Layout.Sider)`
  background: #fff;
  min-height: calc(100vh - 64px);
`;

export default Sider;
