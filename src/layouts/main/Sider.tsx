import styled from "styled-components";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import { t } from "i18next";
import { TurtleImg } from "components/common";

interface Props {
  collapsed: boolean;
}

function Sider({ collapsed }: Props) {
  const history = useHistory();
  const { pathname } = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, selectKeys] = useState(pathname);

  // pathname 이용하여 주소 바뀔 시 메뉴 선택
  useEffect(() => {
    const [, firstKey, secondKey] = pathname.split("/");
    if (firstKey === "home") {
      setOpenKeys([]);
      selectKeys("/home");
      return;
    }
    setOpenKeys([`/${firstKey}`]);
    selectKeys(`/${firstKey}/${secondKey}`);
  }, [pathname]);

  const menus = [
    {
      key: "/warehousing",
      title: t("warehousing.management"),
      submenus: [
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
      key: "/adjustment",
      title: t("adjustment.management"),
      submenus: [
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
      key: "/clearing",
      title: t("clearing.management"),
      submenus: [
        {
          title: t("clearing.create"),
          pathname: "/clearing/create",
        },
        {
          title: t("clearing.list"),
          pathname: "/clearing/list",
        },
        {
          title: t("clearing.balance"),
          pathname: "/clearing/balance",
        },
      ],
    },
    {
      key: "/mistransfer",
      title: t("mistransfer.management"),
      submenus: [
        {
          title: t("mistransfer.create"),
          pathname: "/mistransfer/create",
        },
        {
          title: t("mistransfer.list"),
          pathname: "/mistransfer/list",
        },
      ],
    },
    {
      key: "/vendor",
      title: t("vendor.management"),
      submenus: [
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
      key: "/product",
      title: t("product.management"),
      submenus: [
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
      key: "/setting",
      title: t("setting"),
      submenus: [
        {
          title: t("user.management"),
          pathname: "/setting/user",
        },
        {
          title: t("company.management"),
          pathname: "/setting/company",
        },
        {
          title: t("store.management"),
          pathname: "/setting/store",
        },
        // {
        //   title: t("staff.management"),
        //   pathname: "/setting/staff",
        // },
        // {
        //   title: t("membership.info"),
        //   pathname: "/setting/membership",
        // },
      ],
    },
  ];

  return (
    <StyledSider trigger={null} collapsible collapsed={collapsed}>
      <Menu
        theme="dark"
        mode="inline"
        openKeys={openKeys}
        onOpenChange={(openKeys) => {
          setOpenKeys([openKeys.pop() ?? ""]);
        }}
        selectedKeys={[selectedKeys]}
        onSelect={({ key }) => {
          history.push(key);
        }}
        style={{ height: "100vh" }}
      >
        <Menu.Item
          key="/home"
          icon={
            <div>
              <TurtleImg name="home" />
            </div>
          }
        >
          {t("common.home")}
        </Menu.Item>
        {menus.map(({ key, title, submenus }) => (
          <Menu.SubMenu
            key={key}
            title={title}
            icon={
              <div>
                <TurtleImg name={key.substring(1)} />
              </div>
            }
          >
            {submenus?.map((submenu) => (
              <Menu.Item key={submenu.pathname}>{submenu.title}</Menu.Item>
            ))}
          </Menu.SubMenu>
        ))}
      </Menu>
    </StyledSider>
  );
}

const StyledSider = styled(Layout.Sider)`
  position: fixed;
  top: 60px;
  overflow: auto;
`;

export default Sider;
