import { Card, Col, Row, Tag } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React from 'react';

interface Props {
  value: Array<{
    color: string;
    title: string;
    count: number;
    price: number;
  }>;
}

function TurtleCard({ value }: Props) {
  return (
    <Row gutter={16}>
      {value.map(({ color, title, count, price }) => (
        <Col span={4} key={title}>
          <Card size="small">
            <Row justify="center">
              <Tag color={color} style={{ margin: 4 }}>
                {title}
              </Tag>
            </Row>
            <Meta
              title={
                <>
                  <span style={{ fontSize: 24 }}>{count}</span>건
                </>
              }
              description={`${price.toLocaleString()}원`}
              style={{ textAlign: 'center', margin: '12px 0' }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default TurtleCard;
