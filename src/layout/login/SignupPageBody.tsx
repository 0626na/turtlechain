import { useLogin } from '@hooks/index';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';

interface Props {
  children?: React.ReactNode;
}

function SignupPageBody({ children }: Props) {
  const { isLogin } = useLogin();

  if (isLogin) {
    return <Navigate to="/home" replace={true} />;
  }

  return <Container>{children}</Container>;
}

const Container = styled.div`
  width: 400px;
  margin: 0 auto;
  padding: 40px 0;
`;

export default SignupPageBody;
