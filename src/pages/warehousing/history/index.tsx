import React from 'react';
import { PageHeader } from '@layout/page';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';

function WarehousingCreatePage() {
  return (
    <>
      <Helmet
        title={`${t('turtleChain')} - ${t('title.history warehousing')}`}
      />
      <PageHeader title={t('title.history warehousing')} />
      <PageBody />
    </>
  );
}

export default WarehousingCreatePage;
