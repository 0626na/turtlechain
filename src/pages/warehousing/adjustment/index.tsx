import { t } from 'i18next';
import React from 'react';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';

function WarehousingAdjustment() {
  return (
    <>
      <Helmet title={`${t('turtleChain')} - ${t('title.adjustment')}`} />

      <PageBody />
    </>
  );
}

export default WarehousingAdjustment;
