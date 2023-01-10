import React from 'react';
import { PageHeader } from '@layout/page';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';

function index() {
  return (
    <>
      <Helmet title={`${t('turtleChain')} - ${t('title.orderCreate')}`} />
      <PageHeader title={`${t('title.orderDetail')}`} />
      <PageBody />
    </>
  );
}

export default index;
