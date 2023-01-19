import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { css } from '@emotion/react';
import { TertiaryButton } from '@components/element';

import React from 'react';

interface Props {
  children: React.ReactNode;
}

function CompletedLayout({ children }: Props) {
  const navigate = useNavigate();

  const GoLogin = () => {
    navigate('/');
  };

  return (
    <section css={container}>
      <img
        src={`${process.env.PUBLIC_URL}/assets/img/approve.png`}
        alt="approve"
      />
      {children}
      <TertiaryButton text={t('button.go login')} onClick={GoLogin} />
    </section>
  );
}

const container = css({
  width: 460,
  position: 'absolute',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%,-50%)',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export default CompletedLayout;
