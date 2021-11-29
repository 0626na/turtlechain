// lang
import { useTranslation } from "react-i18next";
// async
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import retailerStoreAPI from "apis/retailerStoreAPI";
// antd
import { Modal, Form, Input, message, notification } from "antd";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateStoreModal = function ({ visible, onClose, onSuccess }: Props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const requiredRules = [
    { required: true, message: t("description.required item") },
  ];

  // 추가하기 요청
  const createQuery = useMutation(["createQuery"], retailerStoreAPI.create, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      onSuccess && onSuccess();
      handleClose();
      notification.open({
        type: "success",
        message: t("message.success create mall"),
      });
    },
  });

  // 모달 닫기
  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  // 데이터 전송
  const handleSubmit = () => {
    form //
      .validateFields()
      .then((value) => {
        createQuery.mutate(value);
      });
  };

  return (
    <Modal
      closable={false}
      maskClosable={false}
      title={t("create mall")}
      visible={visible}
      cancelText={t("close")}
      okText={t("create mall")}
      onCancel={handleClose}
      onOk={handleSubmit}
      confirmLoading={createQuery.isLoading}
    >
      <Form //
        form={form}
        layout="vertical"
      >
        <Form.Item //
          name="name"
          label={t("mall name")}
          rules={requiredRules}
        >
          <Input />
        </Form.Item>
        <Form.Item //
          name="alimtalk_name"
          label={t("alimtalk name")}
        >
          <Input />
        </Form.Item>
        <Form.Item //
          name="mall_url"
          label={t("mall url")}
          rules={requiredRules}
        >
          <Input />
        </Form.Item>
        <Form.Item //
          name="phone"
          label={t("mall phone")}
          rules={requiredRules}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateStoreModal;
