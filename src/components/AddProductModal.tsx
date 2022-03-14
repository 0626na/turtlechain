import { Divider, Form, Input, Modal, Row } from "antd";
import { t } from "i18next";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import TurtleSearchInput from "components/common/TurtleSearchInput";
import TurtleInput from "components/common/TurtleInput";
import TurtleInputNumber from "components/common/TurtleInputNumber";
import TurtleButton from "components/common/TurtleButton";
import SearchVendorModal from "components/SearchVendorModal";
import SearchProductModal from "./SearchProductModal";

export interface AddProduct {
  vendor_name: string;
  vendor_address: string;
  product_name: string;
  vendor_product_name: string;
  product_option: string;
  product_price: number;
  product_count: number;
  product_code: number;
  vendor_id: number;
  product_id: number;
}

interface Props {
  visible: boolean;
  closeModal: () => void;
  addProduct: (item: AddProduct) => boolean;
}

function AddSingleProductModal({ visible, closeModal, addProduct }: Props) {
  const [form] = Form.useForm();
  const [vendorModalVisible, setVendorModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);

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
        vendor_product_name: undefined,
        product_option: undefined,
        product_price: undefined,
        product_count: undefined,
      });
      setVendorModalVisible(false);
    },
    [form],
  );

  const selectProduct = useCallback(
    (
      product_id,
      product_name,
      product_code,
      vendor_product_name,
      product_option,
      product_price,
    ) => {
      form.setFieldsValue({
        product_id,
        product_name,
        vendor_product_name,
        product_code,
        product_option,
        product_price,
        product_count: 1,
      });
      setProductModalVisible(false);
    },
    [form],
  );

  const onCloseModal = useCallback(() => {
    form.resetFields();
    closeModal();
  }, [form, closeModal]);

  return (
    <>
      <StyledModal
        centered
        width="50%"
        title={t("product.add single")}
        closeIcon={<CloseOutlined style={{ color: "#ffffff" }} />}
        visible={visible}
        onCancel={onCloseModal}
        footer={false}
      >
        <Form
          layout="horizontal"
          form={form}
          colon={false}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 12 }}
          onFinish={(value) => {
            if (addProduct(value)) {
              onCloseModal();
            }
          }}
        >
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
              setVendorModalVisible(true);
            }}
          />
          <TurtleInput // 거래처 주소 Input
            name="vendor_address"
            label={t("vendor.address")}
            disabled
          />
          <TurtleInput // 거래처 휴대번호 Input
            name="vendor_phone"
            label={t("vendor.store phone")}
            disabled
          />

          <Divider />

          <TurtleSearchInput // 상품 검색 Input
            name="product_name"
            label={t("product.name")}
            placeholder={t("placeholder.product name")}
            onSearch={() => {
              setProductModalVisible(true);
            }}
          />
          <TurtleInput
            label={t("product.vendor product name")}
            name="vendor_product_name"
            disabled
          />
          <TurtleInput label={t("product.code")} name="product_code" disabled />
          <TurtleInput label={t("product.option")} name="product_option" disabled />
          <TurtleInputNumber label={t("product.price")} name="product_price" min={0} />
          <TurtleInputNumber label={t("product.count")} name="product_count" min={1} />

          <Row justify="center">
            <TurtleButton type="default" htmlType="submit">
              {t("button.add product")}
            </TurtleButton>
          </Row>
        </Form>
      </StyledModal>

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
}

const StyledModal = styled(Modal)`
  .ant-modal-header {
    background-color: #2b3140;
  }
  .ant-modal-title {
    color: #ffffff;
  }
`;

export default AddSingleProductModal;
