import styled from "styled-components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// antd
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Form, Input, Button, InputNumber, Card, Radio } from "antd";
// api
import { CreateOrderItem } from "apis/orderAPI";

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
      <Card style={{ backgroundColor: "#fbfbfb" }}>
        <Form.Item>
          <Button // 상품 조회하기 Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={openModal}
          >
            {t("search product")}
          </Button>
        </Form.Item>

        <ItemGroup>
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
          <Form.Item // 상품 바코드 Input
            name="product_code"
            label={t("product code")}
            rules={[{ required: true }]}
          >
            <Input readOnly />
          </Form.Item>
        </ItemGroup>

        <ItemGroup>
          <Form.Item // 상품 이름 Input
            name="product_name"
            label={t("product name")}
            rules={[{ required: true }]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item // 옵션 Input
            name="option"
            label={t("option")}
            rules={[{ required: true }]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item // 공급가 Input
            label={t("supply price")}
            name="price"
            rules={[{ required: true }]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item // 발주량
            name="order_count"
            label={t("order count")}
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: 200 }} />
          </Form.Item>
        </ItemGroup>

        <ItemGroup>
          <Form.Item // 주문종류 Radio Box
            name="order_type"
            label={t("order type")}
            rules={[{ required: true }]}
          >
            <Radio.Group onChange={onChangeOrderType} value={orderType}>
              <Radio value={"order"}>{t("order")}</Radio>
              <Radio value={"reserved"}>{t("reserved")}</Radio>
              <Radio value={"take_back"}>{t("take back")}</Radio>
              <Radio value={"exchange"}>{t("exchange")}</Radio>
              <Radio value={"samle"}>{t("samle")}</Radio>
              <Radio value={"pickup"}>{t("pickup")}</Radio>
              <Radio value={"etc"}>{t("etc")}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item // 메모 Input
            name="memo"
            label={t("memo")}
            rules={[{ required: true }]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item label=" ">
            <Button // 추가 Button
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

export default OrderCreateForm;
