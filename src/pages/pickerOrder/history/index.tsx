import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';

import { PageHeader } from '@layout/page';
import PageBody from './PageBody';

function PickerOrderHistory() {
  return (
    <>
      <Helmet title={`${t('helmet.turtleChain')} - ${t('helmet.home')}`} />
      <PageHeader title="" />
      <PageBody />
    </>
  );
}

export default PickerOrderHistory;
