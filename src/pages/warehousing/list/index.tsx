import { Helmet } from 'react-helmet';
import { t } from 'i18next';
import { PageHeader } from '@layout/main';
import PageBody from './PageBody';

function WarehousingListPage() {
  const title = `${t('turtlechain')} - ${t('warehousing list')}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t('warehousing list')}
        breadcrumbList={[t('warehousing management'), t('warehousing list')]}
      />
      <PageBody />
    </>
  );
}

export default WarehousingListPage;
