import { Form, Input, message, notification, Row, Space, Switch } from "antd";
import { vendorAPI } from "apis";
import { RequestCreateVendor, WholeSaleStore } from "apis/vendorAPI";
import { AxiosError } from "axios";
import TurtleButton from "components/common/TurtleButton";
import TurtleInput from "components/common/TurtleInput";
import TurtleSearchInput from "components/common/TurtleSearchInput";
import TurtleText from "components/common/TurtleText";
import TurtleTextArea from "components/common/TurtleTextArea";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import VendorSearchModal from "./VendorSearchModal";

interface Props {
  storeId: number;
}

function VendorCreateForm({ storeId }: Props) {
  const [form] = Form.useForm<RequestCreateVendor>();
  const [formState, setFormState] = useState<{
    vendor_phone: string;
    building: string;
    floor: string;
    col: string;
    loc: string;
    ext: string;
    company_name?: string;
    biz_num?: string;
  }>();
  const [modalVisible, setModalVisible] = useState(false);

  const createVendorQuery = useMutation(["createVendor"], vendorAPI.createVendor, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      notification.open({
        type: "success",
        message: "성공적으로 등록하였습니다.",
      });
    },
  });

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // 거래처 선택
  const fillVendor = ({
    id,
    name,
    phone,
    store_phone,
    building,
    floor,
    col,
    loc,
    ext,
    store_account,
  }: WholeSaleStore) => {
    if (store_phone.length !== 1) {
      message.warning("휴대번호를 선택해주세요");
      return;
    }
    if (store_account.length !== 1) {
      message.warning("계좌번호를 선택해주세요");
      return;
    }
    form.setFieldsValue({
      vendor_name: name,
      vendor_account_bank: store_account[0].bank,
      vendor_account_number: store_account[0].account_number,
      vendor_account_holder: store_account[0].account_holder,
      vendor_phone: store_phone[0].phone,
      ws_store_id: id,
    });
    setFormState({
      vendor_phone: phone,
      building: building,
      floor: floor,
      col: col,
      loc: loc,
      ext: ext,
    });
    closeModal();
  };

  // 쇼핑몰 선택 감지하여 form에 넣어줌
  useEffect(() => {
    form.setFieldsValue({
      ...form.getFieldsValue(),
      rt_store_id: storeId,
    });
  }, [storeId, form]);

  // 거래처 코드 생성
  const makeVendorId = () => {
    if (storeId === -1) {
      message.warning("쇼핑몰을 선택해 주세요");
      return;
    }
    if (!form.getFieldValue("ws_store_id")) {
      message.warning("거래처를 선택해 주세요");
      return;
    }

    const code = storeId.toString() + form.getFieldValue("ws_store_id")?.toString();
    form.setFieldsValue({
      ...form.getFieldsValue(),
      vendor_id: code,
    });
  };

  const onClickCreate = () => {
    createVendorQuery.mutate({ ...form.getFieldsValue() });
    form.resetFields();
  };

  return (
    <>
      <Form //
        layout="horizontal"
        form={form}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 7 }}
        colon={false}
      >
        <TurtleText>{t("vendor.basic info")}</TurtleText>
        <Form.Item name="rt_store_id" hidden>
          <Input hidden />
        </Form.Item>

        <TurtleSearchInput //
          name="vendor_name"
          label={t("vendor.name")}
          placeholder={t("placeholder.vendor name")}
          onClick={openModal}
        />

        <TurtleInput // 거래처 매장번호 Input
          label={t("vendor.phone")}
          disabled={true}
          value={formState?.vendor_phone}
        />
        <TurtleInput // 휴대번호 선택 Input
          label={t("vendor.store phone")}
          disabled={true}
          name={"vendor_phone"}
        />

        <Form.Item // 거래처 주소 Input
          label={t("vendor.address")}
          required={true}
        >
          <Input.Group compact>
            <Form.Item noStyle rules={[{ required: true }]}>
              <Input
                value={formState?.building}
                disabled={true}
                size="large"
                style={{ width: "32.5%" }}
              />
            </Form.Item>
            <Form.Item noStyle rules={[{ required: true }]}>
              <Input
                value={formState?.floor && `${formState?.floor}층`}
                disabled={true}
                size="large"
                style={{ width: "32%" }}
              />
            </Form.Item>
            <Form.Item noStyle rules={[{ required: true }]}>
              <Input
                value={
                  formState?.loc && `${formState?.loc}행` + formState?.col && `${formState?.col}열`
                }
                disabled={true}
                size="large"
                style={{ width: "32%" }}
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <TurtleInput // 기타 주소 Input
          value={formState?.ext}
          label={t("vendor.ext")}
          disabled={true}
        />

        <TurtleText>{t("vendor.account info")}</TurtleText>
        <TurtleInput // 은행명 Input
          name={"vendor_account_bank"}
          label={t("vendor.account bank")}
          disabled={true}
        />
        <TurtleInput // 계좌번호 Input
          name={"vendor_account_number"}
          label={t("vendor.account number")}
          disabled={true}
        />
        <TurtleInput // 예금주명 Input
          name={"vendor_account_holder"}
          label={t("vendor.account holder")}
          disabled={true}
          required={false}
        />

        <TurtleText>{t("vendor.additional info")}</TurtleText>
        <Form.Item // 거래처 코드 Input
          label={t("vendor.code")}
          required={true}
          rules={[{ required: true }]}
          style={{ marginBottom: 0 }}
        >
          <Space>
            <Form.Item name="vendor_id" rules={[{ required: true }]}>
              <Input readOnly={true} size="large" />
            </Form.Item>
            <Form.Item>
              <TurtleButton ghost onClick={makeVendorId}>
                코드 만들기
              </TurtleButton>
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item
          name="is_taxed"
          label="부가세 포함 여부"
          valuePropName="checked"
          required={false}
        >
          <Switch //
            checkedChildren={t("button.include")}
            style={{ width: "53px" }}
          />
        </Form.Item>
        <TurtleTextArea // 주문 메모 TextArea
          required={false}
          name="memo"
          label={t("vendor.memo")}
          placeholder={t("placeholder.memo")}
          rows={5}
        />

        <TurtleText>{t("vendor.biz info")}</TurtleText>

        <Row justify="center">
          <TurtleButton htmlType="submit" type="primary" onClick={onClickCreate}>
            {t("vendor.create")}
          </TurtleButton>
        </Row>
      </Form>
      <VendorSearchModal //
        visible={modalVisible}
        closeModal={closeModal}
        selectRow={fillVendor}
      />
    </>
  );
}

export default VendorCreateForm;
