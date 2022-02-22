import { Form, Input, message, Modal, notification, Row } from "antd";
import { productAPI } from "apis";
import { Product } from "apis/productAPI";
import { AxiosError } from "axios";
import TurtleButton from "components/common/TurtleButton";
import TurtleInput from "components/common/TurtleInput";
import TurtleInputNumber from "components/common/TurtleInputNumber";
import TurtleText from "components/common/TurtleText";
import TurtleTextArea from "components/common/TurtleTextArea";
import { t } from "i18next";
import { useCallback, useEffect } from "react";
import { useMutation } from "react-query";

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow?: Product;
}

function UpdateProductModal({ visible, closeModal, selectedRow }: Props) {
  const [form] = Form.useForm();

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
      vendor_phone: "임시번호",
      //vendor_phone: selectedRow?.vendor_info.vendor
    });
  }, [selectedRow]);

  const onClickUpdate = useCallback(async () => {
    form.validateFields().then(() => {
      updateProductQuery.mutate({ ...form.getFieldsValue() });
    });
  }, [form, closeModal]);

  return (
    <Modal
      centered
      width="80%"
      maskClosable={false}
      getContainer={false}
      forceRender
      title={t("product.update info")}
      visible={visible}
      footer={false}
      onCancel={closeModal}
    >
      <Form
        layout="horizontal"
        form={form}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 7 }}
        colon={false}
      >
        <Form.Item name="id" hidden>
          <Input hidden />
        </Form.Item>
        <TurtleText>{t("product.basic info")}</TurtleText>
        <TurtleInput label="상품명" name="name" required={true} />
        <TurtleInput
          label="거래처 상품명"
          name="vendor_product_name"
          required={true}
          disabled={true}
        />
        <TurtleInput label="상품 바코드 번호" name="product_code" disabled={true} />
        <TurtleInput label="옵션" name="option" />
        <TurtleInputNumber label="공급가" name="price" min={0} />
        <TurtleInput label="상품 이미지 URL" name="image_url" required={false} disabled={true} />
        <TurtleTextArea // 메모 TextArea
          required={false}
          name="memo"
          label={t("vendor.memo")}
          placeholder={t("placeholder.memo")}
          rows={5}
        />
        <TurtleText>{t("vendor.basic info")}</TurtleText>
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
        <Row justify="end">
          <TurtleButton
            type="primary"
            loading={updateProductQuery.isLoading}
            onClick={onClickUpdate}
          >
            {t("button.update")}
          </TurtleButton>
        </Row>
      </Form>
    </Modal>
  );
}

export default UpdateProductModal;
