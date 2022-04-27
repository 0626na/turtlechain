import { Form, message, notification, Popconfirm, Row, Select } from "antd";
import { retailerStoreAPI } from "apis";
import { AxiosError } from "axios";
import { TurtleButton, TurtleInput, TurtleModal } from "components/common";
import { t } from "i18next";
import { useCallback, useEffect } from "react";
import { useMutation } from "react-query";

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function CreateModal({ visible, closeModal }: Props) {
  const [form] = Form.useForm();

  const createQuery = useMutation(["createRetailerStore"], retailerStoreAPI.create, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      notification.open({
        type: "success",
        message: t("message.success create mall"),
      });
      closeModal();
    },
  });

  const resetFields = useCallback(() => {
    form.resetFields();
  }, [form]);

  useEffect(() => {
    resetFields();
  }, [visible, resetFields]);

  return (
    <TurtleModal
      centered
      width="520px"
      title={t("store.create")}
      visible={visible}
      onCancel={closeModal}
      footer={false}
    >
      <Form
        layout="horizontal"
        form={form}
        colon={false}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 16 }}
      >
        <TurtleInput name="name" label={t("store.name")} placeholder={t("placeholder.store")} />

        <TurtleInput
          name="mall_url"
          label={t("store.url")}
          placeholder={t("placeholder.store url")}
        />

        <TurtleInput name="phone" label={t("store.phone")} placeholder={t("placeholder.mobile")} />

        <Form.Item //
          name="order_formats"
          label="재고관리 프로그램"
          rules={[{ required: true }]}
        >
          <Select placeholder="제고관리 프로그램을 선택하세요.">
            <Select.Option value={1}>셀메이트</Select.Option>
            <Select.Option value={2}>이지어드민</Select.Option>
            <Select.Option value={3}>터틀체인</Select.Option>
          </Select>
        </Form.Item>

        <TurtleInput
          name="alimtalk_name"
          label={t("store.alimtalk name")}
          required={false}
          placeholder={t("placeholder.alimtalk")}
        />
      </Form>

      <Row justify="end">
        <Popconfirm
          title={t("description.really register")}
          okText={t("yes")}
          cancelText={t("no")}
          onConfirm={() => {
            form.validateFields().then((value) => {
              createQuery.mutate(value);
            });
          }}
        >
          <TurtleButton // 수정하기 Button
            type="primary"
            loading={createQuery.isLoading}
          >
            {t("button.add")}
          </TurtleButton>
        </Popconfirm>
      </Row>
    </TurtleModal>
  );
}

export default CreateModal;
