import { useLogin } from '@hooks/index';
import { Navigate } from 'react-router-dom';
import { css } from '@emotion/react';

interface Props {
  children: React.ReactNode;
}

function FindIdPageBody({ children }: Props) {
  const { isLogin } = useLogin();

  if (isLogin) {
    return <Navigate to="/home" replace={true} />;
  }

  return (
    <div css={Container}>
      <div css={card}>{children}</div>
    </div>
  );
}

const Container = css({
  width: '100%',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#fbfcfd',
});

const card = css({
  width: 472,
  padding: '80px 60px',
  background: '#ffffff',
  boxShadow: '0px 10px 30px rgba(41, 77, 119, 0.08)',
  borderRadius: '20px',
  border: 'none',
});

export default FindIdPageBody;
