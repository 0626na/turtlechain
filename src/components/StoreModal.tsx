// lang
import { useTranslation } from "react-i18next";
// async
import { AxiosError } from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import retailerStoreAPI from "apis/retailerStoreAPI";
// antd
import { Modal, Form, Input, message } from "antd";

interface Props {
  type: "create" | "update";
  visible: boolean;
  store_id?: number;
  onClose: () => void;
}

const StoreModal = function ({ type, visible, store_id, onClose }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const requiredRules = [
    { required: true, message: t("description.required item") },
  ];

  // 쇼핑몰 정보 요청
  useQuery(["getStore"], () => retailerStoreAPI.getStore(store_id), {
    enabled: type === "update" && visible && store_id ? true : false,
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      form.setFieldsValue(data.data);
    },
  });

  // 추가하기 요청
  const createQuery = useMutation(["createQuery"], retailerStoreAPI.create, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {},
  });

  // 수정하기 요청
  const updateeQuery = useMutation(["updateeQuery"], retailerStoreAPI.update, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {},
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
        if (type === "create") {
          createQuery.mutate(value);
        } else {
          updateeQuery.mutate({ ...value, store_id });
        }
      });
  };

  return (
    <Modal
      closable={false}
      maskClosable={false}
      title={type === "create" ? t("create mall") : t("update mall")}
      visible={visible}
      cancelText={t("close")}
      okText={type === "create" ? t("create mall") : t("update mall")}
      onCancel={handleClose}
      onOk={handleSubmit}
      confirmLoading={createQuery.isLoading || updateeQuery.isLoading}
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

export default StoreModal;
