import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// antd
import { Form, Col, Typography, Row, Space } from "antd";
// api
import { CreateOrderItem } from "apis/orderAPI";
import TurtleSearchInput from "components/common/TurtleSearchInput";
import TurtleInput from "components/common/TurtleInput";
import TurtleRadio from "components/common/TurtleRadio";
import TurtleTextArea from "components/common/TurtleTextArea";
import TurtleButton from "components/common/TurtleButton";
import TurtleDivider from "components/common/TurtleDivider";
import TurtleText from "components/common/TurtleText";
import TurtleInputNumber from "components/common/TurtleInputNumber";

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
        <TurtleText>{`${t("order.sheet")} ${t("info")} ${t("input")}`}</TurtleText>
        <Row gutter={32}>
          <Col span={6}>
            <TurtleSearchInput // 거래처명 검색 Input
              name="store_name"
              label={t("client name")}
              placeholder={t("placeholder.client name")}
            />
            <TurtleInput // 거래처 주소 Input
              name="address"
              label={t("client address")}
              disabled={true}
            />
            <TurtleInput // 휴대번호 Input
              name="phone"
              label={t("phone")}
              disabled={true}
            />
          </Col>
          <Col span={6}>
            <TurtleSearchInput
              name="product_name"
              label={t("product name")}
              placeholder={t("placeholder.product name")}
            />
            <TurtleInput // 상품 바코드 Input
              name="product_code"
              label={t("product code")}
              disabled={true}
            />
            <TurtleInput // 옵션 Input
              name="option"
              label={t("option")}
              disabled={true}
            />
            <TurtleInput // 공급가 Input
              label={t("supply price")}
              name="price"
              disabled={true}
            />
            <TurtleInputNumber // 발주수량 Input
              name="count"
              label={t("order.count")}
            />
          </Col>
          <Col span={12}>
            <TurtleRadio
              name="order_type"
              label={t("order.type")}
              value={orderType}
              onChange={onChangeOrderType}
            />
            <TurtleTextArea name="memo" label={t("memo")} placeholder={t("placeholder.memo")} />
          </Col>
        </Row>
        <Row justify="center">
          <TurtleButton htmlType="submit">추가하기</TurtleButton>
        </Row>
      </Form>
      <TurtleDivider />
    </>
  );
};

export default OrderCreateForm;
