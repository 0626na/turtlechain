import { useState } from "react";
import { useTranslation } from "react-i18next";
// antd
import { Form, Col, Row, FormInstance, Input } from "antd";
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
  form: FormInstance<CreateOrderItem>;
  onCreate: (value: CreateOrderItem) => void;
}

const OrderCreateForm = function ({ form, onCreate }: Props) {
  const { t } = useTranslation();

  const [orderType, setOrderType] = useState("order");

  // 주문 종류 변경
  const onChangeOrderType = (e: any) => {
    setOrderType(e.target.value);
  };

  return (
    <>
      <Form layout="vertical" form={form}>
        <TurtleText>{t("order.enter info")}</TurtleText>
        <Row gutter={32}>
          <Col span={7}>
            <TurtleSearchInput // 거래처명 검색 Input
              name="vendor_name"
              label={t("vendor.name")}
              placeholder={t("placeholder.vendor name")}
            />
            <TurtleInput // 거래처 주소 Input
              name="vendor_address"
              label={t("vendor.address")}
              disabled={true}
            />
            <TurtleInput // 거래처 휴대번호 Input
              name="vendor_phone"
              label={t("vendor.phone")}
              disabled={true}
            />
          </Col>
          <Col span={7}>
            <TurtleSearchInput
              name="product_name"
              label={t("product.name")}
              placeholder={t("placeholder.product name")}
            />
            <TurtleInput // 상품 바코드 Input
              name="product_code"
              label={t("product.code")}
              disabled={true}
            />
            <TurtleInput // 상품 옵션 Input
              name="product_option"
              label={t("product.option")}
              disabled={true}
            />
            <TurtleInput // 상품 공급가 Input
              name="product_price"
              label={t("product.price")}
              disabled={true}
            />
            <TurtleInputNumber // 상품 발주수량 Input
              name="product_count"
              label={t("product.count")}
            />
          </Col>
          <Col span={10}>
            <TurtleRadio // 주문종류 Select
              name="order_type"
              label={t("order.type.")}
              value={orderType}
              onChange={onChangeOrderType}
            />
            <TurtleTextArea // 주문 메모 TextArea
              name="order_memo"
              label={t("order.memo")}
              placeholder={t("placeholder.memo")}
            />
          </Col>
        </Row>
        <Row justify="end">
          <TurtleButton type="default">{t("button.add")}</TurtleButton>
        </Row>
      </Form>
      <TurtleDivider />
    </>
  );
};

export default OrderCreateForm;
