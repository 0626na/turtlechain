import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import useLogout from "hooks/useLogout";
import { MAIN_HEADER_HEIGHT } from "constant";
// antd
import { MenuOutlined, DownOutlined, LogoutOutlined } from "@ant-design/icons";
import { Layout, Button, Avatar, Menu, Dropdown, Col, Row } from "antd";

const Header = function () {
  const { t } = useTranslation();
  const history = useHistory();
  const { logout } = useLogout();

  const menu = (
    <Menu>
      <Button //
        type="text"
        onClick={logout}
        icon={<LogoutOutlined />}
      >
        {t("logout")}
      </Button>
    </Menu>
  );

  return (
    <Container>
      <Row gutter={8} justify="space-between">
        <Col>
          <Button type="link" icon={<MenuOutlined />} />
          <LogoImage
            src={`${process.env.PUBLIC_URL}/assets/img/logo_h.png`}
            alt="logo"
            onClick={() => history.push("/home")}
          />
        </Col>
        <Col>
          <Avatar src="https://joeschmoe.io/api/v1/random" />
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="text">
              {t("turtlechain")}
              <DownOutlined />
            </Button>
          </Dropdown>
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled(Layout.Header)`
  width: 100%;
  height: ${MAIN_HEADER_HEIGHT};
  position: fixed;
  z-index: 1;
  top: 0;
  background-color: #fff;
`;

const LogoImage = styled.img`
  width: 6rem;
  margin: 1rem;
  cursor: pointer;
`;

export default Header;
