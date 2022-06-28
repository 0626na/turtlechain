import { t } from 'i18next';
import { PageHeader } from '@layout/main';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';

function UserManagementPage() {
  const title = `${t('turtlechain')} - ${t('user.management')}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader title={t('user.management')} />
      <PageBody />
    </>
  );
}

export default UserManagementPage;
