import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MAIN_HEADER_HEIGHT, MAIN_SIDER_WIDTH } from "constant";
import { Layout, Menu } from "antd";
import SvgIcon from "components/SvgIcon";

type MenuType = Array<{
  title: string;
  pathname?: string;
  icon?: React.ReactNode;
  submenu?: Array<{
    title: string;
    pathname: string;
  }>;
}>;

const Sider = function () {
  const { t } = useTranslation();
  const history = useHistory();
  const { pathname } = useLocation();
  const [selectedKeys, setSelectedKeys] = useState(pathname);

  const handleMenuClick = (pathname?: string) => {
    if (pathname && pathname !== selectedKeys) {
      history.push(pathname);
      setSelectedKeys(pathname);
    }
  };

  useEffect(() => {
    setSelectedKeys(pathname);
  }, [pathname]);

  const menu: MenuType = [
    {
      title: "HOME",
      pathname: "/home",
      icon: (
        <div>
          <SvgIcon
            src={`${process.env.PUBLIC_URL}/assets/svg/home.svg`}
            alt="home"
          />
        </div>
      ),
    },
    {
      title: t("warehousing management"),
      icon: (
        <div>
          <SvgIcon
            src={`${process.env.PUBLIC_URL}/assets/svg/warehousing.svg`}
            alt="warehousing management"
          />
        </div>
      ),
      submenu: [
        {
          title: t("warehousing create"),
          pathname: "/warehousing/create",
        },
        {
          title: t("warehousing list"),
          pathname: "/warehousing/list",
        },
      ],
    },
    {
      title: t("adjustment management"),
      icon: (
        <div>
          <SvgIcon
            src={`${process.env.PUBLIC_URL}/assets/svg/check-list.svg`}
            alt="adjustment management"
          />
        </div>
      ),
      submenu: [
        {
          title: t("adjustment create"),
          pathname: "/adjustment/create",
        },
        {
          title: t("adjustment list"),
          pathname: "/adjustment/list",
        },
      ],
    },
    {
      title: t("setting"),
      icon: (
        <div>
          <SvgIcon
            src={`${process.env.PUBLIC_URL}/assets/svg/setting.svg`}
            alt="setting"
          />
        </div>
      ),
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
      <Menu //
        mode="inline"
        selectedKeys={[selectedKeys]}
        style={{ height: "calc(100vh - 60px)" }}
      >
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
  width: ${MAIN_SIDER_WIDTH};
  position: fixed;
  top: ${MAIN_HEADER_HEIGHT};
  left: 0;
  overflow: auto;
`;

export default Sider;
