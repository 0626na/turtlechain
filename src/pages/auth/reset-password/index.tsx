import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import { LoginPageBody } from '@layout/login';
import ResetPasswordForm from './ResetPasswordForm';

function FindIdPage() {
  const title = `${t('turtlechain')} - ${t('reset password')}`;

  return (
    <>
      <Helmet title={title} />
      <LoginPageBody>
        <ResetPasswordForm />
      </LoginPageBody>
    </>
  );
}

export default FindIdPage;
