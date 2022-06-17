import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import { PageHeader } from '@layout/main';
import PageBody from './PageBody';

function MistransferCreatePage() {
  const title = `${t('turtlechain')} - ${t('mistransfer.create')}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t('mistransfer.create')}
        breadcrumbList={[t('mistransfer.management'), t('mistransfer.create')]}
      />
      <PageBody />
    </>
  );
}

export default MistransferCreatePage;
