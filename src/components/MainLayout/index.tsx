import React, { useState } from "react";
import { Layout } from "antd";
import Header from "./Header";
import Sider from "./Sider";
import Content from "./Content";

interface Props {
  content?: React.ReactNode;
}

const MainLayout = function ({ content }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleMenuVisible = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <Layout>
      <Header handleMenuVisible={handleMenuVisible} />
      <Layout>
        <Sider collapsed={menuVisible} />
        <Content menuVisible={menuVisible}>{content}</Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
