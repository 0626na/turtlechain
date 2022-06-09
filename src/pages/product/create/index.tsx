import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import { PageHeader } from '@layout/main/index';
import PageBody from './PageBody';

function ProductCreatePage() {
  const title = `${t('turtlechain')} - ${t('product.create')}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t('product.create')}
        breadcrumbList={[t('product.management'), t('product.create')]}
        infoList={[t('description.excel type')]}
      />
      <PageBody />
    </>
  );
}

export default ProductCreatePage;
