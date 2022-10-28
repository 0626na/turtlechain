import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import { FindIdPageBody } from '@layout/auth';
import ResetPasswordForm from './ResetPasswordForm';
import React from 'react';
function ResetPassword() {
  const title = `${t('turtleChain')} - ${t('auth.resetPassword')}`;

  return (
    <>
      <Helmet title={title} />
      <FindIdPageBody>
        <ResetPasswordForm />
      </FindIdPageBody>
    </>
  );
}

export default ResetPassword;
