import { Col, Row, Space } from "antd";
import StoreSelect from "components/StoreSelect";
import { t } from "i18next";

interface Props {
  children?: React.ReactNode;
  isWarning?: boolean;
}

function Toolbar({ children, isWarning }: Props) {
  return (
    <>
      <Row
        gutter={24}
        align="middle"
        justify="space-between"
        style={{
          margin: 0,
          padding: "24px 12px",
        }}
      >
        <Col>
          <StoreSelect warningMessage={isWarning ? t("message.warning change mall") : ""} />
        </Col>
        <Col>
          <Space>{children}</Space>
        </Col>
      </Row>
    </>
  );
}

export default Toolbar;
