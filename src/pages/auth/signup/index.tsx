import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';
import { SignupPageBody } from '@layout/login';

function index() {
  return (
    <>
      <Helmet title={`${t('turtlechain')} - ${t('signup')}`} />
      <SignupPageBody>
        <PageBody />
      </SignupPageBody>
    </>
  );
}

export default index;
