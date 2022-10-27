import { AlertBar } from '@layout/page';
import { t } from 'i18next';
import React from 'react';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';

function WarehousingAdjustment() {
  return (
    <>
      <Helmet
        title={`${t('turtleChain')} - ${t('retailer')} - ${t(
          'warehousing.adjustment.',
        )}`}
      />
      <AlertBar />
      <PageBody />
    </>
  );
}

export default WarehousingAdjustment;
