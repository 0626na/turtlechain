// lang
import { t } from "i18next";
// async
import { AxiosError } from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import retailerStoreAPI from "apis/retailerStoreAPI";
// antd
import { Modal, Form, Input, message, notification, Radio, Typography, Select } from "antd";

interface Props {
  visible: boolean;
  store_id?: number;
  onClose: () => void;
  onSuccess?: () => void;
}

function UpdateStoreModal({ visible, store_id, onClose, onSuccess }: Props) {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const requiredRules = [{ required: true, message: t("description.required item") }];

  // 쇼핑몰 정보 요청
  const { data: storeData } = useQuery(
    ["getStore"],
    () => retailerStoreAPI.get({ store_id: store_id ?? -1 }),
    {
      enabled: visible && store_id ? true : false,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        form.setFieldsValue(data.data);
      },
    },
  );

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
      title={t("store.update")}
      visible={visible}
      cancelText={t("close")}
      okText={t("store.update")}
      onCancel={handleClose}
      onOk={handleSubmit}
      confirmLoading={updateeQuery.isLoading}
    >
      <Form //
        form={form}
        layout="vertical"
      ></Form>
    </Modal>
  );
}

export default UpdateStoreModal;
