import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';

import { PageHeader } from '@layout/page';
import PageBody from './PageBody';

function PickerOrder() {
  return (
    <>
      <Helmet
        title={`${t('turtleChain')}- ${t('picker')} - ${t('order.create')}`}
      />
      <PageHeader title={t('order.create')} />
      <PageBody />
    </>
  );
}

export default PickerOrder;
