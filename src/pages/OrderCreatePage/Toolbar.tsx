import { Col, Row, Space } from "antd";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import StoreSelect from "components/StoreSelect";
import { useTranslation } from "react-i18next";

function Toolbar() {
  const { t } = useTranslation();

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
        <StoreSelect />
      </Col>
      <Col>
        <Space>
          <TurtleButtonSub icon="file">{t("button.upload order sheet")}</TurtleButtonSub>
          {/* <TurtleButtonSub icon="download">{t("button.load adjustment")}</TurtleButtonSub> */}
        </Space>
      </Col>
    </Row>
  );
}

export default Toolbar;
