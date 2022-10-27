import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';

import { AlertBar } from '@layout/page';
import PageBody from './PageBody';

function Index() {
  return (
    <>
      <Helmet
        title={`${t('turtleChain')} - ${t('retailer')} - ${t(
          'clearing.balance.',
        )}`}
      />
      <AlertBar />
      <PageBody />
    </>
  );
}

export default Index;
