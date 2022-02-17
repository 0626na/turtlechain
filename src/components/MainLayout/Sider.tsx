import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout, Menu } from "antd";
import TurtleIcon from "components/common/TurtleIcon";

type MenuType = Array<{
  title: string;
  pathname?: string;
  icon?: React.ReactNode;
  submenu?: Array<{
    title: string;
    pathname: string;
  }>;
}>;

type Props = {
  collapsed: boolean;
};

const Sider = function ({ collapsed }: Props) {
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
          <TurtleIcon //
            src={`${process.env.PUBLIC_URL}/assets/svg/home.svg`}
            alt="home"
          />
        </div>
      ),
    },
    {
      title: t("order.management"),
      icon: (
        <div>
          <TurtleIcon //
            src={`${process.env.PUBLIC_URL}/assets/svg/order.svg`}
            alt="order"
          />
        </div>
      ),
      submenu: [
        {
          title: t("order.create"),
          pathname: "/order/create",
        },
        {
          title: t("order.list"),
          pathname: "/order/list",
        },
      ],
    },
    {
      title: t("sample return.management"),
      icon: (
        <div>
          <TurtleIcon
            src={`${process.env.PUBLIC_URL}/assets/svg/sample-return.svg`}
            alt="sample return"
          />
        </div>
      ),
      submenu: [],
    },
    {
      title: t("warehousing.management"),
      icon: (
        <div>
          <TurtleIcon
            src={`${process.env.PUBLIC_URL}/assets/svg/warehousing.svg`}
            alt="warehousing"
          />
        </div>
      ),
      submenu: [
        {
          title: t("warehousing.create"),
          pathname: "/warehousing/create",
        },
        {
          title: t("warehousing.list"),
          pathname: "/warehousing/list",
        },
      ],
    },
    {
      title: t("adjustment.management"),
      icon: (
        <div>
          <TurtleIcon
            src={`${process.env.PUBLIC_URL}/assets/svg/adjustment.svg`}
            alt="adjustment"
          />
        </div>
      ),
      submenu: [
        {
          title: t("adjustment.create"),
          pathname: "/adjustment/create",
        },
        {
          title: t("adjustment.list"),
          pathname: "/adjustment/list",
        },
      ],
    },
    {
      title: t("settlement.management"),
      icon: (
        <div>
          <TurtleIcon
            src={`${process.env.PUBLIC_URL}/assets/svg/settlement.svg`}
            alt="settlement"
          />
        </div>
      ),
      submenu: [],
    },
    {
      title: t("product.management"),
      icon: (
        <div>
          <TurtleIcon src={`${process.env.PUBLIC_URL}/assets/svg/product.svg`} alt="product" />
        </div>
      ),
      submenu: [
        {
          title: t("product.create"),
          pathname: "/product/create",
        },
        {
          title: t("product.list"),
          pathname: "/product/list",
        },
      ],
    },
    {
      title: t("vendor.management"),
      icon: (
        <div>
          <TurtleIcon src={`${process.env.PUBLIC_URL}/assets/svg/vendor.svg`} alt="vendor" />
        </div>
      ),
      submenu: [
        {
          title: t("vendor.create"),
          pathname: "/vendor/create",
        },
        {
          title: t("vendor.list"),
          pathname: "/vendor/list",
        },
      ],
    },
    {
      title: t("setting"),
      icon: (
        <div>
          <TurtleIcon //
            src={`${process.env.PUBLIC_URL}/assets/svg/setting.svg`}
            alt="setting"
          />
        </div>
      ),
      submenu: [
        {
          title: t("account.my"),
          pathname: "/my/account",
        },
        {
          title: t("biz.info"),
          pathname: "/my/company",
        },
        {
          title: t("store.info"),
          pathname: "/my/store",
        },
      ],
    },
  ];

  return (
    <StyledSider trigger={null} collapsible collapsed={collapsed}>
      <Menu //
        mode="inline"
        selectedKeys={[selectedKeys]}
        style={{ height: "calc(100vh - 60px)", padding: "1.5rem 0" }}
      >
        {menu.map((item) => {
          const { title, icon, pathname, submenu } = item;
          if (submenu) {
            return (
              <Menu.SubMenu key={title} title={title} icon={icon}>
                {submenu.map((item) => {
                  const { title, pathname } = item;
                  return (
                    <Menu.Item key={pathname} onClick={() => handleMenuClick(pathname)}>
                      {title}
                    </Menu.Item>
                  );
                })}
              </Menu.SubMenu>
            );
          } else {
            return (
              <Menu.Item key={title} onClick={() => handleMenuClick(pathname)} icon={icon}>
                {title}
              </Menu.Item>
            );
          }
        })}
      </Menu>
    </StyledSider>
  );
};

const StyledSider = styled(Layout.Sider)`
  position: fixed;
  top: 60px;
  overflow: auto;
  /*
  background: ${({ theme }) => theme.background};
  box-shadow: 10px 10px 10px #e5e5e5;
  min-width: 240px !important;
  */
`;

export default Sider;
