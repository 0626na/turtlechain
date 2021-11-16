import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { MY_PAGE, MY_INFORMATION } from "constant/string";

const menu: Array<{
  title: string;
  icon: React.ReactNode | null;
  url: string | null;
  submenu: null | Array<{
    title: string;
    url: string;
  }>;
}> = [
  {
    title: "HOME",
    icon: <HomeOutlined />,
    url: "/home",
    submenu: null,
  },
  {
    title: MY_PAGE,
    icon: <UserOutlined />,
    url: null,
    submenu: [
      {
        title: MY_INFORMATION,
        url: "/my/information",
      },
    ],
  },
];

const Sider = function () {
  const history = useHistory();
  const [selectedKeys, setSelectedKeys] = useState(history.location.pathname);

  const handleMenuClick = (url: null | string) => {
    if (url && url !== selectedKeys) {
      history.push(url);
      setSelectedKeys(history.location.pathname);
    }
  };

  useEffect(() => {
    setSelectedKeys(history.location.pathname);
  }, [history.location.pathname]);

  return (
    <Container>
      <Menu mode="inline" theme="dark" selectedKeys={[selectedKeys]}>
        {menu.map((item) => {
          const { title, icon, url, submenu } = item;
          if (submenu) {
            return (
              <Menu.SubMenu key={title} title={title} icon={icon}>
                {submenu.map((item) => {
                  const { title, url } = item;
                  return (
                    <Menu.Item key={url} onClick={() => handleMenuClick(url)}>
                      {title}
                    </Menu.Item>
                  );
                })}
              </Menu.SubMenu>
            );
          } else {
            return (
              <Menu.Item
                key={url}
                onClick={() => handleMenuClick(url)}
                icon={icon}
              >
                {title}
              </Menu.Item>
            );
          }
        })}
      </Menu>
    </Container>
  );
};

const Container = styled(Layout.Sider)`
  width: 200px;
  min-height: calc(100vh - 64px);
`;

export default Sider;
