import { Col, Row, Space, Typography } from "antd";
import StoreSelect from "components/StoreSelect";
import { t } from "i18next";
import TurtleDatePicker from "components/common/TurtleDatePicker";

function Toolbar() {
  return (
    <Row
      gutter={24}
      align={"middle"}
      justify="space-between"
      style={{
        margin: "0",
        padding: "12px 12px",
        backgroundColor: "rgba(243,246,249, 0.4)",
      }}
    >
      <Col>
        <Space size="large">
          <StoreSelect />
          <Typography.Text style={{ fontSize: "16px" }}>{t("order.date")}</Typography.Text>
          <TurtleDatePicker label={t("order.date")} />
        </Space>
      </Col>
      <Col>
        <Space>
          {/* <TurtleButtonSub icon="download">{t("button.download order list")}</TurtleButtonSub> */}
        </Space>
      </Col>
    </Row>
  );
}

export default Toolbar;
