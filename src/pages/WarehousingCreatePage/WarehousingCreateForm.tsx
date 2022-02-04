import styled from "styled-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateSheetItem } from "apis/warehousingAPI";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Form, Input, Button, InputNumber, Card } from "antd";

interface Props {
  onCreate: (value: CreateSheetItem) => void;
}

const WarehousingCreateForm = function ({ onCreate }: Props) {
  const { t } = useTranslation();
  const [tempId, setTempId] = useState(1); // 임시 아이디
  const [form] = Form.useForm<CreateSheetItem>();

  // 임시 입고 추가
  const onCreateTempWarehousing = () => {
    setTempId(tempId + 1);
    form.setFieldsValue({
      store_name: `${t("client name")}(${tempId})`,
      address: `${t("client address")}(${tempId})`,
      product_code: `${t("product code")}(${tempId})`,
      product_name: `${t("product name")}(${tempId})`,
      option: `${t("option")}(${tempId})`,
      price: tempId * 1000,
    });
  };

  const onFinish = () => {
    onCreate({
      ...form.getFieldsValue(),
      rt_store_id: -1,
      mall_name: "",
      store_id: -1,
      store_code: -1,
      product_id: -1,
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
        <Form.Item>
          <Button //
            type="primary"
            icon={<SearchOutlined />}
            onClick={onCreateTempWarehousing}
          >
            {t("search product")}
          </Button>
        </Form.Item>
        <ItemGroup>
          <Form.Item //
            name="store_name"
            label={t("client name")}
            rules={[{ required: true }]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item //
            name="address"
            label={t("client address")}
            rules={[{ required: true }]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item //
            name="product_code"
            label={t("product code")}
            rules={[{ required: true }]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item //
            name="product_name"
            label={t("product name")}
            rules={[{ required: true }]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item //
            name="option"
            label={t("option")}
            rules={[{ required: true }]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item //
            label={t("supply price")}
            name="price"
            rules={[{ required: true }]}
          >
            <Input readOnly />
          </Form.Item>
        </ItemGroup>
        <ItemGroup>
          <Form.Item //
            name="count"
            label={t("warehousing.count")}
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label=" ">
            <Button //
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
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
