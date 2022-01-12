import { Col, Row, Space } from "antd";
import TurtleButton from "components/common/TurtleButton";
import { useTranslation } from "react-i18next";
import CustomStoreSelect from "components/CustomStoreSelect";

function Filter() {
  const { t } = useTranslation();

  return (
    <Row gutter={24} align="middle" justify="space-between">
      <Col>
        <Space size="large">
          <CustomStoreSelect />
        </Space>
      </Col>
      <Col>
        <Space>
          <TurtleButton type="primary" color="grey">
            {t("button.download vendor")}
          </TurtleButton>
        </Space>
      </Col>
    </Row>
  );
}

export default Filter;
