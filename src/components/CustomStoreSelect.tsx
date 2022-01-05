import React from "react";
import { Button, Col, Form, Row, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
import TurtleSelect from "./common/TurtleSelect";
import TurtleButton from "./common/TurtleButton";
import styled from "styled-components";

function CustomStoreSelect() {
  const { t } = useTranslation();

  return (
    <Row gutter={24} align={"middle"} justify="space-between">
      <Col>
        <Space size="large">
          <StyledTitle level={5}>{t("mall")}</StyledTitle>
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

const StyledTitle = styled(Typography.Title)`
  margin-bottom: 0 !important;
`;

export default CustomStoreSelect;
