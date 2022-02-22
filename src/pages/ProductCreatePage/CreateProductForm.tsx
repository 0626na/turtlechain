import { Form, Input, message, notification, Popconfirm, Row } from "antd";
import { productAPI } from "apis";
import { AxiosError } from "axios";
import TurtleButton from "components/common/TurtleButton";
import TurtleInput from "components/common/TurtleInput";
import TurtleInputNumber from "components/common/TurtleInputNumber";
import TurtleSearchInput from "components/common/TurtleSearchInput";
import TurtleText from "components/common/TurtleText";
import TurtleTextArea from "components/common/TurtleTextArea";
import SearchVendorModal from "components/SearchVendorModal";
import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";

function CreateProductForm() {
  const store = useRecoilValue(storeState);
  const [form] = Form.useForm();
  const [vendorModalVisible, setVendorModalVisible] = useState(false);

  const selectVendor = useCallback(
    (vendor_id, vendor_name, vendor_address, vendor_phone) => {
      form.setFieldsValue({
        vendor_id,
        vendor_name,
        vendor_address,
        vendor_phone,
      });
      setVendorModalVisible(false);
    },
    [form],
  );

  const createProductQuery = useMutation("createProduct", productAPI.createProduct, {
    onSuccess: (data) => {
      notification.open({
        type: "success",
        message: "성공적으로 등록하였습니다.",
      });
    },
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

  useEffect(() => {
    form.setFieldsValue({
      ...form.getFieldsValue(),
      rt_store_id: store.id,
    });
  }, [store.id, form]);

  const onClickCreate = useCallback(() => {
    form.validateFields().then(() => {
      createProductQuery.mutate([{ ...form.getFieldsValue() }]);
      form.resetFields();
      form.setFieldsValue({
        rt_store_id: store.id,
      });
    });
  }, [store.id, form]);

  return (
    <>
      <Form
        layout="horizontal"
        form={form}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 7 }}
        colon={false}
      >
        <Form.Item name="rt_store_id" hidden>
          <Input hidden />
        </Form.Item>
        <Form.Item name="vendor_id" hidden>
          <Input hidden />
        </Form.Item>
        <TurtleText>{t("product.basic info")}</TurtleText>
        <TurtleInput label="상품명" name="name" required={true} />
        <TurtleInput label="거래처 상품명" name="vendor_product_name" required={true} />
        <TurtleInput label="상품 바코드 번호" name="product_code" />
        <TurtleInput label="옵션" name="option" />
        <TurtleInputNumber label="공급가" name="price" min={0} />
        <TurtleInput label="상품 이미지 URL" name="image_url" required={false} />
        <TurtleTextArea // 메모 TextArea
          required={false}
          name="memo"
          label={t("vendor.memo")}
          placeholder={t("placeholder.memo")}
          rows={5}
        />
        <TurtleText>{t("vendor.basic info")}</TurtleText>
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
          label={t("vendor.store phone")}
          disabled={true}
        />
        <Row justify="end">
          <Popconfirm
            title={t("description.really register")}
            okText={t("yes")}
            cancelText={t("no")}
            onConfirm={onClickCreate}
          >
            <TurtleButton
              type="primary"
              disabled={!store.id}
              loading={createProductQuery.isLoading}
            >
              {t("product.create")}
            </TurtleButton>
          </Popconfirm>
        </Row>
      </Form>
      {/* 거래처 검색 모달 */}
      <SearchVendorModal
        visible={vendorModalVisible}
        closeModal={() => {
          setVendorModalVisible(false);
        }}
        onClickSelect={selectVendor}
      />
    </>
  );
}

export default CreateProductForm;
