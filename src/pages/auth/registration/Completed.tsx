import { t } from 'i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { css } from '@emotion/react';
import { TertiaryButton } from '@components/element';

import React from 'react';

import { theme } from '@styles/theme';

interface Props {
  visible: boolean;
}

function Completed({ visible }: Props) {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const onClickGoHome = () => {
    navigate('/');
  };

  return (
    <>
      {visible && (
        <section css={completedCss.container}>
          <img
            src={`${process.env.PUBLIC_URL}/assets/img/approve.png`}
            alt="approve"
          />
          <h1 css={completedCss.title}>{t('message.success registration')}</h1>
          <p css={completedCss.description}>
            {`${params.get('user_name')}`}님, 터틀체인 신규가입을 환영합니다!
            <br /> 지금 바로 터틀체인의 다양한 서비스를 이용해보세요.
          </p>

          <TertiaryButton text={t('go login')} onClick={onClickGoHome} />
        </section>
      )}
    </>
  );
}

const completedCss = {
  container: css({
    width: 460,
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%,-50%)',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }),

  title: css({
    marginTop: 32,
    color: theme.grey800,
    fontWeight: 700,
    fontSize: 26,
  }),

  description: css({
    marginTop: 16,
    marginBottom: 60,
    lineHeight: 1.8,
    fontWeight: 400,
    fontSize: 14,
    textAlign: 'center',
    color: theme.grey600,
  }),
};

export default Completed;
