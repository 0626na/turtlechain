import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';
import { PageHeader } from '@layout/page';
import { HistoryButton } from '@components/element';

function ProductCreate() {
  return (
    <>
      <Helmet title={`${t('helmet.turtleChain')} - ${t('product.create')}`} />
      <PageHeader
        title="상품등록"
        button={
          <HistoryButton
            text="상품목록"
            onClick={() => {
              alert('상품목록 이동');
            }}
          />
        }
      />
      <PageBody />
    </>
  );
}

export default ProductCreate;
