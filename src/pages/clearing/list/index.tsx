import { Helmet } from 'react-helmet';
import { t } from 'i18next';
import { PageHeader } from '@layout/page';
import PageBody from './PageBody';

function ClearingListPage() {
  const title = `${t('turtlechain')} - ${t('clearing.list')}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader title={t('clearing.list')} />
      <PageBody />
    </>
  );
}

export default ClearingListPage;
