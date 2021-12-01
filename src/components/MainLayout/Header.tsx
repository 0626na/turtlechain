import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import useLogout from "hooks/useLogout";
import { MAIN_HEADER_HEIGHT } from "constant";
// antd
import { MenuOutlined, DownOutlined, LogoutOutlined } from "@ant-design/icons";
import { Layout, Button, Avatar, Menu, Dropdown } from "antd";

const Header = function () {
  const { t } = useTranslation();
  const history = useHistory();
  const { logout } = useLogout();

  const menu = (
    <Menu>
      <Button //
        type="link"
        onClick={logout}
        icon={<LogoutOutlined />}
      >
        {t("logout")}
      </Button>
    </Menu>
  );

  return (
    <Container>
      <div>
        <Button type="link" icon={<MenuOutlined />} />
        <LogoImage
          src={`${process.env.PUBLIC_URL}/assets/img/logo_h.png`}
          alt="logo"
          onClick={() => history.push("/home")}
        />
      </div>
      <div>
        <Avatar />
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button type="link">
            {t("turtlechain")}
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    </Container>
  );
};

const Container = styled(Layout.Header)`
  width: 100%;
  height: ${MAIN_HEADER_HEIGHT};
  position: fixed;
  top: 0;
  background-color: #fff;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
`;

const LogoImage = styled.img`
  width: 80px;
  cursor: pointer;
`;

export default Header;
