import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// antd
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
// lang
import { useTranslation } from "react-i18next";

interface Props {
  headerHeight: number;
  siderWidth: number;
}

const Sider = function ({ headerHeight, siderWidth }: Props) {
  const { t } = useTranslation();
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
      title: t("my page"),
      icon: <UserOutlined />,
      url: null,
      submenu: [
        {
          title: t("my account"),
          url: "/my/account",
        },
        {
          title: t("biz info"),
          url: "/my/company",
        },
        {
          title: t("mall info"),
          url: "/my/store",
        },
      ],
    },
  ];

  return (
    <Container headerHeight={headerHeight} siderWidth={siderWidth}>
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

const Container = styled(Layout.Sider)<{
  headerHeight: number;
  siderWidth: number;
}>`
  width: ${(props) => `${props.siderWidth}px`};
  height: ${(props) => `calc(100vh - ${props.headerHeight}px)`};
  position: fixed;
  top: ${(props) => `${props.headerHeight}px`};
  left: 0;
  overflow: auto;
`;

export default Sider;
