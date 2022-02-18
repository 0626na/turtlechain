import { Helmet } from "react-helmet";
import { t } from "i18next";
import { Card, Col, Row, Space, Table } from "antd";
import PageHeader from "components/PageHeader";
import { useQuery } from "react-query";
import { mainAPI } from "apis";

const HomePage = function () {
  const title = `${t("turtlechain")} - ${t("common.home")}`;

  const cardStyle = {
    width: "100%",
    height: 250,
  };

  const getUnprocessedStatusQuery = useQuery(
    "getUnprocessedStatusQuery",
    mainAPI.getUnprocessedStatus,
  );

  return (
    <>
      <Helmet title={title} />
      <PageHeader //
        pageName="home"
        title={t("common.home")}
        info={t("description.check home")}
      />
      <Row>
        <Card title={"정산 처리 현황"} style={{ ...cardStyle, height: "100%" }}>
          <Table
            size="small"
            //loading={}
            //dataSource={}
            //rowKey={}
            //pagination={true}
            columns={[
              {
                ellipsis: true,
                title: "정산 요청 날짜",
              },
              {
                ellipsis: true,
                title: "총 거래처 수",
              },
              {
                ellipsis: true,
                title: "정산 총 금액",
              },
              {
                ellipsis: true,
                title: "정산 처리 상태",
              },
            ]}
          />
        </Card>
      </Row>
      <Row gutter={26}>
        <Col span={6}>
          <Card title={"미처리 환불 현황"} style={cardStyle}>
            <Row justify="center">{getUnprocessedStatusQuery.data?.data.refunds.counts}</Row>
            <Row justify="center">{getUnprocessedStatusQuery.data?.data.refunds.total_price}</Row>
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
            <Row justify="center">{getUnprocessedStatusQuery.data?.data.adjustments.counts}</Row>
            <Row justify="center">
              {getUnprocessedStatusQuery.data?.data.adjustments.total_price}
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
