import { Col, Row, Space, Typography } from "antd";
import TurtleButton from "components/common/TurtleButton";
import TurtleSelect from "components/common/TurtleSelect";
import { useTranslation } from "react-i18next";
import TurtleDatePicker from "components/common/TurtleDatePicker";

function StoreFilter() {
  const { t } = useTranslation();

  return (
    <Row gutter={24} align="middle" justify="space-between">
      <Col>
        <Space size="large">
          <Typography.Text>{t("mall")}</Typography.Text>
          <TurtleSelect />
          <TurtleDatePicker label={`${t("order")} ${t("date")}`} />
        </Space>
      </Col>
      <Col>
        <Space>
          <TurtleButton type="primary" color="grey">
            {`${t("order list")} ${t("download")}`}
          </TurtleButton>
        </Space>
      </Col>
    </Row>
  );
}

export default StoreFilter;
