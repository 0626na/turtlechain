import React from 'react';
import { t } from 'i18next';
import { LoginPageBody } from '@layout/login';
import { Helmet } from 'react-helmet';
import LoginForm from './LoginForm';

function LoginPage() {
  const title = `${t('helmet.turtleChain')} - ${t('auth.login')}`;

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
