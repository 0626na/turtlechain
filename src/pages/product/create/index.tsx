import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';
import { PageHeader } from '@layout/page';
import { HistoryButton } from '@components/element';
import { useNavigate } from 'react-router-dom';

function ProductCreate() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet
        title={`${t('turtleChain')} - ${t('retailer')} - ${t(
          'product.create',
        )}`}
      />
      <PageHeader
        title={t('product.create')}
        button={
          <HistoryButton
            text="상품목록"
            onClick={() => {
              navigate('/product/history');
            }}
          />
        }
      />
      <PageBody />
    </>
  );
}

export default ProductCreate;
