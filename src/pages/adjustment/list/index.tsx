import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import { PageHeader } from '@layout/main';
import PageBody from './PageBody';

const AdjustmentListPage = function () {
  const title = `${t('turtlechain')} - ${t('adjustment list')}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader title={t('adjustment list')} />
      <PageBody />
    </>
  );
};

export default AdjustmentListPage;
