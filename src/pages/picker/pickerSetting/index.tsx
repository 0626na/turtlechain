import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';

import { PageHeader } from '@layout/page';
import PageBody from './PageBody';

function PickerSetting() {
  return (
    <>
      <Helmet
        title={`${t('turtleChain')} - ${t('picker')}- ${t('etc.setting')}`}
      />
      <PageHeader title="설정" />
      <PageBody />
    </>
  );
}

export default PickerSetting;
