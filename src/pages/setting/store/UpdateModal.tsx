import { Form, Input, message, notification, Popconfirm, Radio, Row, Select } from "antd";
import { basicDataAPI, retailerStoreAPI } from "apis";
import { StoreShow } from "apis/retailerStoreAPI";
import { AxiosError } from "axios";
import { TurtleButton, TurtleDivider, TurtleInput, TurtleModal } from "components/common";
import { t } from "i18next";
import { useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow?: StoreShow;
}

function UpdateModal({ visible, closeModal, selectedRow }: Props) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const getBankQuery = useQuery("getBank", basicDataAPI.getBank, {
    enabled: visible,
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

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
    const {
      id,
      store_url,
      is_closed,
      name,
      inventory_type,
      inventory_is_vat_included,
      inventory_domain,
      inventory_key,
      email,
      alimtalk_name,
    } = selectedRow || {};
    form.setFieldsValue({
      store_id: id,
      is_closed,
      store_url,
      name,
      mobile: selectedRow?.store_phone[0].phone,
      bank: selectedRow?.store_account[0].bank,
      account_number: selectedRow?.store_account[0].account_number,
      account_holder: selectedRow?.store_account[0].account_holder,
      inventory_type,
      inventory_is_vat_included,
      inventory_domain,
      inventory_key,
      email,
      alimtalk_name,
    });
  }, [selectedRow, form]);

  useEffect(() => {
    if (!visible) return;
    resetStates();
  }, [visible, resetStates]);

  const requiredRules = [{ required: true, message: t("description.required item") }];

  return (
    <TurtleModal
      centered
      width="600px"
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
        wrapperCol={{ span: 17 }}
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
          name="store_url"
          label={t("store.url")}
          rules={requiredRules}
        >
          <Input placeholder={t("placeholder.store url")} />
        </Form.Item>

        <Form.Item //
          name="mobile"
          label={t("store.phone")}
          rules={requiredRules}
        >
          <Input placeholder={t("placeholder.mobile")} />
        </Form.Item>

        <Form.Item label="결제 계좌정보" required={true}>
          <Input.Group compact>
            <Form.Item name={"bank"} noStyle rules={[{ required: true }]} label="은행">
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
              name={"account_number"}
              noStyle
              rules={[{ required: true }]}
              label="계좌번호"
            >
              <Input style={{ width: "40%" }} placeholder="계좌번호" />
            </Form.Item>
            <Form.Item
              name={"account_holder"}
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
          rules={requiredRules}
        >
          <Select placeholder="제고관리 프로그램을 선택해주세요" disabled>
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
          <Radio.Group disabled>
            <Radio value={false}>공급가만</Radio>
            <Radio value={true}>공급가 + 부가세 합산금액</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="재고프로그램 연동키">
          <Input.Group compact>
            <Form.Item name="inventory_domain" noStyle label="도메인">
              <Input
                style={{ width: "40%" }}
                placeholder="도메인"
                disabled={selectedRow?.inventory_type === 2}
              />
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
          title={t("description.really update")}
          okText={t("yes")}
          cancelText={t("no")}
          onConfirm={() => {
            form.validateFields().then((value) => {
              updateQuery.mutate({
                store_id: value.store_id,
                is_closed: value.is_closed,
                name: value.name,
                store_url: value.store_url,
                store_mobile: {
                  mobile: value.mobile,
                },
                store_account: {
                  bank: value.bank,
                  account_number: value.account_number,
                  account_holder: value.account_holder,
                },
                inventory_type: value.inventory_type,
                inventory_domain: value.inventory_type === 2 ? "" : value.inventory_domain,
                inventory_key: value.inventory_key,
                inventory_is_vat_included: value.inventory_is_vat_included,
                email: value.email,
                alimtalk_name: value.alimtalk_name,
              });
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
