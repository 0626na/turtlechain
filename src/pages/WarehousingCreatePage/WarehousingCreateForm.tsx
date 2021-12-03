import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Button, InputNumber, Card } from "antd";

const WarehousingCreateForm = function () {
  const { t } = useTranslation();
  return (
    <Form layout="vertical">
      <Card style={{ backgroundColor: "#fbfbfb" }}>
        <ItemGroup>
          <Form.Item label={t("wholesaler name")} name="">
            <Input />
          </Form.Item>
          <Form.Item label={t("wholesaler address")} name="">
            <Input />
          </Form.Item>
        </ItemGroup>
        <ItemGroup>
          <Form.Item label={t("product code")} name="">
            <Input />
          </Form.Item>
          <Form.Item label={t("product name")} name="">
            <Input />
          </Form.Item>
          <Form.Item label={t("option")} name="">
            <Input />
          </Form.Item>
          <Form.Item label={t("warehousing quantity")} name="">
            <InputNumber style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label={t("product price")} name="">
            <InputNumber style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label=" ">
            <Button icon={<PlusOutlined />} type="primary">
              {t("create")}
            </Button>
          </Form.Item>
        </ItemGroup>
      </Card>
    </Form>
  );
};

const ItemGroup = styled.div`
  display: flex;
  & > * + * {
    margin-left: 10px;
  }
`;

export default WarehousingCreateForm;
