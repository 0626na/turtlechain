import { Col, Row, Space } from "antd";
import { useTranslation } from "react-i18next";
import TurtleDatePicker from "components/common/TurtleDatePicker";
import StoreSelect from "components/StoreSelect";
import TurtleButtonSub from "components/common/TurtleButtonSub";

function Filter() {
  const { t } = useTranslation();

  return (
    <Row gutter={24} align="middle" justify="space-between">
      <Col>
        <Space size="large">
          {/*
        <StoreSelect />
        */}
          <TurtleDatePicker label={t("order.date")} />
        </Space>
      </Col>
      <Col>
        <Space>
          <TurtleButtonSub icon="download">{t("button.download order list")}</TurtleButtonSub>
        </Space>
      </Col>
    </Row>
  );
}

export default Filter;
