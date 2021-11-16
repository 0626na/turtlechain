import React from "react";
import { Layout } from "antd";
import Header from "./Header";
import Sider from "./Sider";

interface Props {
  content?: React.ReactNode;
}

const MainLayout = function ({ content }: Props) {
  const headerHeight = 70;
  const siderWidth = 200;

  return (
    <Layout>
      <Header headerHeight={headerHeight} />
      <Layout>
        <Sider headerHeight={headerHeight} siderWidth={siderWidth} />
        <Layout.Content
          style={{
            marginTop: headerHeight,
            marginLeft: siderWidth,
            backgroundColor: "#fff",
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
