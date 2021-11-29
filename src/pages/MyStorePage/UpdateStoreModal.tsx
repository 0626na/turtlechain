// lang
import { useTranslation } from "react-i18next";
// async
import { AxiosError } from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import retailerStoreAPI from "apis/retailerStoreAPI";
// antd
import { Modal, Form, Input, message, notification } from "antd";

interface Props {
  visible: boolean;
  store_id?: number;
  onClose: () => void;
  onSuccess?: () => void;
}

const UpdateStoreModal = function ({
  visible,
  store_id,
  onClose,
  onSuccess,
}: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const requiredRules = [
    { required: true, message: t("description.required item") },
  ];

  // 쇼핑몰 정보 요청
  useQuery(["getStore"], () => retailerStoreAPI.getStore(store_id), {
    enabled: visible && store_id ? true : false,
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      form.setFieldsValue(data.data);
    },
  });

  // 수정하기 요청
  const updateeQuery = useMutation(["updateeQuery"], retailerStoreAPI.update, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      onSuccess && onSuccess();
      handleClose();
      notification.open({
        type: "success",
        message: t("message.success update mall"),
      });
    },
  });

  // 모달 닫기
  const handleClose = () => {
    form.resetFields();
    queryClient.removeQueries(["getStore"]);
    onClose();
  };

  // 데이터 전송
  const handleSubmit = () => {
    form //
      .validateFields()
      .then((value) => {
        updateeQuery.mutate({ ...value, store_id });
      });
  };

  return (
    <Modal
      closable={false}
      maskClosable={false}
      title={t("update mall")}
      visible={visible}
      cancelText={t("close")}
      okText={t("update mall")}
      onCancel={handleClose}
      onOk={handleSubmit}
      confirmLoading={updateeQuery.isLoading}
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

export default UpdateStoreModal;
