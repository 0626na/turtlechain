import styled from "styled-components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// antd
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Form, Input, Button, InputNumber, Card, Radio, Row, Col } from "antd";
// api
import { CreateOrderItem } from "apis/orderAPI";
import CustomSearchInput from "components/common/CustomSearchInput";

interface Props {
  form: any; // Form.useForm() 의 타입???
  onCreate: (value: CreateOrderItem) => void;
  openModal: () => void;
}

const OrderCreateForm = function ({ form, onCreate, openModal }: Props) {
  const { t } = useTranslation();
  const [tempId, setTempId] = useState(1); // 임시 아이디

  const [orderType, setOrderType] = useState<string>("order");

  // 추가 버튼 클릭
  const onFinish = () => {
    onCreate({
      ...form.getFieldsValue(),
      order_count: form.getFieldValue("order_count"),
    });
    form.resetFields();
  };

  // 주문 종류 변경
  const onChangeOrderType = (e: any) => {
    setOrderType(e.target.value);
  };

  // 임시 상품 추가
  const onCreateTempOrder = () => {
    setTempId(tempId + 1);
    form.setFieldsValue({
      store_name: `${t("client name")}(${tempId})`,
      address: `${t("client address")}(${tempId})`,
      phone: `${t("phone")}(${tempId})`,
      product_code: `${t("product code")}(${tempId})`,
      product_name: `${t("product name")}(${tempId})`,
      option: `${t("option")}(${tempId})`,
      price: tempId * 1000,
      //count: tempId * 10,
      order_type: orderType,
      memo: `${t("memo")}(${tempId})`,
    });
  };

  return (
    <Form //
      layout="vertical"
      form={form}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={6}>
          <CustomSearchInput
            name="store_name"
            label={t("client name")}
            rules={[{ required: true }]}
            placeholder={t("placeholder.client name")}
          />
          <Form.Item // 거래처 주소 Input
            name="address"
            label={t("client address")}
            rules={[{ required: true }]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item // 휴대번호 Input
            name="phone"
            label={t("phone")}
            rules={[{ required: true }]}
          >
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item // 거래처명 Input
            name="store_name"
            label={t("client name")}
            rules={[{ required: true }]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item // 거래처 주소 Input
            name="address"
            label={t("client address")}
            rules={[{ required: true }]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item // 휴대번호 Input
            name="phone"
            label={t("phone")}
            rules={[{ required: true }]}
          >
            <Input readOnly />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

const ItemGroup = styled.div`
  display: flex;
  & > * + * {
    margin-left: 10px;
  }
`;

export default OrderCreateForm;
