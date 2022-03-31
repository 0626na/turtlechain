import { Col, Row, Space } from "antd";
import { StoreSelect } from "components/combine";
import { t } from "i18next";

interface Props {
  children?: React.ReactNode;
  isWarning?: boolean;
}

function Toolbar({ children, isWarning }: Props) {
  return (
    <>
      <Row
        align="middle"
        justify="space-between"
        style={{
          paddingTop: 0,
          paddingBottom: 24,
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
