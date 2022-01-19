import { Col, Row, Space } from "antd";
import TurtleButton from "components/common/TurtleButton";
import { useTranslation } from "react-i18next";
import TurtleDatePicker from "components/common/TurtleDatePicker";
import StoreSelect from "components/StoreSelect";

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
          <TurtleButton type="primary" color="grey">
            {t("button.download order list")}
          </TurtleButton>
        </Space>
      </Col>
    </Row>
  );
}

export default Filter;
