import { Col, message, Row, Select, Space, Typography } from "antd";
import TurtleButton from "components/common/TurtleButton";
import CustomStoreSelect from "components/CustomStoreSelect";
import { useTranslation } from "react-i18next";

function Filter() {
  const { t } = useTranslation();

  return (
    <Row gutter={24} align={"middle"} justify="space-between">
      <Col>
        <CustomStoreSelect />
      </Col>
      <Col>
        <Space>
          <TurtleButton type="primary" color="grey">
            {t("button.upload order sheet")}
          </TurtleButton>
          <TurtleButton type="primary" color="skyBlue">
            {t("button.load adjustment")}
          </TurtleButton>
        </Space>
      </Col>
    </Row>
  );
}

export default Filter;
