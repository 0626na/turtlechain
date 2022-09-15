import { AlertBar } from '@layout/page';
import { t } from 'i18next';
import React from 'react';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';

function WarehousingAdjustment() {
  return (
    <>
      <Helmet
        title={`${t('helmet.turtleChain')} - ${t('warehousing.adjustment')}`}
      />
      <AlertBar />
      <PageBody />
    </>
  );
}

export default WarehousingAdjustment;
