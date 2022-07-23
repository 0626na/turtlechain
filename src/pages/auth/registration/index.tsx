import { t } from 'i18next';

import { Helmet } from 'react-helmet';

import PageBody from './PageBody';

import { SignupPageBody } from '@layout/login';

function RegistrationPage() {
  const title = `${t('turtlechain')} - ${t('signup')}`;
  return (
    <>
      <Helmet title={title} />

      <SignupPageBody>
        <PageBody />
      </SignupPageBody>
    </>
  );
}

export default RegistrationPage;
