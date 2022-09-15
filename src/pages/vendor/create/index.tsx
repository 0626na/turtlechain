import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';

import { AlertBar } from '@layout/page';
import PageBody from './PageBody';

function VendorCreatePage() {
  return (
    <>
      <Helmet title={`${t('helmet.turtleChain')} - ${t('vendor.create')}`} />
      <AlertBar />
      <PageBody />
    </>
  );
}

export default VendorCreatePage;
