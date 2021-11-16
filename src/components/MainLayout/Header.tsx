import styled from "styled-components";
import logo from "images/horizontal_logo.png";
import { useHistory } from "react-router-dom";
import useLogout from "hooks/useLogout";
import { Layout, Button } from "antd";
import { LOGOUT } from "constant/string";

const Header = function () {
  const history = useHistory();
  const { logout } = useLogout();

  return (
    <Container>
      <LogoImage src={logo} alt="Logo" onClick={() => history.push("/home")} />
      <Button onClick={logout}>{LOGOUT}</Button>
    </Container>
  );
};

const Container = styled(Layout.Header)`
  background-color: #fff;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoImage = styled.img`
  width: 100px;
  cursor: pointer;
`;

export default Header;
