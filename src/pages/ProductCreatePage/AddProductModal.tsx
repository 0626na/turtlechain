import { Divider, Form, Input, message, Modal, Row, Space } from "antd";
import { t } from "i18next";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import { ProductShow } from "apis/excelAPI";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import { productAPI } from "apis";
import TurtleSearchInput from "components/common/TurtleSearchInput";
import TurtleInput from "components/common/TurtleInput";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import TurtleInputNumber from "components/common/TurtleInputNumber";
import TurtleTextArea from "components/common/TurtleTextArea";
import TurtleButton from "components/common/TurtleButton";
import SearchVendorModal from "components/SearchVendorModal";

interface Props {
  visible: boolean;
  closeModal: () => void;
  addProduct: (item: ProductShow) => boolean;
}

function AddSingleProductModal({ visible, closeModal, addProduct }: Props) {
  const store = useRecoilValue(storeState);
  const [form] = Form.useForm();
  const [vendorModalVisible, setVendorModalVisible] = useState(false);

  const getProductCodeQuery = useQuery(
    "getProductCode", //
    () =>
      productAPI.getCode({
        rt_store_id: store.id!,
        vendor_id: form.getFieldValue("vendor_id"),
      }),
    {
      enabled: false,
      onSuccess: (data) => {
        form.setFieldsValue({ ...form.getFieldsValue, vendor_id: data.data });
      },
    },
  );

  const selectVendor = useCallback(
    (vendor_id, vendor_name, vendor_address, vendor_phone) => {
      form.setFieldsValue({
        vendor_id,
        vendor_name,
        vendor_address,
        vendor_phone,
        product_code: undefined,
      });
      setVendorModalVisible(false);
    },
    [form],
  );

  const onCloseModal = useCallback(() => {
    form.resetFields();
    closeModal();
  }, [form, closeModal]);

  const createProductCode = useCallback(() => {
    if (!form.getFieldValue("vendor_id")) {
      message.warn("거래처를 선택해 주세요.");
      return;
    }
    getProductCodeQuery.refetch();
  }, []);

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
          <Form.Item name="rt_store_id" hidden>
            <Input hidden />
          </Form.Item>
          <Form.Item name="vendor_id" hidden>
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
            disabled={true}
          />
          <TurtleInput // 거래처 휴대번호 Input
            name="vendor_phone"
            label={t("vendor.store phone")}
            disabled={true}
          />
          <Divider />
          <TurtleInput label="상품명" name="name" required={true} />
          <TurtleInput label="거래처 상품명" name="vendor_product_name" required={true} />
          <Form.Item // 거래처 코드 Input
            required
            label={t("product.code")}
            style={{ marginBottom: 0 }}
          >
            <Space>
              <Form.Item
                name="product_code"
                rules={[{ required: true, message: "상품 바코드 입력해 주세요" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <TurtleButtonSub color="blue" onClick={createProductCode}>
                  코드 만들기
                </TurtleButtonSub>
              </Form.Item>
            </Space>
          </Form.Item>
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
