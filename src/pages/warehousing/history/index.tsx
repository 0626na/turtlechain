import React from 'react';
import { PageHeader } from '@layout/page';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';

function WarehousingCreatePage() {
  return (
    <>
      <Helmet
        title={`${t('helmet.turtleChain')} - ${t('warehousing.history')}`}
      />
      <PageHeader title={t('warehousing.history')} />
      <PageBody />
    </>
  );
}

export default WarehousingCreatePage;
