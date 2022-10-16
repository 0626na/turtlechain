import React from 'react';
import { t } from 'i18next';
import { LoginPageBody } from '@layout/auth';
import { Helmet } from 'react-helmet';
import LoginForm from './LoginForm';

function LoginPage() {
  const title = `${t('turtleChain')} - ${t('auth.login')}`;

  return (
    <>
      <Helmet title={title} />
      <LoginPageBody>
        <LoginForm />
      </LoginPageBody>
    </>
  );
}

export default LoginPage;
