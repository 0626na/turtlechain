import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import { PageHeader } from '@layout/page';
import PageBody from './PageBody';

function StaffManagementPage() {
  const title = `${t('turtlechain')} - ${t('staff.management')}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader title={t('staff.management')} />
      <PageBody />
    </>
  );
}

export default StaffManagementPage;
