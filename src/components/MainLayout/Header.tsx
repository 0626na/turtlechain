import styled from "styled-components";
import logo from "images/horizontal_logo.png";
import { useHistory } from "react-router-dom";
import useLogout from "hooks/useLogout";
import { Layout, Button } from "antd";
import { LOGOUT } from "constant/string";

interface Props {
  headerHeight: number;
}

const Header = function ({ headerHeight }: Props) {
  const history = useHistory();
  const { logout } = useLogout();

  return (
    <Container headerHeight={headerHeight}>
      <LogoImage src={logo} alt="Logo" onClick={() => history.push("/home")} />
      <Button onClick={logout}>{LOGOUT}</Button>
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
  z-index: 9999;
`;

const LogoImage = styled.img`
  width: 100px;
  cursor: pointer;
`;

export default Header;
