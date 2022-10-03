import { useLogin } from '@hooks/index';
import { Navigate } from 'react-router-dom';

import { css } from '@emotion/react';
import React from 'react';

interface Props {
  children?: React.ReactNode;
}

function SignupPageBody({ children }: Props) {
  const { isLogin } = useLogin();

  if (isLogin) {
    return <Navigate to="/home" replace={true} />;
  }

  return <div css={container}>{children}</div>;
}

const container = css({
  width: 720,
  height: '100vh',
  margin: '20px auto 0px',
});

export default SignupPageBody;
