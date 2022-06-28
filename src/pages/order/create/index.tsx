import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import { PageHeader } from '@layout/main';
import OrderPreviewList from './OrderPreviewList';

const OrderCreatePage = function () {
  const title = `${t('turtlechain')} - ${t('order.create')}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t('order.create')}
        infoList={[t('description.excel type')]}
      />
      <OrderPreviewList />
    </>
  );
};

export default OrderCreatePage;
