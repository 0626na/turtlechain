import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import { t } from "i18next";
import { TurtleImg } from "components/common";

type MenuType = Array<{
  title: string;
  pathname?: string;
  icon?: React.ReactNode;
  submenu?: Array<{
    title: string;
    pathname: string;
  }>;
}>;

interface Props {
  collapsed: boolean;
}

function Sider({ collapsed }: Props) {
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
      title: t("common.home"),
      pathname: "/home",
      icon: (
        <div>
          <TurtleImg //
            type="menu"
            name="home"
          />
        </div>
      ),
    },
    // {
    //   title: t("order.management"),
    //   icon: (
    //     <div>
    //       <TurtleImg //
    //         type="menu"
    //         name="order"
    //       />
    //     </div>
    //   ),
    //   submenu: [
    //     {
    //       title: t("order.create"),
    //       pathname: "/order/create",
    //     },
    //     {
    //       title: t("order.list"),
    //       pathname: "/order/list",
    //     },
    //   ],
    // },
    // {
    //   title: t("sample_return.management"),
    //   icon: (
    //     <div>
    //       <TurtleImg type="menu" name="sample_return" />
    //     </div>
    //   ),
    //   submenu: [
    //     {
    //       title: t("sample_return.create"),
    //       pathname: "/sample_return/create",
    //     },
    //     {
    //       title: t("sample_return.list"),
    //       pathname: "/sample_return/list",
    //     },
    //   ],
    // },
    {
      title: t("warehousing.management"),
      icon: (
        <div>
          <TurtleImg type="menu" name="warehousing" />
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
          <TurtleImg type="menu" name="adjustment" />
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
      title: t("clearing.management"),
      icon: (
        <div>
          <TurtleImg type="menu" name="clearing" />
        </div>
      ),
      submenu: [
        {
          title: t("clearing.create"),
          pathname: "/clearing/create",
        },
        {
          title: t("clearing.list"),
          pathname: "/clearing/list",
        },
      ],
    },
    {
      title: t("product.management"),
      icon: (
        <div>
          <TurtleImg type="menu" name="product" />
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
          <TurtleImg type="menu" name="vendor" />
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
          <TurtleImg //
            type="menu"
            name="setting"
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
        {
          title: t("staff.info"),
          pathname: "/my/staff",
        },
        {
          title: t("membership.info"),
          pathname: "/my/membership",
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
              <Menu.Item key={pathname} onClick={() => handleMenuClick(pathname)} icon={icon}>
                {title}
              </Menu.Item>
            );
          }
        })}
      </Menu>
    </StyledSider>
  );
}

const StyledSider = styled(Layout.Sider)`
  position: fixed;
  top: 60px;
  overflow: auto;

  .ant-menu-submenu .ant-menu-submenu-title {
    height: 54px;
    margin-top: 0;
    margin-bottom: 0;
  }

  .ant-menu-submenu .ant-menu-item {
    height: 54px;
    margin-top: 0;
    margin-bottom: 0;
  }
`;

export default Sider;
