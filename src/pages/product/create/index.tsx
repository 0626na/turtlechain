import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';
import { PageHeader } from '@layout/page';
import { css } from '@emotion/react';
import { Button } from 'antd';
import { ReactComponent as ListIcon } from '@icons/list.svg';
import { TurtleText } from '@components/element';

function ProductCreate() {
  return (
    <>
      <Helmet title={`${t('helmet.turtleChain')} - ${t('product.create')}`} />
      <PageHeader
        title="상품등록"
        Button={
          <Button css={button}>
            <ListIcon css={icon} />
            <TurtleText>상품목록</TurtleText>
          </Button>
        }
      />
      <PageBody />
    </>
  );
}

// PageHeader
const button = css`
  color: #fff;
  margin-left: 20px;

  border: none;
  background-color: #141720;

  display: flex;
  align-items: center;

  &:hover {
    background-color: #373a41;
  }

  // active 상태
  &.ant-btn:focus {
    background-color: #141720;
  }
`;

const icon = css`
  margin-right: 8px;
`;

export default ProductCreate;
