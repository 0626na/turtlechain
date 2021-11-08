import styled from "styled-components";
import logo from "images/horizontal_logo.png";
import { useHistory } from "react-router-dom";
import { Layout } from "antd";

const Header = function () {
  const history = useHistory();

  const handleLogoClick = () => {
    history.push("/home");
  };

  return (
    <Container>
      <LogoImage src={logo} alt="Logo" onClick={handleLogoClick} />
    </Container>
  );
};

const Container = styled(Layout.Header)`
  background-color: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img`
  width: 100px;
  cursor: pointer;
`;

export default Header;
