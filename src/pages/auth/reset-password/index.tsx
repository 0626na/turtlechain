import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import { FindPageBody } from '@layout/auth';

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Reset from './Reset';
import { PhoneAuthCard } from '@components/combine';

function ResetPassword() {
  const title = `${t('turtleChain')} - ${t('auth.resetPassword')}`;
  const [params, _] = useSearchParams();

  return (
    <>
      <Helmet title={title} />
      <FindPageBody>
        {params.get('phone') ? (
          <Reset />
        ) : (
          <PhoneAuthCard type="reset-password" />
        )}
      </FindPageBody>
    </>
  );
}

export default ResetPassword;
