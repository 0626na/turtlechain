import React from 'react';
import { t } from 'i18next';
import { LoginPageBody } from '@layout/auth';
import { Helmet } from 'react-helmet';
import LoginForm from './LoginForm';
import useModal from '@hooks/useModal';

function LoginPage() {
  const title = `${t('turtleChain')} - ${t('description.login')}`;
  const [visible, open, close] = useModal(true);

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
