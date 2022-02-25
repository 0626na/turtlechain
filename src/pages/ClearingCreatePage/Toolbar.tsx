import { Col, Row, Typography } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import { t } from "i18next";
import StoreSelect from "components/StoreSelect";

interface Props {
  warningMessage?: string;
}

function Toolbar({ warningMessage }: Props) {
  return (
    <>
      <Row gutter={24} align={"middle"} justify="space-between">
        <Col>
          <StoreSelect warningMessage={warningMessage} />
        </Col>
      </Row>
      <Typography.Text type="secondary">
        <InfoIcon /> {t("description.today reserve included")}
      </Typography.Text>
    </>
  );
}

export default Toolbar;
