import React from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';

function OrderHistoryPage() {
  return (
    <>
      <Helmet
        title={`${t('turtleChain')} - ${t('picker')} - ${t('orderDetail')}`}
      />
      <PageBody />
    </>
  );
}

export default OrderHistoryPage;
