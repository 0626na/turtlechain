import { Helmet } from 'react-helmet';
import { t } from 'i18next';
import { PageHeader } from '@layout/main';
import PageBody from './PageBody';

const AdjustmentCreatePage = function () {
  const title = `${t('turtlechain')} - ${t('adjustment create')}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader title={t('adjustment create')} />
      <PageBody />
    </>
  );
};

export default AdjustmentCreatePage;
