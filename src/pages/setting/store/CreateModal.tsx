import { Form, Input, message, Popconfirm, Radio, Row, Select } from "antd";
import { basicDataAPI, retailerStoreAPI } from "apis";
import { AxiosError } from "axios";
import { TurtleButton, TurtleDivider, TurtleInput, TurtleModal } from "components/common";
import { t } from "i18next";
import { useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function CreateModal({ visible, closeModal }: Props) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const getBankQuery = useQuery("getBank", basicDataAPI.getBank, {
    enabled: visible,
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

  const createQuery = useMutation(["createRetailerStore"], retailerStoreAPI.create, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      message.success(t("message.success create mall"));
      queryClient.refetchQueries(["getStoreList"]);
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
      width="600px"
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
        wrapperCol={{ span: 17 }}
      >
        <TurtleInput name="name" label={t("store.name")} placeholder={t("placeholder.store")} />

        <TurtleInput
          name="store_url"
          label={t("store.url")}
          placeholder={t("placeholder.store url")}
        />

        <TurtleInput
          name={["store_mobile", "mobile"]}
          label={t("store.phone")}
          placeholder={t("placeholder.mobile")}
        />

        <Form.Item label="결제 계좌정보" required={true}>
          <Input.Group compact>
            <Form.Item
              name={["store_account", "bank"]}
              noStyle
              rules={[{ required: true }]}
              label="은행"
            >
              <Select style={{ width: "30%" }} placeholder="은행" loading={getBankQuery.isLoading}>
                {Object.values(getBankQuery.data?.data.code_set.code_list ?? []).map(
                  (bank: any) => (
                    <Select.Option key={bank} value={bank}>
                      {bank}
                    </Select.Option>
                  ),
                )}
              </Select>
            </Form.Item>
            <Form.Item
              name={["store_account", "account_number"]}
              noStyle
              rules={[{ required: true }]}
              label="계좌번호"
            >
              <Input style={{ width: "40%" }} placeholder="계좌번호" />
            </Form.Item>
            <Form.Item
              name={["store_account", "account_holder"]}
              noStyle
              rules={[{ required: true }]}
              label="예금주명"
            >
              <Input style={{ width: "30%" }} placeholder="예금주명" />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <TurtleDivider />

        <Form.Item //
          name="inventory_type"
          label="재고관리 프로그램"
          rules={[{ required: true }]}
        >
          <Select placeholder="제고관리 프로그램을 선택하세요.">
            <Select.Option value={1}>셀메이트</Select.Option>
            <Select.Option value={2}>이지어드민</Select.Option>
            <Select.Option value={3}>터틀체인</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="inventory_is_vat_included"
          label="공급가 표시방법"
          required
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value={false}>공급가만</Radio>
            <Radio value={true}>공급가 + 부가세 합산금액</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="재고프로그램 연동키">
          <Input.Group compact>
            <Form.Item name="inventory_domain" noStyle label="도메인">
              <Input style={{ width: "40%" }} placeholder="도메인" />
            </Form.Item>
            <Form.Item name="inventory_key" noStyle label="연동 key">
              <Input style={{ width: "60%" }} placeholder="연동키" />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <TurtleDivider />

        <TurtleInput
          name="email"
          label="이체내역 착신 이메일"
          required={false}
          placeholder="이체내역 착신 이메일을 입력하세요."
        />
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
              createQuery.mutate({
                ...value,
                inventory_domain: value.inventory_domain ?? "",
                inventory_key: value.inventory_key ?? "",
                email: value.email ?? "",
                alimtalk_name: value.alimtalk_name ?? "",
                store_mobile: {
                  send_alimtalk: false,
                  mobile: value.store_mobile.mobile,
                  tag: "",
                },
              });
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
