import { t } from 'i18next';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Button, Form } from 'antd';
import { PhoneAuthForm } from '@components/combine';
import userAPI from '@apis/userAPI';
import React from 'react';
import { TurtleDivider, TurtleText } from '@components/element';
import { css } from '@emotion/react';

function FindIdForm() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({ phone: '', token: '' });

  // 아이디 리스트 요청
  const getIDQuery = useQuery(
    ['getID', auth],
    () => userAPI.getID({ phone: auth.phone, token: auth.token }),
    {
      enabled: !!auth.phone && !!auth.token,
    },
  );

  return (
    <>
      <div css={cardCss.self}>
        <TurtleText css={cardCss.title}>{t('auth.findId')}</TurtleText>
        <TurtleText css={cardCss.subTitle}>
          {!auth.token
            ? t('description.please phone auth')
            : t('description.correct id list')}
        </TurtleText>
      </div>

      <Form layout="vertical">
        {!auth.token && (
          <PhoneAuthForm
            onSuccess={({ phone, token }) => {
              setAuth({ phone, token });
            }}
          />
        )}

        {getIDQuery.data && (
          <div>
            {getIDQuery.data.map((item, index) => (
              <div css={itemHeight} key={index}>
                {item.login_id}
              </div>
            ))}

            <Button
              css={button}
              onClick={() => {
                navigate('/');
              }}
            >
              로그인 하러가기
            </Button>
          </div>
        )}
        <div css={footerCss.self}>
          <Link to="/" css={footerCss.content}>
            {t('button.login')}
          </Link>
          <TurtleDivider type="vertical" />
          <Link to="/reset-password" css={footerCss.content}>
            {t('button.reset password')}
          </Link>
        </div>
      </Form>
    </>
  );
}

const button = css`
  margin: 40px 0px -20px;
  background: #00b3be;
  color: #fff;

  height: 48px;
  width: 100%;
  &:hover {
    color: #fff;
    background: #00b3be;
  }

  &.ant-btn:focus {
    color: #fff;
    background: #00b3be;
  }

  &.ant-btn[disabled] {
    background: #00b3be;
    opacity: 0.5;

    color: #fff;
    border-color: #00b3be;
  }
`;

const cardCss = {
  self: css({
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 40,
  }),

  title: css({
    fontWeight: 700,
    fontSize: 24,
    color: '#141720',
    marginBottom: 16,
  }),

  subTitle: css({
    fontWeight: 400,
    color: '#5b5d63',
  }),
};

const footerCss = {
  self: css({
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
    marginTop: 60,
  }),

  content: css({
    color: '#6b6d73',
  }),
};

const itemHeight = css({
  height: 44,
});

export default FindIdForm;
