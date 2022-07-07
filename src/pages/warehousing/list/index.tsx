import { Helmet } from 'react-helmet';
import { t } from 'i18next';
import { PageHeader } from '@layout/page';
import PageBody from './PageBody';

function WarehousingListPage() {
  const title = `${t('turtlechain')} - ${t('warehousing list')}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader title={t('warehousing list')} />
      <PageBody />
    </>
  );
}

export default WarehousingListPage;
