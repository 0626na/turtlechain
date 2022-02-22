import { Form, Input, message, notification, Popconfirm, Row, Space, Switch } from "antd";
import { useForm } from "antd/es/form/Form";
import { vendorAPI } from "apis";
import { Wholesale } from "apis/vendorAPI";
import { AxiosError } from "axios";
import TurtleButton from "components/common/TurtleButton";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import TurtleInput from "components/common/TurtleInput";
import TurtleSearchInput from "components/common/TurtleSearchInput";
import TurtleText from "components/common/TurtleText";
import TurtleTextArea from "components/common/TurtleTextArea";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import CreateVendorRequestModal from "./CreateVendorRequestModal";
import SearchWholesaleModal from "./SearchWholesaleModal";

function CreateVendorForm() {
  // 쇼핑몰 id
  const store = useRecoilValue(storeState);
  // 선택된 거래처
  const [selectedVendor, selectVendor] = useState<Wholesale>();
  // createVendor 요청 data 담을 객체
  const [form] = useForm();
  // 거래처 검색 모달
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  // 거래처 신규 등록 요청 모달
  const [requestModalVisible, setRequestModalVisible] = useState(false);

  const createVendorCode = useQuery(
    "createVendorCode",
    () =>
      vendorAPI.createVendorCode({
        rt_store_id: store.id ?? -1,
        ws_store_id: selectedVendor?.id ?? -1,
      }),
    {
      enabled: false,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        form.setFieldsValue({ ...form.getFieldsValue(), vendor_code: data.data });
      },
    },
  );

  const createVendorQuery = useMutation(["createVendor"], vendorAPI.createVendor, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      if (data.data.fail_count > 0) {
        notification.open({
          type: "error",
          message: "이미 등록된 거래처입니다.",
        });
        return;
      }
      notification.open({
        type: "success",
        message: "성공적으로 등록하였습니다.",
      });
      form.resetFields();
      selectVendor({
        id: -1,
        name: "",
        phone: "",
        store_account: [],
        store_phone: [],
        company: [],
        building: "",
        floor: "",
        col: "",
        loc: "",
        ext: "",
      });
      form.setFieldsValue({
        rt_store_id: store.id,
      });
    },
  });

  const closeSearchModal = () => {
    setSearchModalVisible(false);
  };

  const clickCreateVendorCode = () => {
    if (!store.id) {
      message.warn("쇼핑몰을 선택해 주세요");
      return;
    }
    if (!selectedVendor || selectedVendor.id === -1) {
      message.warn("거래처를 선택해 주세요");
      return;
    }
    createVendorCode.refetch();
  };

  // 거래처 선택후 폼에 채워넣기
  const fillVendor = (vendor: Wholesale) => {
    selectVendor(vendor);
    form.setFieldsValue({
      ...form.getFieldsValue(),
      vendor_code: undefined,
      vendor_account_id: vendor.store_account[0].id,
      vendor_phone_id: vendor.store_phone[0].id,
      ws_store_id: vendor.id,
      vendor_name: vendor.name,
      vendor_address: `${vendor.building} ${vendor.floor}${vendor.floor ? "층" : ""} ${vendor.col}${
        vendor.col ? "열" : ""
      } ${vendor.loc}${vendor.floor ? "호" : ""} ${vendor.ext}`,
      memo: "",
      is_vat_included: false,
      owner: vendor.company[0]?.owner,
      biz_num: vendor.company[0]?.biz_num,
      biz_name: vendor.company[0]?.name,
    });
    closeSearchModal();
  };

  //쇼핑몰 선택 감지하여 form에 넣어줌
  useEffect(() => {
    form.setFieldsValue({
      ...form.getFieldsValue(),
      rt_store_id: store.id,
      vendor_code: undefined,
    });
  }, [store.id, form]);

  const onClickCreate = () => {
    if (!form.getFieldValue("ws_store_id")) {
      message.warning("거래처를 선택해 주세요");
      return;
    }
    form.validateFields().then(() => {
      createVendorQuery.mutate([{ ...form.getFieldsValue() }]);
    });
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
        <Form.Item name="vendor_name" hidden>
          <Input hidden />
        </Form.Item>
        <Form.Item name="vendor_address" hidden>
          <Input hidden />
        </Form.Item>
        <Form.Item name="vendor_account_id" hidden>
          <Input hidden />
        </Form.Item>
        <Form.Item name="vendor_phone_id" hidden>
          <Input hidden />
        </Form.Item>
        <Form.Item name="ws_store_id" hidden>
          <Input hidden />
        </Form.Item>

        <TurtleSearchInput //
          value={selectedVendor?.name}
          label={t("vendor.name")}
          placeholder={t("placeholder.vendor name")}
          onSearch={() => {
            setSearchModalVisible(true);
          }}
        />

        <TurtleInput // 거래처 매장번호 Input
          label={t("vendor.phone")}
          disabled={true}
          value={selectedVendor?.phone}
          required={false}
        />
        <TurtleInput // 휴대번호 선택 Input
          value={selectedVendor?.store_phone[0]?.phone}
          label={t("vendor.store phone")}
          disabled={true}
        />

        <Form.Item // 거래처 주소 Input
          label={t("vendor.address")}
          required={true}
        >
          <Input.Group compact>
            <Form.Item noStyle rules={[{ required: true }]}>
              <Input value={selectedVendor?.building} disabled={true} style={{ width: "34%" }} />
            </Form.Item>
            <Form.Item noStyle rules={[{ required: true }]}>
              <Input
                value={selectedVendor?.floor && `${selectedVendor?.floor}층`}
                disabled={true}
                style={{ width: "33%" }}
              />
            </Form.Item>
            <Form.Item noStyle rules={[{ required: true }]}>
              <Input
                value={`${selectedVendor?.col ? selectedVendor.col + "열" : ""} ${
                  selectedVendor?.loc ? selectedVendor.loc + "호" : ""
                }`}
                disabled={true}
                style={{ width: "33%" }}
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <TurtleInput // 기타 주소 Input
          value={selectedVendor?.ext}
          label={t("vendor.ext")}
          disabled={true}
          required={false}
        />

        <TurtleText>{t("vendor.account info")}</TurtleText>
        <TurtleInput // 은행명 Input
          value={selectedVendor?.store_account[0]?.bank}
          label={t("vendor.account bank")}
          disabled={true}
        />
        <TurtleInput // 계좌번호 Input
          value={selectedVendor?.store_account[0]?.account_number}
          label={t("vendor.account number")}
          disabled={true}
        />
        <TurtleInput // 예금주명 Input
          value={selectedVendor?.store_account[0]?.account_holder}
          label={t("vendor.account holder")}
          disabled={true}
          required={false}
        />

        <TurtleText>{t("vendor.additional info")}</TurtleText>
        <Form.Item // 거래처 코드 Input
          label={t("vendor.code")}
          required={true}
          style={{ marginBottom: 0 }}
        >
          <Space>
            <Form.Item
              name="vendor_code"
              rules={[{ required: true, message: "거래처 코드를 만들어주세요." }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <TurtleButtonSub color="blue" onClick={clickCreateVendorCode}>
                코드 만들기
              </TurtleButtonSub>
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item
          name="is_vat_included"
          label="부가세 포함 여부"
          valuePropName="checked"
          required={false}
        >
          <Switch //
            checkedChildren={t("button.include")}
            style={{ width: "55px" }}
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
        <TurtleInput // 사업자 번호 Input
          name="biz_num"
          label={t("biz.num")}
          placeholder={t("placeholder.biz num")}
          required={false}
        />
        <TurtleInput // 상호명 Input
          name="biz_name"
          label={t("biz.name")}
          placeholder={t("placeholder.biz name")}
          required={false}
        />
        <TurtleInput // 대표자명 Input
          name="owner"
          label={t("biz.owner")}
          placeholder={t("placeholder.biz owner")}
          required={false}
        />

        <Row justify="space-between" style={{ padding: "1rem 0px" }}>
          <TurtleText>
            등록 하고 싶은 거래처가 없나요? 신규 거래처 등록을 해주세요!{" "}
            <span
              style={{ color: "#033A88", cursor: "pointer", textDecoration: "underline" }}
              onClick={() => {
                setRequestModalVisible(true);
              }}
            >
              신규 등록 요청하기 {">"}
            </span>
          </TurtleText>
          <Popconfirm
            title={t("description.really register")}
            okText={t("yes")}
            cancelText={t("no")}
            onConfirm={onClickCreate}
          >
            <TurtleButton // 거래처 등록 Button
              type="primary"
              disabled={!store.id}
              loading={createVendorQuery.isLoading}
            >
              {t("vendor.create")}
            </TurtleButton>
          </Popconfirm>
        </Row>
      </Form>

      <SearchWholesaleModal //
        visible={searchModalVisible}
        closeModal={closeSearchModal}
        selectRow={fillVendor}
      />
      <CreateVendorRequestModal //
        visible={requestModalVisible}
        closeModal={() => {
          setRequestModalVisible(false);
        }}
      />
    </>
  );
}

export default CreateVendorForm;
