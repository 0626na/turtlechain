import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';

function index() {
  return (
    <>
      <Helmet title={`${t('turtleChain')} - ${t('title.home')}`} />
      <PageBody />
    </>
  );
}
export default index;
