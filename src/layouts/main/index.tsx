import React, { useState } from "react";
import { Layout } from "antd";
import Header from "./Header";
import Sider from "./Sider";
import Content from "./Content";
import PageHeader from "./page/PageHeader";
import Toolbar from "./page/Toolbar";

interface Props {
  children: React.ReactNode;
}

function MainLayout({ children }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleMenuVisible = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <Layout>
      <Header handleMenuVisible={handleMenuVisible} />
      <Layout>
        <Sider collapsed={menuVisible} />
        <Content menuVisible={menuVisible}>{children}</Content>
      </Layout>
    </Layout>
  );
}

export { MainLayout, PageHeader, Toolbar };
