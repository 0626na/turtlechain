import { Form, Input, message, notification, Popconfirm, Switch } from "antd";
import { mistransferAPI, retailerStoreAPI } from "apis";
import { ClearingItemShow } from "apis/clearingAPI";
import { AxiosError } from "axios";
import {
  TurtleButton,
  TurtleInput,
  TurtleInputPrice,
  TurtleQuestionTooltip,
  TurtleSearchInput,
  TurtleText,
} from "components/common";
import { useStoreExist } from "hooks";
import { t } from "i18next";
import { BottomBar, MenuBar } from "layouts/main";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import LoadClearingModal from "./LoadClearingModal";

function PageBody() {
  const store = useRecoilValue(storeState);
  const isStoreExist = useStoreExist();
  const [form] = Form.useForm();
  const [loadClearingModalVisible, setLoadClearingModalVisible] = useState(false);
  const [selectedClearingItem, selectClearingItem] = useState<ClearingItemShow>();

  // 쇼핑몰 정보 요청
  const getStoreQuery = useQuery(
    ["getStore", store.id],
    () => retailerStoreAPI.get({ store_id: store.id! }),
    {
      enabled: !!store.id,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

  const createQuery = useMutation("createMistransfer", mistransferAPI.create, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      message.success(t("message.success create mistransfer"));
      resetStates();
    },
  });

  const resetStates = useCallback(() => {
    form.resetFields();
    selectClearingItem(undefined);
  }, [form, selectClearingItem]);

  useEffect(() => {
    form.setFieldsValue({
      ...form.getFieldsValue(),
      vendor_name: selectedClearingItem
        ? `${selectedClearingItem?.vendor_name} / ${selectedClearingItem?.complete_date}`
        : undefined,
      recipient_print: `${moment().format("MMDD")}터틀환불`,
    });
  }, [selectedClearingItem, form]);

  return (
    <>
      <MenuBar />
      <Form //
        layout="horizontal"
        form={form}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 7 }}
        colon={false}
      >
        <div style={{ marginBottom: 24 }}>
          <TurtleText>{t("vendor.basic info")}</TurtleText>
        </div>

        <TurtleSearchInput
          label="정산내역"
          name="vendor_name"
          placeholder={t("placeholder.vendor name")}
          onClick={() => {
            if (!isStoreExist()) return;
            setLoadClearingModalVisible(true);
          }}
        />

        <TurtleInput
          label={t("vendor.address")}
          placeholder={t("placeholder.vendor address")}
          disabled
          value={selectedClearingItem?.vendor_address}
        />

        <TurtleInput // 휴대번호 Input
          label={t("vendor.store phone")}
          placeholder={t("placeholder.store phone")}
          disabled
          value={selectedClearingItem?.ws_store_id.store_phone[0].phone}
          required
        />
        <Form.Item // 계좌 Input
          label={t("vendor.account")}
          required={true}
        >
          <Input.Group compact>
            <Form.Item noStyle rules={[{ required: true }]}>
              <Input
                value={selectedClearingItem?.bank}
                disabled={true}
                style={{ width: "30%" }}
                placeholder={t("vendor.account bank")}
              />
            </Form.Item>
            <Form.Item noStyle rules={[{ required: true }]}>
              <Input
                value={selectedClearingItem?.account_number}
                disabled={true}
                style={{ width: "40%" }}
                placeholder={t("vendor.account number")}
              />
            </Form.Item>
            <Form.Item noStyle rules={[{ required: true }]}>
              <Input
                value={selectedClearingItem?.account_holder}
                disabled={true}
                style={{ width: "30%" }}
                placeholder={t("vendor.account holder")}
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <div style={{ marginTop: 24, marginBottom: 24 }}>
          <TurtleText>오입금 반환 요청정보</TurtleText>
        </div>
        <Form.Item label={t("vendor.is vat included")} rules={[{ required: true }]} required>
          <Switch //
            checked={selectedClearingItem?.is_vat_included}
            checkedChildren={t("button.include")}
            style={{ width: "55px" }}
            disabled
          />
        </Form.Item>
        <Form.Item // 계좌 Input
          label={t("vendor.account")}
          required
        >
          <Input.Group compact>
            <Form.Item noStyle rules={[{ required: true }]}>
              <Input
                value={getStoreQuery.data?.data.store_account?.[0]?.bank}
                disabled={true}
                style={{ width: "30%" }}
                placeholder={t("vendor.account bank")}
              />
            </Form.Item>
            <Form.Item noStyle rules={[{ required: true }]}>
              <Input
                value={getStoreQuery.data?.data.store_account?.[0]?.account_number}
                name="account_number"
                disabled={true}
                style={{ width: "40%" }}
                placeholder={t("vendor.account number")}
              />
            </Form.Item>
            <Form.Item noStyle rules={[{ required: true }]}>
              <Input
                value={getStoreQuery.data?.data.store_account?.[0]?.account_holder}
                name="account_holder"
                disabled={true}
                style={{ width: "30%" }}
                placeholder={t("vendor.account holder")}
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <TurtleInput
          name="recipient_print"
          label="받는분 통장 인쇄내용"
          placeholder={t("placeholder.recipient print")}
          disabled
        />
        <Form.Item
          name="refund_amt"
          label={
            <>
              {t("mistransfer.deposit price")}
              <TurtleQuestionTooltip content="입금 확인 시, 해당 내용으로 확인 바랍니다." />
            </>
          }
          rules={[{ required: true, message: "오입금 환불 요청금액 입력해주세요" }]}
          required
        >
          <TurtleInputPrice
            style={{ width: "100%" }}
            max={selectedClearingItem?.clearing_amount}
            placeholder={t("placeholder.requested deposit price")}
          />
        </Form.Item>
        <TurtleInput // 오입금 반환 요청사유 Input
          label={t("mistransfer.memo")}
          placeholder={t("placeholder.mistransfer memo")}
          name="memo"
          required
        />
      </Form>

      <LoadClearingModal
        visible={loadClearingModalVisible}
        closeModal={() => {
          setLoadClearingModalVisible(false);
        }}
        selectClearingItem={selectClearingItem}
      />

      <BottomBar justify="end">
        <Popconfirm
          title={t("description.really register")}
          okText={t("yes")}
          cancelText={t("no")}
          onConfirm={() => {
            form.validateFields().then(() => {
              createQuery.mutate({
                ...form.getFieldsValue(),
                ws_store_id: selectedClearingItem?.ws_store_id.id,
                rt_store_id: store.id,
                is_vat_included: selectedClearingItem?.is_vat_included,
                clearing_item_id: selectedClearingItem?.id,
              });
            });
          }}
        >
          <TurtleButton type="primary" disabled={!store.id} loading={createQuery.isLoading}>
            {t("mistransfer.create")}
          </TurtleButton>
        </Popconfirm>
      </BottomBar>
    </>
  );
}

export default PageBody;
