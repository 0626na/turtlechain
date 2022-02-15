import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import useLogout from "hooks/useLogout";
import { MAIN_HEADER_HEIGHT } from "constant";
// antd
import { MenuOutlined, DownOutlined, LogoutOutlined } from "@ant-design/icons";
import { Layout, Button, Avatar, Menu, Dropdown, Col, Row } from "antd";
import { UserOutlined } from "@ant-design/icons";

interface Props {
  handleMenuVisible: () => void;
}
const Header = function ({ handleMenuVisible }: Props) {
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
          <Button
            type="link"
            icon={<MenuOutlined style={{ color: "#FFFFFF" }} />}
            onClick={handleMenuVisible}
          />
          <LogoImage
            src={`${process.env.PUBLIC_URL}/assets/img/new_logo_main.png`}
            alt="logo"
            //onClick={() => history.push("/home")}
          />
        </Col>
        <Col>
          <Avatar
            icon={<UserOutlined style={{ color: "#141720" }} />}
            style={{ background: "#AAE7DC" }}
            size="small"
          />
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="text" style={{ color: "#FFFFFF", paddingLeft: "12px" }}>
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
  height: ${MAIN_HEADER_HEIGHT};
  position: fixed;
  z-index: 1;
  width: 100%;
  /*
  top: 0;
  */
`;

const LogoImage = styled.img`
  height: 16px;
  margin: 1rem;
  cursor: pointer;
`;

export default Header;
