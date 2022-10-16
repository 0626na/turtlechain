import { useLogin } from '@hooks/index';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { css } from '@emotion/react';
import React from 'react';

function RegistrationPageBody() {
  const { isLogin } = useLogin();
  const { pathname } = useLocation();
  console.log(pathname);
  if (isLogin) {
    return <Navigate to="/home" replace={true} />;
  }

  return (
    <div css={container}>
      <div
        css={logoCss.self}
        style={{
          ['--display' as any]: pathname.includes('completed')
            ? 'none'
            : 'flex',
        }}
      >
        <img
          css={logoCss.img}
          src={`${process.env.PUBLIC_URL}/assets/img/background_signup.png`}
          alt="signup_logo"
        />
        <div css={logoCss.container}>
          <span css={logoCss.title}>
            쉽고 똑똑한 <br />
            쇼핑몰 업무의 시작
          </span>
          <span css={logoCss.subTitle}>지금, 터틀체인과 함께해요</span>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

const container = css({
  width: 720,
  height: '100vh',
  margin: '20px auto 0px',
});

const logoCss = {
  self: css({
    position: 'relative',
    height: 100,
    display: 'var(--display)',
    justifyContent: 'center',
  }),

  img: css({
    position: 'absolute',
    height: 100,
  }),

  container: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }),

  title: css({
    fontWeight: 700,
    color: '#141720',
    fontSize: 20,
    textAlign: 'center',
  }),

  subTitle: css({
    fontWeight: 400,
    fontSize: 14,
    color: '#5b5d63',
  }),
};

export default RegistrationPageBody;
