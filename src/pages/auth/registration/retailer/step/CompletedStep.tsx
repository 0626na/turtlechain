import { t } from 'i18next';
import { useSearchParams } from 'react-router-dom';
import { css } from '@emotion/react';
import React from 'react';
import { theme } from '@styles/theme';
import CompletedLayout from '@layout/auth/CompletedLayout';

function CompletedStep() {
  const [searchParams] = useSearchParams();

  return (
    <CompletedLayout>
      <h1 css={title}>{t('message.success registration')}</h1>
      <p css={description}>
        {`${searchParams.get('user_name')}`}
        {t('description.nim')}, {t('description.welcome turtlechain')}
        <br /> {t('description.enjoy turtlechain service')}
      </p>
    </CompletedLayout>
  );
}

const title = css({
  marginTop: 32,
  color: theme.grey800,
  fontWeight: 700,
  fontSize: 26,
});

const description = css({
  marginTop: 16,
  marginBottom: 60,
  lineHeight: 1.8,
  fontWeight: 400,
  fontSize: 14,
  textAlign: 'center',
  color: theme.grey600,
});

export default CompletedStep;
