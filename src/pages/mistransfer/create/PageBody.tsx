import { Form, Input, message, notification, Popconfirm, Switch, Typography } from "antd";
import { mistransferAPI, retailerStoreAPI } from "apis";
import { ClearingItemShow } from "apis/clearingAPI";
import { AxiosError } from "axios";
import {
  TurtleButton,
  TurtleInput,
  TurtleInputPrice,
  TurtleSearchInput,
  TurtleText,
} from "components/common";
import { useStoreExist } from "hooks";
import { t } from "i18next";
import { BottomBar, MenuBar } from "layouts/main";
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
    () => retailerStoreAPI.getStore(store.id),
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
      notification.open({
        type: "success",
        message: "성공적으로 등록하였습니다.",
      });
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
      vendor_name: selectedClearingItem?.vendor_name,
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
        <TurtleText>{t("vendor.basic info")}</TurtleText>

        <TurtleSearchInput
          label={t("vendor.name")}
          name="vendor_name"
          placeholder={t("placeholder.vendor name")}
          onClick={() => {
            if (!isStoreExist()) return;
            setLoadClearingModalVisible(true);
          }}
        />

        <TurtleInput
          label={t("clearing.date")}
          placeholder={t("placeholder.clearing date")}
          disabled
          value={selectedClearingItem?.complete_date}
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

        <TurtleText>오입금 반환 요청정보</TurtleText>
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
        <Form.Item
          name="refund_amt"
          label={t("mistransfer.deposit price")}
          rules={[{ required: true }]}
          required
        >
          <TurtleInputPrice
            style={{ width: "100%" }}
            max={selectedClearingItem?.total_price}
            placeholder={t("placeholder.requested deposit price")}
          />
        </Form.Item>
        <TurtleInput
          name="recipient_print"
          label="받는분 통장 인쇄내용"
          placeholder={t("placeholder.recipient print")}
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
