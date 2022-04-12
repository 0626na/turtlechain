import { Card } from "antd";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
}

function LoginPageBody({ children }: Props) {
  return (
    <Container>
      <StyledCard>{children}</StyledCard>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fbfcfd;
`;

const StyledCard = styled(Card)`
  padding: 80px 40px;
  background: #ffffff;
  box-shadow: 0px 10px 30px rgba(41, 77, 119, 0.08);
  border-radius: 4px;
  border: none;
`;

export default LoginPageBody;
