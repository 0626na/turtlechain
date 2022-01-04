import { Col, Row, Space, Typography } from "antd";
import CustomButton from "components/common/CustomButton";
import CustomSelect from "components/common/CustomSelect";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

function MallFilter() {
  const { t } = useTranslation();

  return (
    <Row gutter={24} align={"middle"} justify="space-between">
      <Col>
        <Space size="large">
          <Typography.Text>{t("mall")}</Typography.Text>
          <CustomSelect />
        </Space>
      </Col>
      <Col>
        <Space>
          <CustomButton type="primary" color="grey">
            {`${t("order sheet")} ${t("upload")}`}
          </CustomButton>
          <CustomButton type="primary" color="skyBlue">
            {`${t("adjustment")} ${t("load")}`}
          </CustomButton>
        </Space>
      </Col>
    </Row>
  );
}

export default MallFilter;
