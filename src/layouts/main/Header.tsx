import styled from "styled-components";
import { useHistory } from "react-router-dom";
import useLogout from "hooks/useLogout";
import { MAIN_HEADER_HEIGHT } from "constant";
// antd
import { MenuOutlined, DownOutlined, LogoutOutlined } from "@ant-design/icons";
import { Layout, Button, Avatar, Menu, Dropdown, Col, Row, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { Notification } from "components/combine";
import { useQuery } from "react-query";
import { userAPI } from "apis";
import { AxiosError } from "axios";

interface Props {
  handleMenuVisible: () => void;
}

function Header({ handleMenuVisible }: Props) {
  const history = useHistory();
  const logout = useLogout();

  const getQuery = useQuery("getUser", userAPI.get, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

  return (
    <StyledHeader>
      <Row gutter={8} justify="space-between" align="middle">
        <Col>
          <Button
            type="link"
            icon={<MenuOutlined style={{ color: "#FFFFFF" }} />}
            onClick={handleMenuVisible}
          />
          <StyledImage
            src={`${process.env.PUBLIC_URL}/assets/img/new_logo_main.png`}
            alt="logo"
            onClick={() => history.push("/home")}
          />
        </Col>
        <Col style={{ display: "flex" }}>
          <Notification />
          <Avatar
            icon={<UserOutlined style={{ color: "#141720" }} />}
            style={{ background: "#AAE7DC", top: 6 }}
            size="small"
          />
          <Dropdown
            overlay={
              <Menu>
                <Button //
                  type="text"
                  onClick={logout}
                  icon={<LogoutOutlined />}
                >
                  {t("logout")}
                </Button>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button icon={<DownOutlined />} type="text" style={{ color: "#FFFFFF" }}>
              {`${getQuery.data?.login_id ?? ""} 님`}
            </Button>
          </Dropdown>
        </Col>
      </Row>
    </StyledHeader>
  );
}

const StyledHeader = styled(Layout.Header)`
  height: ${MAIN_HEADER_HEIGHT};
  position: fixed;
  z-index: 1;
  width: 100%;
  padding-left: 16px;
`;

const StyledImage = styled.img`
  height: 14px;
  margin: 8px;
  cursor: pointer;
`;

export default Header;
