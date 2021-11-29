import React from "react";
import styled from "styled-components";
import { Layout } from "antd";
import Header from "./Header";
import Sider from "./Sider";

interface Props {
  content?: React.ReactNode;
}

const MainLayout = function ({ content }: Props) {
  return (
    <Layout>
      <Header />
      <Layout>
        <Sider />
        <Content>{content}</Content>
      </Layout>
    </Layout>
  );
};

const Content = styled(Layout.Content)`
  margin-top: 70px;
  margin-left: 200px;
  background-color: white;
  padding: 20px;
`;

export default MainLayout;
