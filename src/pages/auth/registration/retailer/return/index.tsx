import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';

import React from 'react';

function index() {
  return (
    <>
      <Helmet
        title={`${t('turtleChain')} - ${t(
          'description.registrationReturn',
        )}- ${t('title.store')}`}
      />
      <PageBody />
    </>
  );
}

export default index;
