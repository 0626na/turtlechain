import React from 'react';
import { css } from '@emotion/react';
import { Card, Col, Row, Statistic } from 'antd';

interface Props {
  value: Array<{ title: React.ReactNode; value: string }>;
}

function TurtleStatistics({ value }: Props) {
  return (
    <Row gutter={16} css={$row}>
      {value.map(({ title, value }) => (
        <Col span={4} key={title?.toString()}>
          <Card css={$card}>
            <Statistic title={title} value={value} />
          </Card>
        </Col>
      ))}
    </Row>
  );
}

const $row = css`
  padding-bottom: 30px;
`;

const $card = css`
  background: #e9f7f9;
  border-radius: 12px;
  border: none;

  .ant-statistic-title {
    color: #00aab5;
  }

  .ant-statistic-content-value {
    font-weight: 700;
    color: #242934;
    font-size: 20px;
  }
`;

export default TurtleStatistics;
