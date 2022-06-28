import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import { PageHeader } from '@layout/main';
import PageBody from './PageBody';

function index() {
  const title = `${t('turtlechain')} - ${t('clearing.balance')}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader title={t('clearing.balance list')} />
      <PageBody />
    </>
  );
}

export default index;
