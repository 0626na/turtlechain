import { t } from 'i18next';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Button } from 'antd';

import userAPI from '@apis/userAPI';
import React from 'react';
import { TurtleText } from '@components/element';
import { css } from '@emotion/react';

function FoundUserList() {
  const navigate = useNavigate();
  const [params, _] = useSearchParams();

  // 아이디 리스트 요청
  const getIDQuery = useQuery(
    ['getID'],
    () =>
      userAPI.getID({
        phone: params.get('phone') ?? '',
        token: params.get('token') ?? '',
      }),
    {
      enabled: !!params.get('phone') && !!params.get('token'),
    },
  );

  const userList = getIDQuery.data;

  return (
    <>
      <div css={cardCss.self}>
        <TurtleText css={cardCss.title}>{t('description.findId')}</TurtleText>
        <TurtleText css={cardCss.subTitle}>
          {t('description.correct id list')}
        </TurtleText>
      </div>

      <ul>
        {userList?.map((item, index) => (
          <li css={itemHeight} key={index}>
            {item.login_id}
          </li>
        ))}
      </ul>
      <Button
        css={button}
        onClick={() => {
          navigate('/');
        }}
      >
        로그인 하러가기
      </Button>
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

const itemHeight = css({
  height: 44,
});

export default FoundUserList;
