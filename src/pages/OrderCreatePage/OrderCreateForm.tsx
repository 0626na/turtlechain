import { useCallback, useEffect, useState } from "react";
// antd
import { Form, Col, Row, FormInstance, Input, message, Radio, Space } from "antd";
// api
import { OrderItemShow } from "apis/orderAPI";
import TurtleSearchInput from "components/common/TurtleSearchInput";
import TurtleInput from "components/common/TurtleInput";
import TurtleTextArea from "components/common/TurtleTextArea";
import TurtleButton from "components/common/TurtleButton";
import TurtleDivider from "components/common/TurtleDivider";
import TurtleText from "components/common/TurtleText";
import TurtleInputNumber from "components/common/TurtleInputNumber";
import { t } from "i18next";
import SearchVendorModal from "components/SearchVendorModal";
import { storeState } from "store/storeState";
import { useRecoilValue } from "recoil";
import SearchProductModal from "components/SearchProductModal";
import Toolbar from "components/Toolbar";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import CreateBulkOrderModal from "./CreateBulkOrderModal";

interface Props {
  addItem: (item: OrderItemShow) => void;
}

const OrderCreateForm = function ({ addItem }: Props) {
  const store = useRecoilValue(storeState);
  const [form] = Form.useForm();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [vendorModalVisible, setVendorModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);

  // 쇼핑몰 선택시 모든 필드 초기화
  useEffect(() => {
    form.resetFields();
  }, [store.id, form]);

  const selectVendor = useCallback(
    (vendor_id, vendor_name, vendor_address, vendor_phone) => {
      form.setFieldsValue({
        vendor_id,
        vendor_name,
        vendor_address,
        vendor_phone,
        product_id: undefined,
        product_name: undefined,
        product_code: undefined,
        product_option: undefined,
        price: undefined,
        count: undefined,
      });
      setVendorModalVisible(false);
    },
    [form],
  );

  const selectProduct = useCallback(
    (
      product_id,
      product_name,
      vendor_product_name,
      product_code,
      product_option,
      product_price,
    ) => {
      form.setFieldsValue({
        product_id,
        product_name,
        vendor_product_name,
        product_code,
        product_option,
        price: product_price,
        count: 1,
      });
      setProductModalVisible(false);
    },
    [form],
  );

  return (
    <>
      <Toolbar>
        <Col>
          <Space>
            <TurtleButtonSub
              icon="file"
              onClick={() => {
                if (!store.id) {
                  message.warn("쇼핑몰을 선택해주세요.");
                  return;
                }
                setCreateModalVisible(true);
              }}
            >
              {t("button.upload order sheet")}
            </TurtleButtonSub>
            {/* <TurtleButtonSub icon="download">{t("button.load adjustment")}</TurtleButtonSub> */}
          </Space>
        </Col>
      </Toolbar>
      <CreateBulkOrderModal
        visible={createModalVisible}
        closeModal={() => {
          setCreateModalVisible(false);
        }}
        addItem={addItem}
      />
      <Form layout="vertical" form={form}>
        <TurtleText>{t("order.enter info")}</TurtleText>
        <Row gutter={32}>
          <Col span={7}>
            <Form.Item name="vendor_id" hidden>
              <Input hidden />
            </Form.Item>
            <Form.Item name="product_id" hidden>
              <Input hidden />
            </Form.Item>

            <TurtleSearchInput // 거래처명 검색 Input
              name="vendor_name"
              label={t("vendor.name")}
              placeholder={t("placeholder.vendor name")}
              onSearch={() => {
                if (!store.id) {
                  message.warn("쇼핑몰을 선택해주세요.");
                  return;
                }
                setVendorModalVisible(true);
              }}
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
              onSearch={() => {
                if (!store.id) {
                  message.warn("쇼핑몰을 선택해주세요.");
                  return;
                }
                if (!form.getFieldValue("vendor_id")) {
                  message.warn("거래처를 선택해주세요.");
                  return;
                }
                setProductModalVisible(true);
              }}
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
              name="price"
              label={t("product.price")}
              disabled={true}
            />
            <TurtleInputNumber // 상품 발주수량 Input
              name="count"
              label={t("product.count")}
              min={1}
            />
          </Col>
          <Col span={10}>
            <Form.Item name="type" label={t("order.type.")} rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value="order">{t("order.type.order")}</Radio>
                <Radio value="reserve">{t("order.type.reserved")}</Radio>
                <Radio value="takeback">{t("order.type.take back")}</Radio>
                <Radio value="exchange">{t("order.type.exchange")}</Radio>
                <Radio value="sample">{t("order.type.sample")}</Radio>
                <Radio value="pickup">{t("order.type.pickup")}</Radio>
                <Radio value="extra">{t("order.type.etc")}</Radio>
              </Radio.Group>
            </Form.Item>
            <TurtleTextArea // 주문 메모 TextArea
              name="memo"
              label={t("order.memo")}
              placeholder={t("placeholder.memo")}
            />
          </Col>
        </Row>
        <Row justify="end">
          <TurtleButton
            type="default"
            onClick={() => {
              form.validateFields().then(() => {
                addItem(form.getFieldsValue());
                form.resetFields();
              });
            }}
          >
            {t("button.add")}
          </TurtleButton>
        </Row>
      </Form>
      <TurtleDivider />
      {/* 거래처 검색 모달 */}
      <SearchVendorModal
        visible={vendorModalVisible}
        closeModal={() => {
          setVendorModalVisible(false);
        }}
        onClickSelect={selectVendor}
      />
      {/* 상품 검색 모달 */}
      <SearchProductModal
        visible={productModalVisible}
        closeModal={() => {
          setProductModalVisible(false);
        }}
        vendorId={form.getFieldValue("vendor_id")}
        onClickSelect={selectProduct}
      />
    </>
  );
};

export default OrderCreateForm;
