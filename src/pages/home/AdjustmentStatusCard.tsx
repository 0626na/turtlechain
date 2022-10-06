import React from 'react';
import moment from 'moment';
import { useQuery } from 'react-query';
import { Card, Col, Divider, Row, Tag, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';
import adjustmentAPI from '@apis/adjustmentAPI';
import { css } from '@emotion/react';

function AdjustmentStatusCard() {
  // 매입조정 리스트 요청
  const getAdjustmentListQuery = useQuery(['getAdjustmentList'], () =>
    adjustmentAPI.getList({
      is_cleared: '',
      start_date: moment().startOf('month').format('YYYY-MM-DD'),
      end_date: moment().endOf('month').format('YYYY-MM-DD'),
      rt_store_id: null,
    }),
  );

  return (
    <div
      css={css`
        padding-right: 24px;
      `}
    >
      <Row justify="space-between" style={{ paddingBottom: 24 }}>
        <Col>
          <Typography.Title style={{ fontSize: 18 }}>
            매입조정 현황
          </Typography.Title>
        </Col>
        <Col>
          <Typography.Text type="secondary">
            {moment().format('YYYY-MM')}
          </Typography.Text>
        </Col>
      </Row>

      <Row style={{ marginTop: 12, marginBottom: 30 }} align="middle">
        {[
          {
            color: 'orange',
            title: '대기',
            count:
              getAdjustmentListQuery.data?.data.adjustment_summary?.not_cleared
                .count ?? 0,
            price:
              getAdjustmentListQuery.data?.data.adjustment_summary?.not_cleared
                .price ?? 0,
          },
          {
            color: 'geekblue',
            title: '마감',
            count:
              getAdjustmentListQuery.data?.data.adjustment_summary?.cleared
                .count ?? 0,
            price:
              getAdjustmentListQuery.data?.data.adjustment_summary?.cleared
                .price ?? 0,
          },
        ].map(({ color, title, count, price }, index) => (
          <React.Fragment key={index}>
            <Col span={11}>
              <Card size="small" bordered={false}>
                <Row justify="center">
                  <Tag color={color} style={{ margin: 4 }}>
                    {title}
                  </Tag>
                </Row>
                <Meta
                  title={
                    <>
                      <span style={{ fontSize: 40 }}>{count ?? 0}</span>
                      <span style={{ fontSize: 20, marginLeft: 4 }}>건</span>
                    </>
                  }
                  description={`${(price ?? 0).toLocaleString()}원`}
                  style={{ textAlign: 'center', margin: '12px 0' }}
                />
              </Card>
            </Col>
            {index === 0 && (
              <Divider
                type="vertical"
                style={{ height: 50, color: '#DCE0E4' }}
              />
            )}
          </React.Fragment>
        ))}
      </Row>
    </div>
  );
}

export default AdjustmentStatusCard;
