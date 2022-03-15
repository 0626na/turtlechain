import { Divider, Form, Input, message, Modal, notification, Popconfirm, Row } from "antd";
import { productAPI } from "apis";
import { Product } from "apis/productAPI";
import { AxiosError } from "axios";
import TurtleButton from "components/common/TurtleButton";
import TurtleInput from "components/common/TurtleInput";
import TurtleInputNumber from "components/common/TurtleInputNumber";
import TurtleTextArea from "components/common/TurtleTextArea";
import { t } from "i18next";
import { useCallback, useEffect } from "react";
import { useMutation } from "react-query";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow?: Product;
}

function UpdateProductModal({ visible, closeModal, selectedRow }: Props) {
  const [form] = Form.useForm();

  // 상품 수정 요청
  const updateProductQuery = useMutation("updateProduct", productAPI.updateProduct, {
    onSuccess: (data) => {
      notification.open({
        type: "success",
        message: "성공적으로 수정하였습니다.",
      });
      closeModal();
    },
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

  // 모달 렌더링 될 때 상품정보 채워주기
  useEffect(() => {
    form.setFieldsValue({
      id: selectedRow?.id,
      name: selectedRow?.name,
      vendor_product_name: selectedRow?.vendor_product_name,
      product_code: selectedRow?.product_code,
      option: selectedRow?.option,
      price: selectedRow?.price,
      image_url: selectedRow?.image_url,
      memo: selectedRow?.memo,
      vendor_name: selectedRow?.vendor_info.vendor_name,
      vendor_address: selectedRow?.vendor_info.vendor_address,
      vendor_phone: selectedRow?.vendor_info.vendor_phone.phone,
    });
  }, [selectedRow]);

  // 수정버튼 클릭
  const onClickUpdate = useCallback(async () => {
    form.validateFields().then(() => {
      updateProductQuery.mutate({ ...form.getFieldsValue() });
    });
  }, [form, closeModal]);

  return (
    <StyledModal
      centered
      width="50%"
      title={t("product.update info")}
      closeIcon={<CloseOutlined style={{ color: "#ffffff" }} />}
      visible={visible}
      onCancel={closeModal}
      footer={false}
    >
      <Form
        layout="horizontal"
        form={form}
        colon={false}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 12 }}
      >
        <Form.Item name="id" hidden>
          <Input hidden />
        </Form.Item>

        <TurtleInput // 거래처명 Input
          name="vendor_name"
          label={t("vendor.name")}
          disabled={true}
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
        <TurtleInput // 상품명 Input
          label={t("product.name")}
          name="name"
          required={true}
        />
        <TurtleInput // 거래처 상품명 Input
          label={t("product.vendor product name")}
          name="vendor_product_name"
          required={true}
          disabled={true}
        />
        <TurtleInput // 상품 바코드 Input
          label={t("product.code")}
          name="product_code"
          disabled={true}
        />
        <TurtleInput // 옵션 Input
          label={t("product.option")}
          name="option"
        />
        <TurtleInputNumber //
          label={t("product.price")}
          name="price"
          min={0}
        />
        <TurtleInput //
          label={t("product.image url")}
          name="image_url"
          required={false}
          disabled={true}
        />
        <TurtleTextArea // 메모 TextArea
          required={false}
          label={t("vendor.memo")}
          name="memo"
          placeholder={t("placeholder.memo")}
          rows={5}
        />
        <Row justify="center">
          <Popconfirm
            title={t("description.really update")}
            okText={t("yes")}
            cancelText={t("no")}
            onConfirm={onClickUpdate}
          >
            <TurtleButton // 수정하기 Button
              type="primary"
              loading={updateProductQuery.isLoading}
            >
              {t("button.update")}
            </TurtleButton>
          </Popconfirm>
        </Row>
      </Form>
    </StyledModal>
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

export default UpdateProductModal;
