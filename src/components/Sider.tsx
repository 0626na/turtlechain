import styled from "styled-components";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Layout, Menu } from "antd";
import { MY_PAGE, MY_INFORMATION } from "constant/string";

const menu = [
  {
    title: "HOME",
    url: "/home",
    submenu: null,
  },
  {
    title: MY_PAGE,
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

  const handleClick = (url: null | string) => {
    if (url && url !== selectedKeys) {
      history.push(url);
      setSelectedKeys(history.location.pathname);
    }
  };

  useEffect(() => {
    setSelectedKeys(history.location.pathname);
  }, [history.location.pathname]);

  return (
    <Container width={200}>
      <Menu mode="inline" selectedKeys={[selectedKeys]}>
        {menu.map((item) => {
          const { title, url, submenu } = item;
          if (submenu) {
            return (
              <Menu.SubMenu key={title} title={title}>
                {submenu.map((item) => {
                  const { title, url } = item;
                  return (
                    <Menu.Item key={url} onClick={() => handleClick(url)}>
                      {title}
                    </Menu.Item>
                  );
                })}
              </Menu.SubMenu>
            );
          } else {
            return (
              <Menu.Item key={url} onClick={() => handleClick(url)}>
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
  background: #fff;
  min-height: calc(100vh - 64px);
`;

export default Sider;
