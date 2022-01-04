import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// antd
import { Form, Col, Typography, Row, Space } from "antd";
// api
import { CreateOrderItem } from "apis/orderAPI";
import CustomSearchInput from "components/common/CustomSearchInput";
import CustomInput from "components/common/CustomInput";
import CustomRadio from "components/common/CustomRadio";
import CustomTextArea from "components/common/CustomTextArea";
import CustomButton from "components/common/CustomButton";
import CustomDivider from "components/common/CustomDivider";
import CustomText from "components/common/CustomText";

interface Props {
  form: any; // Form.useForm() 의 타입???
  onCreate: (value: CreateOrderItem) => void;
  openModal: () => void;
}

const OrderCreateForm = function ({ form, onCreate, openModal }: Props) {
  const { t } = useTranslation();

  const [orderType, setOrderType] = useState("order");

  // 주문 종류 변경
  const onChangeOrderType = (e: any) => {
    setOrderType(e.target.value);
  };

  return (
    <>
      <Form layout="vertical" form={form}>
        <CustomText>{`${t("order sheet")} ${t("info")} ${t("input")}`}</CustomText>
        <Row gutter={32}>
          <Col span={6}>
            <CustomSearchInput // 거래처명 검색 Input
              name="store_name"
              label={t("client name")}
              placeholder={t("placeholder.client name")}
            />
            <CustomInput // 거래처 주소 Input
              name="address"
              label={t("client address")}
            />
            <CustomInput // 휴대번호 Input
              name="phone"
              label={t("phone")}
            />
          </Col>
          <Col span={6}>
            <CustomSearchInput
              name="product_name"
              label={t("product name")}
              placeholder={t("placeholder.product name")}
            />
            <CustomInput // 상품명 Input
              name="product_code"
              label={t("product code")}
            />
            <CustomInput // 옵션 Input
              name="option"
              label={t("option")}
            />
            <CustomInput // 공급가 Input
              label={t("supply price")}
              name="price"
            />
            <CustomInput // 발주수량 Input
              name="count"
              label={t("order count")}
            />
          </Col>
          <Col span={12}>
            <CustomRadio
              name="order_type"
              label={t("order type")}
              value={orderType}
              onChange={onChangeOrderType}
            />
            <CustomTextArea name="memo" label={t("memo")} placeholder={t("placeholder.memo")} />
          </Col>
        </Row>
        <Row justify="center">
          <CustomButton htmlType="submit">추가하기</CustomButton>
        </Row>
      </Form>
      <CustomDivider />
    </>
  );
};

export default OrderCreateForm;
