import { Col, Row, Space, Typography } from "antd";
import CustomButton from "components/common/CustomButton";
import CustomSelect from "components/common/CustomSelect";
import { useTranslation } from "react-i18next";
import CustomDatePicker from "components/common/CustomDatePicker";

function MallFilter() {
  const { t } = useTranslation();

  return (
    <Row gutter={24} align="middle" justify="space-between">
      <Col>
        <Space size="large">
          <Typography.Text>{t("mall")}</Typography.Text>
          <CustomSelect />
          <CustomDatePicker label={`${t("order")} ${t("date")}`} />
        </Space>
      </Col>
      <Col>
        <Space>
          <CustomButton type="primary" color="grey">
            {`${t("order list")} ${t("download")}`}
          </CustomButton>
        </Space>
      </Col>
    </Row>
  );
}

export default MallFilter;
