import { Col, Row, Space, Typography } from "antd";
import TurtleButton from "components/common/TurtleButton";
import TurtleSelect from "components/common/TurtleSelect";
import { useTranslation } from "react-i18next";

function StoreFilter() {
  const { t } = useTranslation();

  return (
    <Row gutter={24} align={"middle"} justify="space-between">
      <Col>
        <Space size="large">
          <Typography.Text>{t("mall")}</Typography.Text>
          <TurtleSelect />
        </Space>
      </Col>
      <Col>
        <Space>
          <TurtleButton type="primary" color="grey">
            {`${t("order sheet")} ${t("upload")}`}
          </TurtleButton>
          <TurtleButton type="primary" color="skyBlue">
            {`${t("adjustment")} ${t("load")}`}
          </TurtleButton>
        </Space>
      </Col>
    </Row>
  );
}

export default StoreFilter;
