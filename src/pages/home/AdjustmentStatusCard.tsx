import { Col, Row, Typography } from "antd";
import { adjustmentAPI } from "apis";
import { TurtleCardHome } from "components/common";
import moment from "moment";
import React from "react";
import { useQuery } from "react-query";

function AdjustmentStatusCard() {
  // 매입조정 리스트 요청
  const getAdjustmentListQuery = useQuery(["getAdjustmentList"], () =>
    adjustmentAPI.getList({
      is_cleared: 2,
      start_date: moment().startOf("month").format("YYYY-MM-DD"),
      end_date: moment().endOf("month").format("YYYY-MM-DD"),
    }),
  );

  return (
    <TurtleCardHome>
      <Row justify="space-between" style={{ paddingBottom: 24 }}>
        <Col>
          <Typography.Title level={5}>대기 매입조정 현황</Typography.Title>
        </Col>
        <Col>
          <Typography.Text type="secondary">{moment().format("MM")} 월</Typography.Text>
        </Col>
      </Row>

      <Typography.Title level={2}>
        <Row justify="center" align="middle">
          {getAdjustmentListQuery.data?.data.adjustment_summary.not_cleared.count ?? 0}건
        </Row>
      </Typography.Title>
      <Row justify="center">
        <Typography.Title level={2}>
          {getAdjustmentListQuery.data?.data.adjustment_summary.not_cleared.price.toLocaleString() ??
            0}
          원
        </Typography.Title>
      </Row>
    </TurtleCardHome>
  );
}

export default AdjustmentStatusCard;
