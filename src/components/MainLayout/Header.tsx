import styled from "styled-components";
import logo from "images/horizontal_logo.png";
import { useHistory } from "react-router-dom";
import useLogout from "hooks/useLogout";
// antd
import { Layout, Button } from "antd";
// lang
import { useTranslation } from "react-i18next";

interface Props {
  headerHeight: number;
}

const Header = function ({ headerHeight }: Props) {
  const { t } = useTranslation();
  const history = useHistory();
  const { logout } = useLogout();

  return (
    <Container headerHeight={headerHeight}>
      <LogoImage src={logo} alt="Logo" onClick={() => history.push("/home")} />
      <Button onClick={logout}>{t("logout")}</Button>
    </Container>
  );
};

const Container = styled(Layout.Header)<{ headerHeight: number }>`
  width: 100%;
  height: ${(props) => `${props.headerHeight}px`};
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
  width: 100px;
  cursor: pointer;
`;

export default Header;
