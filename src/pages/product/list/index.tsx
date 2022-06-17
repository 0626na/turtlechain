import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import { PageHeader } from '@layout/main';
import PageBody from './PageBody';

function ProductListPage() {
  const title = `${t('turtlechain')} - ${t('product.list')}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t('product.list')}
        breadcrumbList={[t('product.management'), t('product.list')]}
      />
      <PageBody />
    </>
  );
}

export default ProductListPage;
