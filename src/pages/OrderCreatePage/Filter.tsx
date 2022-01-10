import { Col, message, Row, Select, Space, Typography } from "antd";
import { retailerStoreAPI } from "apis";
import { AxiosError } from "axios";
import TurtleButton from "components/common/TurtleButton";
import TurtleSelect from "components/common/TurtleSelect";
import CustomStoreSelect from "components/CustomStoreSelect";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import styled from "styled-components";

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
            {`${t("order.sheet")} ${t("upload")}`}
          </TurtleButton>
          <TurtleButton type="primary" color="skyBlue">
            {`${t("adjustment")} ${t("load")}`}
          </TurtleButton>
        </Space>
      </Col>
    </Row>
  );
}

const StyledSelect = styled(Select)`
  .ant-select-selector {
    width: 20rem !important;
  }
`;

export default Filter;
