import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Form, Input, Button, InputNumber, Card, Select, Row, message } from "antd";
import TurtleSearchInput from "components/common/TurtleSearchInput";
import { useCallback, useState } from "react";
import { Wholesale } from "apis/vendorAPI";
import { AdjustmentItem } from "apis/adjustmentAPI";
import SearchWholesaleModal from "pages/VendorCreatePage/SearchWholesaleModal";
import TurtleInput from "components/common/TurtleInput";
import TurtleInputNumber from "components/common/TurtleInputNumber";
import TurtleSelect from "components/common/TurtleSelect";
import TurtleInputSelect from "components/common/TurtleInputSelect";
import { BaseOptionType } from "antd/lib/select";
import TurtleButton from "components/common/TurtleButton";
import { FormProvider } from "antd/lib/form/context";
import SearchVendorModal from "components/SearchVendorModal";
import SearchProductModal from "components/SearchProductModal";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import TurtleTextArea from "components/common/TurtleTextArea";

interface Props {
  onAdjItemCreated: (value: AdjustmentItem) => void;
}

const AdjustmentCreateForm = function ({ onAdjItemCreated }: Props) {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const [vendorModalVisible, setVendorModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);

  const store = useRecoilValue(storeState);
  // 거래처 검색 모달
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const closeSearchModal = () => {
    setSearchModalVisible(false);
  };
  const [adjList, setAdjList] = useState<Array<AdjustmentItem>>();

  const onClickCreate = () => {
    form.validateFields().then(() => {
      onAdjItemCreated({
        ...form.getFieldsValue(),
      });
      form.resetFields();
    });
  };
  const selectOptions: BaseOptionType[] = [
    { name: "미송", value: "reserve" },
    { name: "교환", value: "exchange" },
    { name: "반품", value: "takeback" },
    { name: "잔", value: "balance" },
    { name: "기타", value: "extra" },
  ];
  // 거래처 선택후 폼에 채워넣기
  // 거래처 선택후 폼에 채워넣기
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
        product_price: undefined,
        product_count: undefined,
      });
      setVendorModalVisible(false);
    },
    [form],
  );

  const selectProduct: (
    product_id: number,
    product_name: string,
    vendor_product_name: string,
    product_code: string,
    product_option: string,
    product_price: number,
  ) => void = useCallback(
    (
      product_id: number,
      product_name: string,
      vendor_product_name: string,
      product_code: string,
      product_option: string,
      product_price: number,
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

  return (
    <>
      <SearchVendorModal
        visible={vendorModalVisible}
        closeModal={closeSearchModal}
        onClickSelect={selectVendor}
      />

      <SearchProductModal
        visible={productModalVisible}
        closeModal={() => {
          setProductModalVisible(false);
        }}
        vendorId={form.getFieldValue("vendor_id")}
        onClickSelect={selectProduct}
      />

      <Form //
        layout="horizontal"
        form={form}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 8 }}
        colon={false}
      >
        <Form.Item name="rt_store_id" hidden>
          <Input hidden />
        </Form.Item>
        <Form.Item name="ws_store_id" hidden>
          <Input hidden />
        </Form.Item>

        <Form.Item name="vendor_id" hidden>
          <Input hidden />
        </Form.Item>

        <TurtleSearchInput //
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
        />

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
        <TurtleInput // 거래처상품명 Input
          name="vendor_product_name"
          label={t("product.vendor_product_name")}
        />

        <TurtleInput // 옵션Input
          name="product_option"
          label={t("product.option")}
        />

        <TurtleInputNumber // count Input
          name="adj_count"
          label={t("product.count")}
        />

        <TurtleInput // price Input
          name="product_price"
          label={t("product.price")}
        />

        <TurtleInputSelect label={t("adjustment.type.default")} selectOptions={selectOptions} />
        <TurtleTextArea
          label={t("adjustment.memo")}
          name="memo"
          placeholder={t("adjustment.placeholder")}
          rows={5}
          required={false}
        />

        <Row justify="center">
          <TurtleButton type="default" onClick={onClickCreate}>
            {t("button.add")}
          </TurtleButton>
        </Row>
      </Form>
    </>
  );
};

const ItemGroup = styled.div`
  display: flex;
  & > * + * {
    margin-left: 10px;
  }
`;

export default AdjustmentCreateForm;
