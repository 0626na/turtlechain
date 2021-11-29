import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
// antd
import { HomeOutlined, UserOutlined, InboxOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
// lang
import { useTranslation } from "react-i18next";

const Sider = function () {
  const { t } = useTranslation();
  const history = useHistory();
  const { pathname } = useLocation();

  const [selectedKeys, setSelectedKeys] = useState(pathname);

  const handleMenuClick = (pathname: null | string) => {
    if (pathname && pathname !== selectedKeys) {
      history.push(pathname);
      setSelectedKeys(pathname);
    }
  };

  useEffect(() => {
    setSelectedKeys(pathname);
  }, [pathname]);

  const menu: Array<{
    title: string;
    icon: React.ReactNode | null;
    pathname: string | null;
    submenu: null | Array<{
      title: string;
      pathname: string;
    }>;
  }> = [
    {
      title: "HOME",
      icon: <HomeOutlined />,
      pathname: "/home",
      submenu: null,
    },
    {
      title: t("warehousing management"),
      icon: <InboxOutlined />,
      pathname: null,
      submenu: [
        {
          title: t("warehousing list"),
          pathname: "/warehousing/list",
        },
      ],
    },
    {
      title: t("my page"),
      icon: <UserOutlined />,
      pathname: null,
      submenu: [
        {
          title: t("my account"),
          pathname: "/my/account",
        },
        {
          title: t("biz info"),
          pathname: "/my/company",
        },
        {
          title: t("mall info"),
          pathname: "/my/store",
        },
      ],
    },
  ];

  return (
    <Container>
      <Menu mode="inline" theme="dark" selectedKeys={[selectedKeys]}>
        {menu.map((item) => {
          const { title, icon, pathname, submenu } = item;
          if (submenu) {
            return (
              <Menu.SubMenu key={title} title={title} icon={icon}>
                {submenu.map((item) => {
                  const { title, pathname } = item;
                  return (
                    <Menu.Item
                      key={pathname}
                      onClick={() => handleMenuClick(pathname)}
                    >
                      {title}
                    </Menu.Item>
                  );
                })}
              </Menu.SubMenu>
            );
          } else {
            return (
              <Menu.Item
                key={pathname}
                onClick={() => handleMenuClick(pathname)}
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
  height: calc(100vh - 70px);
  position: fixed;
  top: 70px;
  left: 0;
  overflow: auto;
`;

export default Sider;
