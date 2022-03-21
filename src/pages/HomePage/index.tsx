import { Helmet } from "react-helmet";
import { t } from "i18next";
import { Card, Col, Row, Select, Space, Table, Typography } from "antd";
import PageHeader from "components/PageHeader";
import { useMutation, useQuery } from "react-query";
import { mainAPI } from "apis";
import ClearingStatusCard from "./ClearingStatusCard";
import OrderChartCard from "./OrderChartCard";
import ClearingChartCard from "./ClearingChartCard";

const HomePage = function () {
  const title = `${t("turtlechain")} - ${t("common.home")}`;

  const cardStyle = {
    width: "100%",
    height: "100%",
  };

  const getUnprocessedStatusQuery = useQuery("getUnprocessedStatus", mainAPI.getUnprocessedStatus);

  return (
    <>
      <Helmet title={title} />
      <PageHeader //
        title={t("common.home")}
        info={t("description.check home")}
      />
      <Row>
        <ClearingStatusCard />
      </Row>
      <Row gutter={26}>
        <Col span={6}>
          <Card title={"미처리 환불 현황"} style={cardStyle}>
            <Row justify="center" align="middle">
              <Typography.Title level={2}>
                {getUnprocessedStatusQuery.data?.data.refunds.counts ?? 0} 건
              </Typography.Title>
            </Row>
            <Row justify="center">
              <Typography.Title level={2}>
                {getUnprocessedStatusQuery.data?.data.refunds.total_price ?? 0} 원
              </Typography.Title>
            </Row>
          </Card>
        </Col>
        <Col span={18}>
          <OrderChartCard />
        </Col>
      </Row>
      <Row gutter={26}>
        <Col span={6}>
          <Card title={"미처리 매입조정 현황"} style={cardStyle}>
            <Typography.Title level={2}>
              <Row justify="center" align="middle">
                {getUnprocessedStatusQuery.data?.data.adjustments.counts ?? 0} 건
              </Row>
            </Typography.Title>
            <Row justify="center">
              <Typography.Title level={2}>
                {getUnprocessedStatusQuery.data?.data.adjustments.total_price ?? 0} 원
              </Typography.Title>
            </Row>
          </Card>
        </Col>
        <Col span={18}>
          <ClearingChartCard />
        </Col>
      </Row>
    </>
  );
};

export default HomePage;
