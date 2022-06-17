import { Helmet } from 'react-helmet';
import { t } from 'i18next';
import { PageHeader } from '@layout/main';
import PageBody from './PageBody';

function WarehousingCreatePage() {
  const title = `${t('turtlechain')} - ${t('warehousing create')}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t('warehousing create')}
        breadcrumbList={[t('warehousing management'), t('warehousing create')]}
        infoList={[t('description.excel type')]}
      />
      <PageBody />
    </>
  );
}

export default WarehousingCreatePage;
