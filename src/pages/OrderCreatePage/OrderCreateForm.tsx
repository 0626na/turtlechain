import styled from "styled-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
// antd
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Form, Input, Button, InputNumber, Card } from "antd";

interface Props {}

const OrderCreateForm = function ({}: Props) {
  const { t } = useTranslation();
  const [tempId, setTempId] = useState(1); // 임시 아이디
  const [form] = Form.useForm<any>(); // type 정의 수정 필요

  // 임시 주문 추가
  const onCreateTempOrder = () => {
    setTempId(tempId + 1);
    form.setFieldsValue({
      store_name: `${t("client name")}(${tempId})`,
      address: `${t("client address")}(${tempId})`,
      phone: `${t("phone")}(${tempId})`,
      product_code: `${t("product code")}(${tempId})`,
      //product_name: `${t("product name")}(${tempId})`,
      option: `${t("option")}(${tempId})`,
      price: tempId * 1000,
      count: tempId * 10,
      memo: `${t("memo")}(${tempId})`,
    });
    console.log(form);
  };

  return (
    <Form //
      layout="vertical"
      form={form}
    >
      <Card style={{ backgroundColor: "#fbfbfb" }}>
        <Form.Item>
          <Button // 상품 조회하기 Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={onCreateTempOrder}
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
        </ItemGroup>

        <ItemGroup>
          <Form.Item // 상품 바코드 Input
            name="product_code"
            label={t("product code")}
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
            name="count"
            label={t("order count")}
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: 200 }} />
          </Form.Item>
        </ItemGroup>

        <ItemGroup>
          {/* TODO : 주문종류 Select Box 추가 */}
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
