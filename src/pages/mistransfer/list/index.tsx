import { t } from 'i18next';
import { PageHeader } from '@layout/main';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';

function MistransferListPage() {
  const title = `${t('turtlechain')} - ${t('mistransfer.list')}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader title={t('mistransfer.list')} />
      <PageBody />
    </>
  );
}

export default MistransferListPage;
