import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';

import { AlertBar } from '@layout/page';
import PageBody from './PageBody';

function Index() {
  return (
    <>
      <Helmet title={`${t('turtleChain')} - ${t('etc.setting')}`} />
      <PageBody />
    </>
  );
}

export default Index;
