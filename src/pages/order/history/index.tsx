import React from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';

function OrderHistoryPage() {
  return (
    <>
      <Helmet
        title={`${t('turtleChain')} - ${t('retailer')} - ${t('order.history')}`}
      />
      <PageBody />
    </>
  );
}

export default OrderHistoryPage;
