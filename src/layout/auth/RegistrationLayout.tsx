import { useLogin } from '@hooks/index';
import { Navigate, Outlet, useSearchParams } from 'react-router-dom';

import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';

function RegistrationPageBody() {
  const { isLogin } = useLogin();
  const [searchParams] = useSearchParams();
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // 가입 완료 페이지면 로고 이미지 없앤다.
    if (searchParams.get('step') === 'completed') setIsCompleted(true);
  }, [searchParams]);

  if (isLogin) return <Navigate to="/home" replace={true} />;

  return (
    <div css={container}>
      {!isCompleted && (
        <div css={logoCss.self}>
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
      )}
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
    display: 'flex',
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
    lineHeight: 1.4,
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
