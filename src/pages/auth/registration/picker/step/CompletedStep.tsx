import { css } from '@emotion/react';
import { theme } from '@styles/theme';

import React from 'react';

import CompletedLayout from '@layout/auth/CompletedLayout';
import { t } from 'i18next';

function CompletedStep() {
  return (
    <CompletedLayout>
      <h1 css={title}>{t('message.success apply for registration')}</h1>
      <p css={description}>
        {t(
          'description.Thank you. The result mail will be sent to the email address',
        )}
        <br /> {t('description.enjoy turtlechain service after approve')}
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
