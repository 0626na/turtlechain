import React from "react";
import { Button, Col, Form, Row, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
import CustomSelect from "./common/CustomSelect";
import CustomButton from "./common/CustomButton";

function CustomStoreSelect() {
  const { t } = useTranslation();

  return (
    <Row gutter={24} align={"middle"} justify="space-between">
      <Col>
        <Space size="large">
          {t("mall")}
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

export default CustomStoreSelect;
