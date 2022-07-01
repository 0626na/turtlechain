import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import { PageHeader } from '@layout/page';

function SampleReturnListPage() {
  const title = `${t('turtlechain')} - ${t('sample_return.list')}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader title={t('sample_return.list')} />
    </>
  );
}

export default SampleReturnListPage;
