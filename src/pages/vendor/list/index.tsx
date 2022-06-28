import { Helmet } from 'react-helmet';
import { t } from 'i18next';
import { PageHeader } from '@layout/main';
import PageBody from './PageBody';

function VendorListPage() {
  const title = `${t('turtlechain')} - ${t('vendor.list')}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader title={t('vendor.list')} />
      <PageBody />
    </>
  );
}

export default VendorListPage;
