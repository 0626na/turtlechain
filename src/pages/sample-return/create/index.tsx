import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import { PageHeader } from '@layout/page';

function SampleReturnCreatePage() {
  const title = `${t('turtlechain')} - ${t('sample_return.create')}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader title={t('sample_return.create')} />
    </>
  );
}

export default SampleReturnCreatePage;
