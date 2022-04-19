import { Helmet } from "react-helmet";
import { t } from "i18next";
import { Col, Row, Typography } from "antd";
import ClearingStatusCard from "./ClearingStatusCard";
import ClearingChartCard from "./ClearingChartCard";
import { TurtleCardHome, TurtleInfo } from "components/common";
import AdjustmentStatusCard from "./AdjustmentStatusCard";

const HomePage = function () {
  const title = `${t("turtlechain")} - ${t("common.home")}`;

  return (
    <>
      <Helmet title={title} />
      <Row>
        <TurtleCardHome>
          <Typography.Title level={4}>HOME</Typography.Title>
          <TurtleInfo>{t("description.check home")}</TurtleInfo>
        </TurtleCardHome>
      </Row>

      <Row>
        <ClearingStatusCard />
      </Row>
      <Row gutter={12}>
        <Col span={6}>
          <AdjustmentStatusCard />
        </Col>
        <Col span={18}>
          <ClearingChartCard />
        </Col>
      </Row>
    </>
  );
};

export default HomePage;
