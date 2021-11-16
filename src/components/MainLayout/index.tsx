import React from "react";
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
        <Layout.Content
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 20,
          }}
        >
          {content}
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
