import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import React from 'react';
import { PageHeader } from '@layout/page';
import PageBody from './PageBody';

function ClearingCreatePage() {
  return (
    <>
      <Helmet title={`${t('turtleChain')} - ${t('clearing.history')}`} />
      <PageHeader title={t('clearing.history')} />
      <PageBody />
    </>
  );
}

export default ClearingCreatePage;
