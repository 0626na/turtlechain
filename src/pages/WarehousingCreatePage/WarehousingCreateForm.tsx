import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { CreateSheetItem } from "apis/warehousingAPI";

import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Button, InputNumber, Card } from "antd";

interface Props {
  onCreate: (value: CreateSheetItem) => void;
}

const WarehousingCreateForm = function ({ onCreate }: Props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = () => {
    const {
      store_name,
      address,
      product_code,
      product_name,
      option,
      count,
      price,
    } = form.getFieldsValue();

    onCreate({
      mall_id: -1,
      mall_name: "",
      store_id: -1,
      store_code: -1,
      store_name,
      address,
      product_id: -1,
      product_code,
      product_name,
      option,
      count,
      price,
      memo: "",
    });

    form.resetFields();
  };

  return (
    <Form //
      layout="vertical"
      form={form}
      onFinish={onFinish}
    >
      <Card style={{ backgroundColor: "#fbfbfb" }}>
        <ItemGroup>
          <Form.Item //
            label={t("wholesaler name")}
            name="store_name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item //
            label={t("wholesaler address")}
            name="address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </ItemGroup>
        <ItemGroup>
          <Form.Item //
            label={t("product code")}
            name="product_code"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item //
            label={t("product name")}
            name="product_name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item //
            label={t("option")}
            name="option"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item //
            label={t("warehousing quantity")}
            name="count"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: 200 }} />
          </Form.Item>
          <Form.Item //
            label={t("product price")}
            name="price"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label=" ">
            <Button //
              icon={<PlusOutlined />}
              type="primary"
              htmlType="submit"
            >
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
