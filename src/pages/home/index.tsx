import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';

function index() {
  return (
    <>
      <Helmet title={`${t('turtleChain')} - ${t('home')}`} />
      <div style={{ fontSize: 30, margin: 30 }}>작업진행중</div>
      {/* <PageBody /> */}
    </>
  );
}
export default index;
