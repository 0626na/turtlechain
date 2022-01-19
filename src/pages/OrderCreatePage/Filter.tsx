import { Col, Row, Space } from "antd";
import TurtleButton from "components/common/TurtleButton";
import StoreSelect from "components/StoreSelect";
import { useTranslation } from "react-i18next";

function Filter() {
  const { t } = useTranslation();

  return (
    <Row gutter={24} align={"middle"} justify="space-between">
      <Col>
        {/*
        <StoreSelect />
        */}
      </Col>
      <Col>
        <Space>
          <TurtleButton type="primary" color="grey">
            {t("button.upload order sheet")}
          </TurtleButton>
          <TurtleButton type="primary" color="grey">
            {t("button.load adjustment")}
          </TurtleButton>
        </Space>
      </Col>
    </Row>
  );
}

export default Filter;
