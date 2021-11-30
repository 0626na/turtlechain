import React from "react";
import { Layout } from "antd";
import Header from "./Header";
import Sider from "./Sider";
import Content from "./Content";

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

export default MainLayout;
