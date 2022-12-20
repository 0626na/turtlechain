import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';

import { PageHeader } from '@layout/page';
import PageBody from './PageBody';

function PickerSetting() {
  return (
    <>
      <Helmet
        title={`${t('turtleChain')} - ${t('title.picker')}- ${t(
          'title.setting',
        )}`}
      />
      <PageHeader title={t('title.setting')} />
      <PageBody />
    </>
  );
}

export default PickerSetting;
