import { Card, Col, Row, Statistic } from 'antd';
import React from 'react';

interface Props {
  value: Array<{ title: React.ReactNode; value: string }>;
}

function TurtleStatistics({ value }: Props) {
  return (
    <Row gutter={16} style={{ paddingBottom: 30 }}>
      {value.map(({ title, value }) => (
        <Col span={4} key={title?.toString()}>
          <Card>
            <Statistic title={title} value={value} />
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default TurtleStatistics;
