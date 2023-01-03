import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';

import { PageHeader } from '@layout/page';
import PageBody from './PageBody';

function PickerVendor() {
  return (
    <>
      <Helmet
        title={`${t('turtleChain')} - ${t('title.picker')}- ${t(
          'vendor.history',
        )}`}
      />
      <PageHeader title={t('title.vendor list')} />
      <PageBody />
    </>
  );
}

export default PickerVendor;
