import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import { PageHeader } from '@layout/page';
import { Col, Row } from 'antd';
import ClearingStatusCard from './ClearingStatusCard';
import AdjustmentStatusCard from './AdjustmentStatusCard';
import ClearingChartCard from './ClearingChartCard';
import { css } from '@emotion/react';

function index() {
  return (
    <>
      <Helmet title={`${t('helmet.turtleChain')} - ${t('helmet.home')}`} />
      <PageHeader title="" />

      <div css={container}>
        <Row
          css={css`
            height: 253px;
          `}
        >
          <ClearingStatusCard />
        </Row>
        <Row gutter={12}>
          <Col span={7}>
            <AdjustmentStatusCard />
          </Col>
          <Col span={17}>
            <ClearingChartCard />
          </Col>
        </Row>
      </div>
    </>
  );
}

const container = css`
  padding: 40px 36px 0px 36px;
`;

export default index;
