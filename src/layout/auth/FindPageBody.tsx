import { useLogin } from '@hooks/index';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { css } from '@emotion/react';
import { TurtleDivider } from '@components/element';
import { t } from 'i18next';

interface Props {
  children: React.ReactNode;
}

function FindPageBody({ children }: Props) {
  const { isLogin } = useLogin();
  const { pathname } = useLocation();

  if (isLogin) {
    return <Navigate to="/home" replace={true} />;
  }

  const isFindIdPage = pathname.includes('find-id');

  return (
    <div css={Container}>
      <div css={card}>
        {children}
        <div css={footerCss.self}>
          <Link to="/" css={footerCss.content}>
            {t('button.login')}
          </Link>
          <TurtleDivider type="vertical" />
          <Link
            to={isFindIdPage ? '/reset-password' : '/find-id'}
            css={footerCss.content}
          >
            {isFindIdPage
              ? t('button.reset password')
              : t('description.findId')}
          </Link>
        </div>
      </div>
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

const footerCss = {
  self: css({
    fontSize: 14,
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
    marginTop: 60,
  }),

  content: css({
    color: '#6b6d73',
  }),
};

export default FindPageBody;
