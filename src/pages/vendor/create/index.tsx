import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';

import PageBody from './PageBody';

function VendorCreatePage() {
  return (
    <>
      <Helmet title={`${t('turtleChain')} - ${t('vendor.create')}`} />

      <PageBody />
    </>
  );
}

export default VendorCreatePage;
