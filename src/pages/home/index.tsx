import { Helmet } from "react-helmet";
import { t } from "i18next";
import { Card, Col, Row, Typography } from "antd";
import { useQuery } from "react-query";
import { adjustmentAPI } from "apis";
import { PageHeader } from "layouts/main";
import ClearingStatusCard from "./ClearingStatusCard";
import ClearingChartCard from "./ClearingChartCard";
import moment from "moment";

const HomePage = function () {
  const title = `${t("turtlechain")} - ${t("common.home")}`;

  const cardStyle = {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  };

  // 매입조정 리스트 요청
  const getAdjustmentListQuery = useQuery(["getAdjustmentList"], () =>
    adjustmentAPI.getList({
      is_cleared: 2,
      start_date: moment().subtract(1, "months").format("YYYY-MM-DD"),
      end_date: moment().format("YYYY-MM-DD"),
    }),
  );

  return (
    <>
      <Helmet title={title} />
      <PageHeader //
        title={t("common.home")}
        info={t("description.check home")}
        divider={false}
      />

      <ClearingStatusCard />
      <Row gutter={12}>
        <Col span={6}>
          <Card bordered={false} style={cardStyle}>
            <Row justify="space-between" style={{ paddingBottom: 24 }}>
              <Col>
                <Typography.Title level={4}>대기 매입조정 현황</Typography.Title>
              </Col>
              <Col>
                <Typography.Text type="secondary">최근 1개월</Typography.Text>
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
          </Card>
        </Col>
        <ClearingChartCard />
      </Row>
    </>
  );
};

export default HomePage;
