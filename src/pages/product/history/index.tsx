import { PageHeader } from '@layout/page';
import { t } from 'i18next';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import PageBody from './PageBody';

function Index() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet title={`${t('helmet.turtleChain')} - ${t('product.history')}`} />
      <PageHeader
        title={t('product.history')}
        onClickBefore={() => {
          navigate('/product/create');
        }}
      />
      <PageBody />
    </>
  );
}

export default Index;
