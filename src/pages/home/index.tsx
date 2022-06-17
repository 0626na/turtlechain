import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import { Col, Row, Typography } from 'antd';
import { TurtleCardHome, TurtleInfo } from '@components/common';
import ClearingStatusCard from './ClearingStatusCard';
import ClearingChartCard from './ClearingChartCard';
import AdjustmentStatusCard from './AdjustmentStatusCard';

const HomePage = function () {
  const title = `${t('turtlechain')} - ${t('common.home')}`;

  return (
    <>
      <Helmet title={title} />

      <TurtleCardHome>
        <Typography.Title level={4} style={{ marginBottom: 0 }}>
          HOME
        </Typography.Title>
        <TurtleInfo>{t('description.check home')}</TurtleInfo>
      </TurtleCardHome>

      <Row>
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
    </>
  );
};

export default HomePage;
