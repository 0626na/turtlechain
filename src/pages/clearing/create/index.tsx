import { PageHeader } from '@layout/page';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';
import React from 'react';

function ClearingCreatePage() {
  return (
    <>
      <Helmet title={`${t('helmet.turtleChain')} - ${t('clearing.create')}`} />
      <PageHeader title={t('clearing.create')} />
      <PageBody />
    </>
  );
}

export default ClearingCreatePage;
