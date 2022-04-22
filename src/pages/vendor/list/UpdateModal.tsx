import { Form, Input, message, notification, Popconfirm, Row, Select, Upload } from "antd";
import { VendorShow } from "apis/vendorAPI";
import { t } from "i18next";
import { TurtleButton, TurtleButtonSub, TurtleInput, TurtleModal } from "components/common";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { basicDataAPI, bucketListAPI } from "apis";
import { AxiosError } from "axios";

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow?: VendorShow;
}

function UpdateModal({ visible, closeModal, selectedRow }: Props) {
  const [form] = Form.useForm();
  const [address, setAddress] = useState({ building: "", floor: "" });

  const getAddressQuery = useQuery("getAdress", basicDataAPI.getAddress, {
    enabled: visible,
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

  const getBankQuery = useQuery("getBank", basicDataAPI.getBank, {
    enabled: visible,
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

  const createQuery = useMutation("createBucketList", bucketListAPI.create, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      notification.open({
        type: "success",
        message: "성공적으로 등록하였습니다.",
      });
      resetStates();
      closeModal();
    },
  });

  const resetStates = useCallback(() => {
    form.setFieldsValue({
      name: selectedRow?.vendor_name,
      tel: selectedRow?.ws_store_info.phone,
      mobile: selectedRow?.vendor_phone.phone,
      building: selectedRow?.ws_store_info.building,
      floor: selectedRow?.ws_store_info.floor,
      col: selectedRow?.ws_store_info.col,
      loc: selectedRow?.ws_store_info.loc,
      ext: selectedRow?.ws_store_info.ext,
      banks: {
        bank: selectedRow?.vendor_account.bank,
        account_number: selectedRow?.vendor_account.account_number,
        account_holder: selectedRow?.vendor_account.account_holder,
      },
    });
    setAddress({
      building: selectedRow?.ws_store_info.building ?? "",
      floor: selectedRow?.ws_store_info.floor ?? "",
    });
  }, [form, selectedRow]);

  useEffect(() => {
    resetStates();
  }, [visible, resetStates]);

  return (
    <TurtleModal
      centered
      width="520px"
      title={t("vendor.request update")}
      visible={visible}
      onCancel={closeModal}
      footer={false}
      forceRender
    >
      <Form //
        layout="horizontal"
        form={form}
        colon={false}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 16 }}
      >
        <TurtleInput // 거래처명 검색 Input
          name="name"
          label={t("vendor.name")}
          placeholder={t("placeholder.vendor name")}
          required={true}
        />
        <TurtleInput // 거래처 매장번호 Input
          name="tel"
          label={t("vendor.phone")}
          placeholder={t("placeholder.phone")}
          required={true}
        />
        <TurtleInput // 거래처 휴대번호 Input
          name="mobile"
          label={t("vendor.store phone")}
          placeholder={t("placeholder.store phone")}
          required={true}
        />

        <Form.Item label={t("vendor.address")} required={true}>
          <Input.Group compact>
            <Form.Item name="building" label="상가명" noStyle rules={[{ required: true }]}>
              <Select
                placeholder="상가명"
                style={{ width: "40%" }}
                loading={getAddressQuery.isLoading}
                onChange={(building) => {
                  setAddress({ building, floor: "" });
                  form.setFieldsValue({
                    ...form.getFieldsValue(),
                    floor: undefined,
                    colLoc: undefined,
                  });
                }}
              >
                {Object.keys(getAddressQuery.data?.data ?? []).map((building) => (
                  <Select.Option key={building} value={building}>
                    {building}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="floor" label="층" noStyle rules={[{ required: true }]}>
              <Select
                placeholder="층"
                style={{ width: "25%" }}
                onChange={(floor) => {
                  setAddress((address) => ({ ...address, floor }));
                  form.setFieldsValue({
                    ...form.getFieldsValue(),
                    colLoc: undefined,
                  });
                }}
              >
                {Object.keys(getAddressQuery.data?.data[address.building] ?? []).map(
                  (floor: string) => (
                    <Select.Option key={floor} value={floor}>
                      {floor}층
                    </Select.Option>
                  ),
                )}
              </Select>
            </Form.Item>
            <Form.Item name="colLoc" noStyle label="열/호" rules={[{ required: true }]}>
              <Select placeholder="열/호" style={{ width: "35%" }}>
                {(getAddressQuery.data?.data[address.building]?.[address.floor] ?? []).map(
                  (colLoc: string) => {
                    const [col, loc] = colLoc.split(" ");
                    return (
                      <Select.Option key={colLoc} value={colLoc}>
                        {col ? `${col}열 ${loc}호` : `${loc}호`}
                      </Select.Option>
                    );
                  },
                )}
              </Select>
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <TurtleInput // 기타 주소 Input
          name="ext"
          label=" "
          placeholder={t("placeholder.ext")}
          required={false}
        />

        <Form.Item label="계좌정보" required={true}>
          <Input.Group compact>
            <Form.Item name={["banks", "bank"]} noStyle rules={[{ required: true }]} label="은행">
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
              name={["banks", "account_number"]}
              noStyle
              rules={[{ required: true }]}
              label="계좌번호"
            >
              <Input style={{ width: "40%" }} placeholder="계좌번호" />
            </Form.Item>
            <Form.Item
              name={["banks", "account_holder"]}
              noStyle
              rules={[{ required: true }]}
              label="예금주명"
            >
              <Input style={{ width: "30%" }} placeholder="예금주명" />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <Form.Item label="전자영수증 사진첨부" required={true}>
          <Upload listType="picture">
            <TurtleButtonSub size="small">파일 선택하기</TurtleButtonSub>
          </Upload>
        </Form.Item>

        <Row justify="end">
          <Popconfirm
            title={t("description.really register")}
            okText={t("yes")}
            cancelText={t("no")}
            onConfirm={() => {
              form.validateFields().then(() => {
                const [col, loc] = form.getFieldValue("colLoc").split(" ");
                createQuery.mutate({
                  ...form.getFieldsValue(),
                  type: "update",
                  banks: [form.getFieldValue("banks")],
                  col,
                  loc,
                });
              });
            }}
          >
            <TurtleButton // 등록 요청하기 Button
              type="default"
              htmlType="submit"
            >
              {t("button.request update")}
            </TurtleButton>
          </Popconfirm>
        </Row>
      </Form>
    </TurtleModal>
  );
}

export default UpdateModal;
