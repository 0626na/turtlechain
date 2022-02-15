import { Col, Row, Space } from "antd";
import StoreSelect from "components/StoreSelect";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import { t } from "i18next";

function Toolbar() {
  return (
    <Row
      gutter={24}
      align="middle"
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
        </Space>
      </Col>
      <Col>
        <Space>
          <TurtleButtonSub icon="download">{t("button.download vendor")}</TurtleButtonSub>
        </Space>
      </Col>
    </Row>
  );
}

export default Toolbar;
