import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import React from 'react';
import { PageHeader } from '@layout/page';
import PageBody from './PageBody';

function ClearingCreatePage() {
  return (
    <>
      <Helmet title={`${t('turtleChain')} - ${t('title.history clearing')}`} />
      <PageHeader title={t('title.history clearing')} />
      <PageBody />
    </>
  );
}

export default ClearingCreatePage;
