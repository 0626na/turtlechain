import { Form, Input, message, notification, Popconfirm, Radio, Row, Select } from "antd";
import { retailerStoreAPI } from "apis";
import { StoreShow } from "apis/retailerStoreAPI";
import { AxiosError } from "axios";
import { TurtleButton, TurtleModal } from "components/common";
import { t } from "i18next";
import { useCallback, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow?: StoreShow;
}

function UpdateModal({ visible, closeModal, selectedRow }: Props) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const updateQuery = useMutation(["updateStore"], retailerStoreAPI.update, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      notification.open({
        type: "success",
        message: t("message.success update mall"),
      });
      queryClient.refetchQueries(["getStoreList"]);
      closeModal();
    },
  });

  const resetStates = useCallback(() => {
    const { id, is_closed, name, mall_url, phone, order_formats, alimtalk_name } =
      selectedRow || {};
    form.setFieldsValue({
      store_id: id,
      is_closed,
      name,
      mall_url,
      phone,
      order_formats,
      alimtalk_name,
    });
  }, [selectedRow, form]);

  useEffect(() => {
    resetStates();
  }, [visible, resetStates]);

  const requiredRules = [{ required: true, message: t("description.required item") }];

  return (
    <TurtleModal
      centered
      width="520px"
      title={t("store.update")}
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
        <Form.Item name="store_id" hidden>
          <Input hidden />
        </Form.Item>
        <Form.Item //
          name="is_closed"
          label={t("biz status")}
          rules={requiredRules}
        >
          <Radio.Group>
            <Radio value={false}>{t("status.open")}</Radio>
            <Radio value={true}>{t("status.closed")}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item //
          name="name"
          label={t("store.name")}
          rules={requiredRules}
        >
          <Input />
        </Form.Item>
        <Form.Item //
          name="mall_url"
          label={t("store.url")}
          rules={requiredRules}
        >
          <Input />
        </Form.Item>
        <Form.Item //
          name="phone"
          label={t("store.phone")}
          rules={requiredRules}
        >
          <Input />
        </Form.Item>
        <Form.Item //
          name="order_formats"
          label="재고관리 프로그램"
          rules={requiredRules}
        >
          <Select placeholder="제고관리 프로그램을 선택해주세요">
            <Select.Option value={1}>셀메이트</Select.Option>
            <Select.Option value={2}>이지어드민</Select.Option>
            <Select.Option value={3}>터틀체인</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item //
          name="alimtalk_name"
          label={t("store.alimtalk name")}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item>
          <Typography.Text>
            {t("created time")} : {storeData?.data.created_time}({storeData?.data.created_by})
          </Typography.Text>
          <br />
          <Typography.Text>
            {t("updated time")} : {storeData?.data.updated_time}({storeData?.data.updated_by})
          </Typography.Text>
        </Form.Item> */}
      </Form>

      <Row justify="end">
        <Popconfirm
          title={t("description.really update")}
          okText={t("yes")}
          cancelText={t("no")}
          onConfirm={() => {
            form.validateFields().then((value) => {
              updateQuery.mutate(value);
            });
          }}
        >
          <TurtleButton // 수정하기 Button
            type="primary"
            loading={updateQuery.isLoading}
          >
            {t("button.update")}
          </TurtleButton>
        </Popconfirm>
      </Row>
    </TurtleModal>
  );
}

export default UpdateModal;
