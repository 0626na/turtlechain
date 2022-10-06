import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import { Button, Form } from 'antd';
import { PhoneAuthForm } from '@components/combine';
import userAPI from '@apis/userAPI';
import React from 'react';
import { TurtleDivider, TurtleText } from '@components/element';
import { css } from '@emotion/react';

function FindIdForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState('');

  // 아이디 리스트 요청
  const getIDQuery = useQuery(
    ['getID', phone, token],
    () => userAPI.getID({ phone, token }),
    {
      enabled: phone && token ? true : false,
    },
  );

  // 요청 데이터 초기화
  useEffect(() => {
    return () => {
      queryClient.removeQueries(['getID', phone, token]);
    };
  }, [queryClient, phone, token]);

  return (
    <>
      <div css={cardCss.self}>
        <TurtleText css={cardCss.title}>{t('find id')}</TurtleText>
        <TurtleText css={cardCss.subTitle}>
          {!getIDQuery.data
            ? t('description.please phone auth')
            : '고객님의 정보와 일치하는 아이디 목록입니다.'}
        </TurtleText>
      </div>

      <Form layout="vertical">
        {!getIDQuery.data && (
          <PhoneAuthForm
            onSuccess={(data) => {
              const { phone, token } = data;
              setPhone(phone);
              setToken(token);
            }}
          />
        )}

        {getIDQuery.data && (
          <div>
            {getIDQuery.data.map((item) => (
              <div css={itemHeight}>{item.login_id}</div>
            ))}

            <Button
              css={button}
              onClick={() => {
                navigate('/');
              }}
            >
              확인
            </Button>
          </div>
        )}

        <div css={footerCss.self}>
          <Link to="/" css={footerCss.content}>
            {t('login')}
          </Link>
          <TurtleDivider type="vertical" />
          <Link to="/reset-password" css={footerCss.content}>
            {t('reset password')}
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

  // active 상태
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
