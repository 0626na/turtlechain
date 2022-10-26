import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';

import { PageHeader } from '@layout/page';
import PageBody from './PageBody';

function PickerVendor() {
  return (
    <>
      <Helmet title={`${t('turtleChain')} - ${t('vendor.history')}`} />
      <PageHeader title="거래처 목록" />
      <PageBody />
    </>
  );
}

export default PickerVendor;
