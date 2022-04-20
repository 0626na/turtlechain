import { Card, Col, Divider, Row, Tag, Typography } from "antd";
import { adjustmentAPI } from "apis";
import { TurtleCard, TurtleCardHome, TurtleDivider } from "components/common";
import moment from "moment";
import { t } from "i18next";
import { useQuery } from "react-query";
import Meta from "antd/lib/card/Meta";

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
          <Typography.Title level={5}>매입조정 현황</Typography.Title>
        </Col>
        <Col>
          <Typography.Text type="secondary">{moment().format("YYYY-MM")}</Typography.Text>
        </Col>
      </Row>

      <Row style={{ marginTop: 12, marginBottom: 30 }} align="middle">
        {[
          {
            color: "orange",
            title: t("adjustment.pending"),
            count: getAdjustmentListQuery.data?.data.adjustment_summary?.not_cleared.count ?? 0,
            price: getAdjustmentListQuery.data?.data.adjustment_summary?.not_cleared.price ?? 0,
          },
          {
            color: "geekblue",
            title: t("adjustment.confirmed"),
            count: getAdjustmentListQuery.data?.data.adjustment_summary?.cleared.count ?? 0,
            price: getAdjustmentListQuery.data?.data.adjustment_summary?.cleared.price ?? 0,
          },
        ].map(({ color, title, count, price }, index) => (
          <>
            <Col span={11} key={index}>
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
                  style={{ textAlign: "center", margin: "12px 0" }}
                />
              </Card>
            </Col>
            {index === 0 && <Divider type="vertical" style={{ height: 50, color: "#DCE0E4" }} />}
          </>
        ))}
      </Row>
    </TurtleCardHome>
  );
}

export default AdjustmentStatusCard;
