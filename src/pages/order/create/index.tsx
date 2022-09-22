import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';
import { PageHeader } from '@layout/page';

function OrderCreate() {
  return (
    <>
      <Helmet title={`${t('helmet.turtleChain')} - ${t('order.create')}`} />
      <PageHeader title={t('order.create')} />
      <PageBody />
    </>
  );
}

export default OrderCreate;
