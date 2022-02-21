import { Helmet } from "react-helmet";
import { t } from "i18next";
import { Card, Col, Row, Select, Space, Table } from "antd";
import PageHeader from "components/PageHeader";
import { useMutation, useQuery } from "react-query";
import { mainAPI } from "apis";
import ClearingStatusCard from "./ClearingStatusCard";

const HomePage = function () {
  const title = `${t("turtlechain")} - ${t("common.home")}`;

  const cardStyle = {
    width: "100%",
    height: 250,
  };

  const getUnprocessedStatusQuery = useQuery("getUnprocessedStatus", mainAPI.getUnprocessedStatus);

  return (
    <>
      <Helmet title={title} />
      <PageHeader //
        pageName="home"
        title={t("common.home")}
        info={t("description.check home")}
      />
      <Row>
        <ClearingStatusCard />
      </Row>
      <Row gutter={26}>
        <Col span={6}>
          <Card title={"미처리 환불 현황"} style={cardStyle}>
            <Row justify="center">{getUnprocessedStatusQuery.data?.data.refunds.counts} 건</Row>
            <Row justify="center">
              {getUnprocessedStatusQuery.data?.data.refunds.total_price} 원
            </Row>
          </Card>
        </Col>
        <Col span={18}>
          <Card title={"누적 주문"} style={cardStyle}>
            차트
          </Card>
        </Col>
      </Row>
      <Row gutter={26}>
        <Col span={6}>
          <Card title={"미처리 매입조정 현황"} style={cardStyle}>
            <Row justify="center">{getUnprocessedStatusQuery.data?.data.adjustments.counts} 건</Row>
            <Row justify="center">
              {getUnprocessedStatusQuery.data?.data.adjustments.total_price} 원
            </Row>
          </Card>
        </Col>
        <Col span={18}>
          <Card title={"누적 정산"} style={cardStyle}>
            차트
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default HomePage;
