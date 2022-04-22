import {
  Col,
  Form,
  Input,
  message,
  notification,
  Popconfirm,
  Space,
  Switch,
  Typography,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { vendorAPI } from "apis";
import { WholesaleShow } from "apis/vendorAPI";
import { AxiosError } from "axios";
import {
  TurtleButton,
  TurtleButtonSub,
  TurtleInput,
  TurtleSearchInput,
  TurtleTextArea,
} from "components/common";
import { useStoreExist } from "hooks";
import { t } from "i18next";
import { BottomBar, MenuBar } from "layouts/main";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import ConnectModal from "./ConnectModal";
import ExcelModal from "./ExcelModal";
import RequestModal from "./RequestModal";
import SearchModal from "./SearchModal";

function PageBody() {
  // 쇼핑몰 id
  const store = useRecoilValue(storeState);
  const isStoreExist = useStoreExist();
  const [form] = useForm();
  // 선택된 거래처
  const [selectedVendor, selectVendor] = useState<WholesaleShow>();
  // 재고관리 연동 모달
  const [connectModalVisible, setConnectModalVisible] = useState(false);
  // 대량등록 모달
  const [excelModalVisible, setExcelModalVisible] = useState(false);
  // 거래처 검색 모달
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  // 거래처 신규 등록 요청 모달
  const [requestModalVisible, setRequestModalVisible] = useState(false);

  // 거래처 코드 생성 요청
  const getCodeQuery = useQuery(
    "getVendorCode",
    () =>
      vendorAPI.getCode({
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

  // 거래처 생성 요청
  const createQuery = useMutation(["createVendor"], vendorAPI.create, {
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
        address: "",
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

  //쇼핑몰 선택 감지하여 form에 넣어줌
  useEffect(() => {
    form.setFieldsValue({
      ...form.getFieldsValue(),
      rt_store_id: store.id,
      vendor_code: undefined,
    });
  }, [store.id, form]);

  // 거래처 검색 modal 닫기
  const closeSearchModal = () => {
    setSearchModalVisible(false);
  };

  // 코드 만들기 Button 클릭
  const clickCreateVendorCode = () => {
    if (!isStoreExist()) {
      return;
    }
    if (!selectedVendor || selectedVendor.id === -1) {
      message.warn("거래처를 선택해 주세요");
      return;
    }
    getCodeQuery.refetch();
  };

  // 거래처 선택후 폼에 채워넣기
  const fillVendor = (vendor: WholesaleShow) => {
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

  const openConnectModal = useCallback(() => {
    if (!isStoreExist()) {
      return;
    }
    setConnectModalVisible(true);
  }, [setConnectModalVisible, isStoreExist]);

  const openExcelModal = useCallback(() => {
    if (!isStoreExist()) {
      return;
    }
    setExcelModalVisible(true);
  }, [setExcelModalVisible, isStoreExist]);

  const openSearchModal = useCallback(() => {
    if (!isStoreExist()) {
      return;
    }
    setSearchModalVisible(true);
  }, [setSearchModalVisible, isStoreExist]);

  return (
    <>
      <MenuBar isWarning>
        <TurtleButtonSub // 재고프로그램 연동 Button
          type="primary"
          color="skyblue"
          onClick={openConnectModal}
        >
          {t("button.connect external program")}
        </TurtleButtonSub>
        <TurtleButtonSub // 거래처 대량 등록 Button
          icon="file"
          onClick={openExcelModal}
        >
          {t("button.create bulk vendor")}
        </TurtleButtonSub>
      </MenuBar>

      <Form //
        layout="horizontal"
        form={form}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 7 }}
        colon={false}
      >
        <Typography.Title level={4}>{t("vendor.basic info")}</Typography.Title>
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
          onClick={openSearchModal}
        />

        <TurtleInput // 거래처 매장번호 Input
          label={t("vendor.phone")}
          disabled={true}
          value={selectedVendor?.phone}
          required={true}
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
          required={true}
        />

        <Typography.Title level={4}>{t("vendor.account info")}</Typography.Title>
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
          required={true}
        />

        <Typography.Title level={4}>{t("vendor.additional info")}</Typography.Title>
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
              <Input disabled={true} />
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

        <Typography.Title level={4}>{t("vendor.biz info")}</Typography.Title>
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
      </Form>

      <BottomBar justify="space-between">
        <Col>
          <Typography.Text>
            등록 하고 싶은 거래처가 없나요? 신규 거래처 등록을 해주세요!&nbsp;
          </Typography.Text>
          <Typography.Link
            style={{ textDecoration: "underline" }}
            onClick={() => {
              setRequestModalVisible(true);
            }}
          >
            신규 거래처 등록하기
          </Typography.Link>
        </Col>

        <Popconfirm
          title={t("description.really register")}
          okText={t("yes")}
          cancelText={t("no")}
          onConfirm={() => {
            form.validateFields().then(() => {
              createQuery.mutate([{ ...form.getFieldsValue() }]);
            });
          }}
        >
          <TurtleButton // 거래처 등록 Button
            type="primary"
            disabled={!store.id}
            loading={createQuery.isLoading}
          >
            {t("vendor.create")}
          </TurtleButton>
        </Popconfirm>
      </BottomBar>

      {/* 거래처 재고연동 모달 */}
      <ConnectModal
        visible={connectModalVisible}
        closeModal={() => {
          setConnectModalVisible(false);
        }}
      />
      {/* 거래처 대량등록 모달 */}
      <ExcelModal
        visible={excelModalVisible}
        closeModal={() => {
          setExcelModalVisible(false);
        }}
      />
      {/* master 도매 검색 모달 */}
      <SearchModal //
        visible={searchModalVisible}
        closeModal={closeSearchModal}
        selectRow={fillVendor}
      />
      {/* 거래처 신규 등록 요청 모달 */}
      <RequestModal //
        visible={requestModalVisible}
        closeModal={() => {
          setRequestModalVisible(false);
        }}
      />
    </>
  );
}

export default PageBody;
