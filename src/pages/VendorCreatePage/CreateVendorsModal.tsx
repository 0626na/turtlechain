import {
  Button,
  Col,
  Input,
  message,
  Modal,
  notification,
  Popover,
  Radio,
  Row,
  Space,
  Switch,
  Table,
  Tabs,
  Typography,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import TurtleInfo from "components/common/TurtleInfo";
import { useMutation } from "react-query";
import { excelAPI, vendorAPI } from "apis";
import { AxiosError } from "axios";
import { memo, useCallback, useMemo, useState } from "react";
import { MasterVendor, ParseCount, Vendor, VendorShow } from "apis/excelAPI";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import TurtleBadge from "components/common/TurtleBadge";
import { FileTextOutlined } from "@ant-design/icons";
import TurtleText from "components/common/TurtleText";
import TurtleButton from "components/common/TurtleButton";
import { RequestCreateVendor, RequestGetVendors, VendorAccount } from "apis/vendorAPI";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function CreateVendorsModal({ visible, closeModal }: Props) {
  const store = useRecoilValue(storeState);
  const form = new FormData();

  const parseVendorsQuery = useMutation("parseVendors", excelAPI.parseVendors, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      setSuccessList(
        data.data.success.map((vendor) => ({
          ...vendor,
          memo: "",
          memo_value: "",
          memo_active: true,
          is_taxed: false,
          use_vendor_name: vendor.name,
        })),
      );
      setSuggestList(
        data.data.suggest.map((vendor) => ({
          ...vendor,
          memo: "",
          memo_value: "",
          memo_active: true,
          is_taxed: false,
          use_vendor_name: vendor.name,
          use_vendor: vendor.ws_store_info.length === 1 ? vendor.ws_store_info[0] : undefined,
          use_account:
            vendor.ws_store_info.length === 1 && vendor.ws_store_info[0].store_account.length === 1
              ? vendor.ws_store_info[0].store_account[0]
              : undefined,
          check_account: false,
        })),
      );
      setFailList(data.data.fail);
      setCount(data.data.count);
    },
  });

  const [count, setCount] = useState<ParseCount>();
  const [successList, setSuccessList] = useState<Array<VendorShow>>();
  const [suggestList, setSuggestList] = useState<Array<VendorShow>>();
  const [failList, setFailList] = useState<Array<Vendor>>();

  const createVendorsQuery = useMutation(
    ["createVendors"], //
    vendorAPI.createVendor,
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        notification.open({
          type: "success",
          message: `성공적으로 등록하였습니다. 성공 : ${data.data.success_count} 중복된 거래처 : ${data.data.fail_count}`,
        });
        closeModal();
      },
    },
  );

  const setSuccessMemoValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, record: VendorShow) => {
      setSuccessList(
        successList?.map((vendor) =>
          vendor.vendor_code === record.vendor_code
            ? {
                ...vendor,
                memo_value: e.currentTarget.value,
              }
            : vendor,
        ),
      );
    },
    [successList],
  );

  const setSuccessMemo = useCallback(
    (record) => {
      if (record.memo_value === "") return;
      setSuccessList(
        successList?.map((vendor) =>
          vendor.vendor_code === record.vendor_code
            ? {
                ...vendor,
                memo: record.memo_value,
                memo_active: false,
              }
            : vendor,
        ),
      );
    },
    [successList],
  );

  const setSuccessMemoActive = useCallback(
    (record) => {
      setSuccessList(
        successList?.map((vendor) =>
          vendor.vendor_code === record.vendor_code
            ? {
                ...vendor,
                memo_active: true,
              }
            : vendor,
        ),
      );
    },
    [successList],
  );

  const setSuccessIsTaxed = useCallback(
    (record) => {
      setSuccessList(
        successList?.map((vendor) =>
          vendor.vendor_code === record.vendor_code
            ? {
                ...vendor,
                is_taxed: !record.is_taxed,
              }
            : vendor,
        ),
      );
    },
    [successList],
  );

  const setSuccessUseVendorName = useCallback(
    (e, record) => {
      setSuccessList(
        successList?.map((vendor) =>
          vendor.vendor_code === record.vendor_code
            ? {
                ...vendor,
                use_vendor_name: e.currentTarget.value,
              }
            : vendor,
        ),
      );
    },
    [successList],
  );

  const setSuggestMemoActive = useCallback(
    (record) => {
      setSuggestList(
        suggestList?.map((vendor) =>
          vendor.vendor_code === record.vendor_code
            ? {
                ...vendor,
                memo_active: true,
              }
            : vendor,
        ),
      );
    },
    [suggestList],
  );

  const setSuggestMemoValue = useCallback(
    (e, record) => {
      setSuggestList(
        suggestList?.map((vendor) =>
          vendor.vendor_code === record.vendor_code
            ? {
                ...vendor,
                memo_value: e.currentTarget.value,
              }
            : vendor,
        ),
      );
    },
    [suggestList],
  );

  const setSuggestMemo = useCallback(
    (record) => {
      setSuggestList(
        suggestList?.map((vendor) =>
          vendor.vendor_code === record.vendor_code
            ? {
                ...vendor,
                memo: record.memo_value,
                memo_active: false,
              }
            : vendor,
        ),
      );
    },
    [suggestList],
  );

  const setSuggestIsTaxed = useCallback(
    (record) => {
      setSuggestList(
        suggestList?.map((vendor) =>
          vendor.vendor_code === record.vendor_code
            ? {
                ...vendor,
                is_taxed: !record.is_taxed,
              }
            : vendor,
        ),
      );
    },
    [suggestList],
  );

  const setSuggestVendor = useCallback(
    (record, accountId) => {
      const newSuggestList = suggestList?.map((vendor) =>
        record.vendor_code === vendor.vendor_code
          ? {
              ...vendor,
              use_vendor: record.ws_store_info.filter(
                (info: MasterVendor) => info.id === accountId,
              )[0],
              use_account: undefined,
              check_account: false,
            }
          : vendor,
      );
      setSuggestList(newSuggestList);
    },
    [suggestList],
  );

  const setSuggestAccount = useCallback(
    (record, accountId) => {
      const filteredSuggestList = suggestList?.map((vendor) =>
        record.vendor_code === vendor.vendor_code
          ? {
              ...vendor,
              use_account: record.use_vendor?.store_account.filter(
                (account: VendorAccount) => account.id === accountId,
              )[0],
              check_account: true,
            }
          : vendor,
      );
      setSuggestList(filteredSuggestList);
    },
    [suggestList],
  );

  const setSuggestUseVendorName = useCallback(
    (e, record) => {
      setSuggestList(
        suggestList?.map((vendor) =>
          vendor.vendor_code === record.vendor_code
            ? {
                ...vendor,
                use_vendor_name: e.currentTarget.value,
              }
            : vendor,
        ),
      );
    },
    [suggestList],
  );

  const getSuggestCount = useMemo((): number => {
    let count = 0;
    suggestList?.forEach((vendor: VendorShow) => {
      if (!(vendor.use_vendor && vendor.check_account)) count++;
    });
    return count;
  }, [suggestList]);

  const onClickCreate = () => {
    const resultList: Array<RequestCreateVendor> = [];
    successList?.forEach((vendor) => {
      resultList.push({
        rt_store_id: store.id ?? -1,
        vendor_code: vendor.vendor_code,
        vendor_account_id: vendor.ws_store_info[0].store_account[0].id,
        vendor_phone_id: vendor.ws_store_info[0].store_phone[0].id,
        ws_store_id: vendor.ws_store_info[0].id,
        vendor_address: vendor.ws_store_info[0].address,
        vendor_name: vendor.use_vendor_name,
        memo: vendor.memo,
        is_taxed: vendor.is_taxed,
      });
    });
    suggestList?.forEach((vendor) => {
      if (vendor.use_vendor && vendor.use_account && vendor.check_account) {
        resultList.push({
          rt_store_id: store.id ?? -1,
          vendor_code: vendor.vendor_code,
          vendor_account_id: vendor.use_account?.id,
          vendor_phone_id: vendor.use_vendor.store_phone[0].id,
          ws_store_id: vendor.use_vendor.id,
          vendor_address: vendor.use_vendor.address,
          vendor_name: vendor.use_vendor_name,
          memo: vendor.memo,
          is_taxed: vendor.is_taxed,
        });
      }
    });
    createVendorsQuery.mutate(resultList);
  };

  return (
    <Modal
      centered
      width="80%"
      maskClosable={false}
      title={
        <>
          <span style={{ fontSize: "18px" }}>{t("vendor.request create")}</span>
          <TurtleInfo>대량 업로드 파일은 .CSV .XLS또는 .XLXS만 사용할 수 있습니다.</TurtleInfo>
        </>
      }
      visible={visible}
      onCancel={closeModal}
      footer={false}
      bodyStyle={{ height: "800px", overflowY: "auto" }}
    >
      <Space>
        <Typography.Text>거래처 업로드</Typography.Text>
        <Upload //
          multiple={false}
          accept=".csv, .xls, .xlxs"
          customRequest={({ file, onSuccess }) => {
            form.append("files", file);
            form.append("rt_store_id", store.id?.toString() ?? "");
            parseVendorsQuery.mutate(form);
          }}
        >
          <Button icon={<UploadOutlined />}>파일 선택하기</Button>
        </Upload>
      </Space>
      <Tabs defaultActiveKey="1" size="large">
        {/*
         *
         *
         *
         * 매칭 탭
         *
         *
         *
         */}
        <Tabs.TabPane tab="매칭" key="1">
          거래처 대량 등록 미리보기{" "}
          <span style={{ color: "#00BB88", textDecoration: "underline" }}>
            {count?.success_count}
          </span>
          건
          <Table
            size="small"
            loading={parseVendorsQuery.isLoading}
            dataSource={successList}
            rowKey={(record) => record.vendor_code}
            pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
            expandable={{
              expandedRowRender: (record) => (
                <>
                  {record.memo_active ? (
                    <>
                      <Input
                        value={record.memo_value === "" ? record.memo : record.memo_value}
                        onChange={(e) => {
                          setSuccessMemoValue(e, record);
                        }}
                      />
                      <Row justify="end" gutter={4} style={{ marginTop: "8px" }}>
                        <Col>
                          <TurtleButtonSub size="small" color="grey">
                            취소
                          </TurtleButtonSub>
                        </Col>
                        <Col>
                          <TurtleButtonSub
                            size="small"
                            onClick={() => {
                              setSuccessMemo(record);
                            }}
                          >
                            확인
                          </TurtleButtonSub>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <>
                      <div>{record.memo} </div>
                      <Row justify="end" gutter={4} style={{ marginTop: "8px" }}>
                        <Col>
                          <TurtleButtonSub
                            size="small"
                            onClick={() => {
                              setSuccessMemoActive(record);
                            }}
                          >
                            수정
                          </TurtleButtonSub>
                        </Col>
                      </Row>
                    </>
                  )}
                </>
              ),
              columnWidth: 25,
              expandIcon: ({ expanded, onExpand, record }) => {
                return (
                  <FileTextOutlined
                    style={record.memo ? {} : { opacity: "0.4" }}
                    onClick={(e) => onExpand(record, e)}
                  />
                );
              },
            }}
            columns={[
              {
                ellipsis: true,
                width: "8%",
                title: "거래처 코드",
                render: (_, record) => record.ws_store_info[0]?.id,
              },
              {
                ellipsis: true,
                width: "15%",
                title: "쇼핑몰 입력 값",
                render: (_, record) => {
                  return `${record.name}  ${record.address}`;
                },
              },
              {
                ellipsis: true,
                title: "거래처명",
                render: (_, record) => record.ws_store_info[0]?.name,
              },
              {
                ellipsis: true,
                title: "거래처 주소",
                render: (_, record) => record.ws_store_info[0]?.address,
              },
              {
                ellipsis: true,
                title: "휴대번호",
                width: "10%",
                render: (_, record) =>
                  record.ws_store_info[0]?.store_phone[0]?.phone
                    .replace(/[^0-9]/, "")
                    .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`),
              },
              {
                ellipsis: true,
                title: "계좌정보",
                render: (_, record) => {
                  const {
                    bank = "",
                    account_number = "",
                    account_holder = "",
                  } = record.ws_store_info[0]?.store_account[0] || {};

                  return `${bank} ${account_number} ${account_holder}`;
                },
              },
              Table.EXPAND_COLUMN,
              {
                ellipsis: true,
                title: "메모",
                width: "5%",
              },
              {
                ellipsis: true,
                title: "부가세 포함 여부",
                render: (_, record) => {
                  return (
                    <Switch
                      checkedChildren={t("button.include")}
                      checked={record.is_taxed}
                      onClick={() => {
                        setSuccessIsTaxed(record);
                      }}
                      style={{ width: "52px" }}
                    />
                  );
                },
              },
              {
                ellipsis: true,
                align: "center",
                width: "6%",
                title: "(체크)",
                render: (_, record) => {
                  if (
                    record.ws_store_info.length === 1 &&
                    record.ws_store_info[0]?.store_account.length === 1
                  ) {
                    // resultList에 넣기 - 거래처 등록 버튼클릭시에 넣어야할듯
                    // resultList?.push({
                    //   rt_store_id: -1,
                    //   vendor_code: record.vendor_code,
                    //   vendor_account_id: record.ws_store_info[0]?.store_account[0].id,
                    //   vendor_phone_id: record.ws_store_info[0]?.store_phone[0].id,
                    //   memo: record.memo,
                    //   is_taxed: record.is_taxed,
                    // });
                    return <CheckOutlined style={{ color: "green" }} />;
                  }
                  return <CloseOutlined style={{ color: "red" }} />;
                },
              },
              {
                ellipsis: true,
                title: "사용할 거래처명",
                render: (_, record) => (
                  <Input
                    size="small"
                    value={record.use_vendor_name}
                    onChange={(e) => {
                      setSuccessUseVendorName(e, record);
                    }}
                  />
                ),
              },
            ]}
          />
        </Tabs.TabPane>
        {/*
         *
         *
         *
         * 추천 탭
         *
         *
         *
         */}
        <Tabs.TabPane tab="추천" key="2">
          거래처 대량 등록 미리보기{" "}
          <span style={{ color: "red", textDecoration: "underline" }}>{getSuggestCount}</span>건
          <Table
            size="small"
            loading={parseVendorsQuery.isLoading}
            dataSource={suggestList}
            rowKey={(record) => record.vendor_code}
            pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
            expandable={{
              expandedRowRender: (record) => (
                <>
                  {record.memo_active ? (
                    <>
                      <Input
                        value={record.memo_value === "" ? record.memo : record.memo_value}
                        onChange={(e) => {
                          setSuggestMemoValue(e, record);
                        }}
                      />
                      <Row justify="end" gutter={4} style={{ marginTop: "8px" }}>
                        <Col>
                          <TurtleButtonSub size="small" color="grey">
                            취소
                          </TurtleButtonSub>
                        </Col>
                        <Col>
                          <TurtleButtonSub
                            size="small"
                            onClick={() => {
                              setSuggestMemo(record);
                            }}
                          >
                            확인
                          </TurtleButtonSub>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <>
                      <div>{record.memo} </div>
                      <Row justify="end" gutter={4} style={{ marginTop: "8px" }}>
                        <Col>
                          <TurtleButtonSub
                            size="small"
                            onClick={() => {
                              setSuggestMemoActive(record);
                            }}
                          >
                            수정
                          </TurtleButtonSub>
                        </Col>
                      </Row>
                    </>
                  )}
                </>
              ),
              columnWidth: 25,
              expandIcon: ({ expanded, onExpand, record }) => {
                return (
                  <FileTextOutlined
                    style={record.memo ? {} : { opacity: "0.4" }}
                    onClick={(e) => onExpand(record, e)}
                  />
                );
              },
            }}
            columns={[
              {
                ellipsis: true,
                title: "거래처 코드",
                render: (_, record) => record.vendor_code,
              },
              {
                ellipsis: true,
                width: "12%",
                title: "쇼핑몰 입력 값",
                render: (_, record) => {
                  return `${record.name} | ${record.address}`;
                },
              },
              {
                ellipsis: true,
                title: "거래처명",
                render: (_, record) => {
                  return (
                    <TurtleBadge count={record.ws_store_info.length} color="red">
                      <Popover
                        content={
                          <>
                            <p>이미 등록된 거래처명</p>
                            <Radio.Group value={record.use_vendor?.id}>
                              <Space direction="vertical">
                                {record.ws_store_info.map(({ name, address, id }) => (
                                  <Radio
                                    key={id}
                                    value={id}
                                    onClick={() => {
                                      setSuggestVendor(record, id);
                                    }}
                                  >
                                    {name} | {address}
                                  </Radio>
                                ))}
                              </Space>
                            </Radio.Group>
                          </>
                        }
                      >
                        <div style={{ color: record.use_vendor ? "" : "red" }}>
                          {record.use_vendor
                            ? record.use_vendor.name
                            : record.ws_store_info[0]?.name}
                        </div>
                      </Popover>
                    </TurtleBadge>
                  );
                },
              },
              {
                ellipsis: true,
                title: "거래처 주소",
                render: (_, record) =>
                  record.use_vendor ? record.use_vendor.address : record.ws_store_info[0]?.address,
              },
              {
                ellipsis: true,
                title: "휴대번호",
                render: (_, record) => record.use_vendor?.store_phone[0]?.phone,
              },
              {
                ellipsis: true,
                title: "계좌정보",
                width: "20%",
                render: (_, record) => {
                  if (!record.use_vendor) return;

                  return (
                    <TurtleBadge count={record.use_vendor?.store_account.length} color="red">
                      <Popover
                        content={
                          <>
                            <p>이미 등록된 계좌정보</p>
                            <Radio.Group value={record.use_account?.id}>
                              <Space direction="vertical">
                                {record.use_vendor?.store_account.map(
                                  ({ id, bank, account_number, account_holder }) => (
                                    <Radio
                                      value={id}
                                      key={id}
                                      onClick={() => {
                                        setSuggestAccount(record, id);
                                      }}
                                    >
                                      {bank} {account_number} {account_holder}
                                    </Radio>
                                  ),
                                )}
                              </Space>
                            </Radio.Group>
                          </>
                        }
                      >
                        <div style={{ color: record.check_account ? "" : "red" }}>
                          {record.use_account?.bank ?? record.use_vendor.store_account[0]?.bank}{" "}
                          {record.use_account?.account_number ??
                            record.use_vendor.store_account[0]?.account_number}{" "}
                          {record.use_account?.account_holder ??
                            record.use_vendor.store_account[0]?.account_holder}
                        </div>
                      </Popover>
                    </TurtleBadge>
                  );
                },
              },
              Table.EXPAND_COLUMN,
              {
                title: "메모",
                width: "5%",
              },
              {
                title: "부가세 포함 여부",
                ellipsis: true,
                render: (_, record) => {
                  return (
                    <Switch
                      checkedChildren={t("button.include")}
                      checked={record.is_taxed}
                      onClick={() => {
                        setSuggestIsTaxed(record);
                      }}
                      style={{ width: "52px" }}
                    />
                  );
                },
              },
              {
                align: "center",
                render: (_, record) => {
                  if (record.use_vendor && record.check_account) {
                    return <CheckOutlined style={{ color: "green" }} />;
                  }
                  return <CloseOutlined style={{ color: "red" }} />;
                },
              },
              {
                title: "사용할 거래처명",
                render: (_, record) => (
                  <Input
                    size="small"
                    value={record.use_vendor_name}
                    onChange={(e) => {
                      setSuggestUseVendorName(e, record);
                    }}
                  />
                ),
              },
            ]}
          />
        </Tabs.TabPane>
        {/*
         *
         *
         *
         * 미매칭 탭
         *
         *
         *
         */}
        <Tabs.TabPane tab="미매칭" key="3">
          거래처 대량 등록 미리보기{" "}
          <span style={{ color: "red", textDecoration: "underline" }}>{count?.fail_count}</span>건
          <Table
            size="small"
            loading={parseVendorsQuery.isLoading}
            dataSource={failList}
            rowKey={(record) => record.vendor_code}
            pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
            columns={[
              {
                ellipsis: true,
                title: "거래처 코드",
                render: (_, record) => record.vendor_code,
              },
              {
                ellipsis: true,
                width: "12%",
                title: "쇼핑몰 입력 값",
                render: (_, record) => {
                  return `${record.name} | ${record.address}`;
                },
              },
              {
                ellipsis: true,
                title: "거래처명",
                render: (_, record) => <>(정보없음)</>,
              },
              {
                ellipsis: true,
                title: "거래처 주소",
                render: (_, record) => <>(정보없음)</>,
              },
              {
                ellipsis: true,
                title: "휴대번호",
                render: (_, record) => <>(정보없음)</>,
              },
              {
                ellipsis: true,
                title: "계좌정보",
                width: "20%",
                render: (_, record) => <>(정보없음)</>,
              },
            ]}
          />
        </Tabs.TabPane>
      </Tabs>

      <Row justify="space-between" style={{ padding: "1rem 0px" }}>
        <TurtleText>
          등록 하고 싶은 거래처가 없나요? 신규 거래처 등록을 해주세요!{" "}
          <span
            style={{ color: "#033A88", cursor: "pointer", textDecoration: "underline" }}
            onClick={() => {
              //setRequestModalVisible(true);
            }}
          >
            신규 등록 요청하기 {">"}
          </span>
        </TurtleText>
        <TurtleButton
          type="primary"
          //disabled={form.getFieldValue("rt_store_id") !== -1}
          //loading={createVendorQuery.isLoading}
          onClick={onClickCreate}
        >
          {t("vendor.create")}
        </TurtleButton>
      </Row>
    </Modal>
  );
}

export default CreateVendorsModal;
