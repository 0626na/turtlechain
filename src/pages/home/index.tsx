import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';

import { AlertBar } from '@layout/page';
import PageBody from './PageBody';

function index() {
  return (
    <>
      <Helmet title={`${t('helmet.turtleChain')} - ${t('helmet.home')}`} />
      <AlertBar />
      <PageBody />
    </>
  );
}

export default index;
