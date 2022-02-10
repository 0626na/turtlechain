import {
  Button,
  Col,
  Input,
  message,
  Modal,
  notification,
  Popconfirm,
  Popover,
  Radio,
  Row,
  Space,
  Switch,
  Table,
  Tabs,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import { useTranslation } from "react-i18next";
import { UploadOutlined } from "@ant-design/icons";
import TurtleInfo from "components/common/TurtleInfo";
import { useMutation } from "react-query";
import { excelAPI, vendorAPI } from "apis";
import { AxiosError } from "axios";
import { useState } from "react";
import { ParseCount, Vendor } from "apis/excelAPI";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import TurtleBadge from "components/common/TurtleBadge";
import { FileTextOutlined } from "@ant-design/icons";
import TurtleText from "components/common/TurtleText";
import TurtleButton from "components/common/TurtleButton";
import { RequestCreateVendor, RequestGetVendors } from "apis/vendorAPI";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

interface Props {
  visible: boolean;
  closeModal: () => void;
}

interface VendorShow extends Vendor {
  memo?: string;
  memo_active?: boolean;
  memo_value?: string;
  is_taxed?: boolean;
  vendor_name?: string;
}

function CreateVendorsModal({ visible, closeModal }: Props) {
  const { t } = useTranslation();

  const form = new FormData();

  const parseVendorsQuery = useMutation("parseVendors", excelAPI.parseVendors, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      setSuccessList(
        data.data.success.map((vendor) => ({
          ...vendor,
          memo_value: "",
          memo_active: true,
          vendor_name: vendor.name,
        })),
      );
      setSuggestList(
        data.data.suggest.map((vendor) => ({
          ...vendor,
          memo_value: "",
          memo_active: true,
          vendor_name: vendor.name,
        })),
      );
      setFailList(data.data.fail);
      setCount(data.data.count);
    },
  });

  const [count, setCount] = useState<ParseCount>();
  const [successList, setSuccessList] = useState<Array<VendorShow>>();
  const [suggestList, setSuggestList] = useState<Array<VendorShow>>();
  const [failList, setFailList] = useState<Array<VendorShow>>();
  const [resultList, setResultList] = useState<Array<RequestCreateVendor>>([]);

  const createVendorsQuery = useMutation([
    "createVendors",
    vendorAPI.createVendor,
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: () => {
        notification.open({
          type: "success",
          message: "성공적으로 등록하였습니다.",
        });
      },
    },
  ]);

  const onClickCreate = () => {
    createVendorsQuery.mutate();
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
         * 정상 탭
         *
         *
         *
         */}
        <Tabs.TabPane tab="정상" key="1">
          거래처 대량 등록 미리보기 {count?.success_count}건
          <Table
            size="small"
            loading={parseVendorsQuery.isLoading}
            dataSource={successList}
            rowKey={(record) => record.vendor_id}
            pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
            expandable={{
              expandedRowRender: (record) => (
                <>
                  {record.memo_active ? (
                    <>
                      <Input
                        value={record.memo_value === "" ? record.memo : record.memo_value}
                        onChange={(e) => {
                          const newSuccessList = successList?.map((vendor) =>
                            vendor.vendor_id === record.vendor_id
                              ? {
                                  ...vendor,
                                  memo_value: e.currentTarget.value,
                                }
                              : vendor,
                          );
                          setSuccessList(newSuccessList);
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
                              if (record.memo_value === "") return;
                              const newSuccessList = successList?.map((vendor) =>
                                vendor.vendor_id === record.vendor_id
                                  ? {
                                      ...vendor,
                                      memo: record.memo_value,
                                      memo_value: "",
                                      memo_active: false,
                                    }
                                  : vendor,
                              );
                              setSuccessList(newSuccessList);
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
                              const newSuccessList = successList?.map((vendor) =>
                                vendor.vendor_id === record.vendor_id
                                  ? {
                                      ...vendor,
                                      memo_active: true,
                                    }
                                  : vendor,
                              );
                              setSuccessList(newSuccessList);
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
                        const newSuccessList = successList?.map((vendor) =>
                          vendor.vendor_id === record.vendor_id
                            ? {
                                ...vendor,
                                is_taxed: !record.is_taxed,
                              }
                            : vendor,
                        );
                        setSuccessList(newSuccessList);
                      }}
                      style={{ width: "52px" }}
                    />
                  );
                },
              },
              {
                title: "사용할 거래처명",
                render: (_, record) => (
                  <Input
                    size="small"
                    value={record.vendor_name}
                    onChange={(e) => {
                      const newSuccessList = successList?.map((vendor) =>
                        vendor.vendor_id === record.vendor_id
                          ? {
                              ...vendor,
                              vendor_name: e.currentTarget.value,
                            }
                          : vendor,
                      );
                      setSuccessList(newSuccessList);
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
          거래처 대량 등록 미리보기 {count?.suggest_count}건
          <Table
            size="small"
            loading={parseVendorsQuery.isLoading}
            dataSource={suggestList}
            rowKey={(record) => record.vendor_id}
            pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
            expandable={{
              expandedRowRender: (record) => (
                <>
                  {record.memo_active ? (
                    <>
                      <div>{record.memo} </div>
                      <Row justify="end" gutter={4} style={{ marginTop: "8px" }}>
                        <Col>
                          <TurtleButtonSub
                            size="small"
                            onClick={() => {
                              const newSuggestList = suggestList?.map((vendor) =>
                                vendor.vendor_id === record.vendor_id
                                  ? {
                                      ...vendor,
                                      memo_active: true,
                                    }
                                  : vendor,
                              );
                              setSuggestList(newSuggestList);
                            }}
                          >
                            수정
                          </TurtleButtonSub>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <>
                      <Input
                        value={record.memo_value === "" ? record.memo : record.memo_value}
                        onChange={(e) => {
                          const newSuggestList = suggestList?.map((vendor) =>
                            vendor.vendor_id === record.vendor_id
                              ? {
                                  ...vendor,
                                  memo_value: e.currentTarget.value,
                                }
                              : vendor,
                          );
                          setSuggestList(newSuggestList);
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
                              const newSuggestList = suggestList?.map((vendor) =>
                                vendor.vendor_id === record.vendor_id
                                  ? {
                                      ...vendor,
                                      memo: record.memo_value,
                                      memo_value: "",
                                      memo_active: false,
                                    }
                                  : vendor,
                              );
                              setSuggestList(newSuggestList);
                            }}
                          >
                            확인
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
                  <FileTextOutlined style={{ opacity: 0.4 }} onClick={(e) => onExpand(record, e)} />
                );
              },
            }}
            columns={[
              {
                ellipsis: true,
                title: "거래처 코드",
                render: (_, record) => record.vendor_id,
              },
              {
                ellipsis: true,
                width: "20%",
                title: "쇼핑몰 입력 값",
                render: (_, record) => {
                  return `${record.name} ${record.address}`;
                },
              },
              {
                ellipsis: true,
                title: "거래처명",
                render: (_, record) => {
                  if (record.ws_store_info.length === 1) return record.ws_store_info[0]?.name;

                  return (
                    <TurtleBadge count={record.ws_store_info.length} color="red">
                      <Popover
                        content={
                          <>
                            <p>이미 등록된 거래처명</p>
                            <Radio.Group>
                              <Space direction="vertical">
                                {record.ws_store_info.map(({ name, address, id }) => (
                                  <Radio
                                    value={id}
                                    key={id}
                                    onClick={() => {
                                      const filteredSuggestList = suggestList?.map((vendor) =>
                                        record.vendor_id === vendor.vendor_id
                                          ? {
                                              ...vendor,
                                              ws_store_info: record.ws_store_info.filter(
                                                (info) => info.id === id,
                                              ),
                                            }
                                          : vendor,
                                      );
                                      setSuggestList(filteredSuggestList);
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
                        <div style={{ color: "red" }}>{record.ws_store_info[0]?.name}</div>
                      </Popover>
                    </TurtleBadge>
                  );
                },
              },
              {
                ellipsis: true,
                title: "거래처 주소",
                render: (_, record) => {
                  //if (record.ws_store_info.length === 1)
                  return record.ws_store_info[0]?.address;
                  // return (
                  //   <TurtleBadge count={record.ws_store_info.length}>
                  //     <Popover
                  //       content={
                  //         <>
                  //           <p>이미 등록된 주소</p>
                  //           <Radio.Group>
                  //             <Space direction="vertical">
                  //               {record.ws_store_info.map(({ address }) => (
                  //                 <Radio value={address} key={address}>
                  //                   {address}
                  //                 </Radio>
                  //               ))}
                  //             </Space>
                  //           </Radio.Group>
                  //         </>
                  //       }
                  //     >
                  //       다중주소
                  //     </Popover>
                  //   </TurtleBadge>
                  // );
                },
              },
              {
                ellipsis: true,
                title: "휴대번호",
                render: (_, record) => record.ws_store_info[0]?.store_phone[0]?.phone,
              },
              {
                ellipsis: true,
                title: "계좌정보",
                render: (_, record) => {
                  if (record.ws_store_info.length !== 1) {
                    return;
                  }
                  if (record.ws_store_info[0]?.store_account.length === 1) {
                    const {
                      bank = "",
                      account_number = "",
                      account_holder = "",
                    } = record.ws_store_info[0]?.store_account[0] || {};
                    return `${bank} ${account_number} ${account_holder}`;
                  }

                  const {
                    bank = "",
                    account_number = "",
                    account_holder = "",
                  } = record.ws_store_info[0]?.store_account[0] || {};

                  return (
                    <TurtleBadge count={record.ws_store_info[0]?.store_account.length} color="red">
                      <Popover
                        content={
                          <>
                            <p>이미 등록된 계좌정보</p>
                            <Radio.Group>
                              <Space direction="vertical">
                                {record.ws_store_info[0]?.store_account.map(
                                  ({ id, bank, account_number, account_holder }) => (
                                    <Radio
                                      value={id}
                                      key={id}
                                      onClick={() => {
                                        const filteredSuggestList = suggestList?.map((vendor) =>
                                          record.vendor_id === vendor.vendor_id
                                            ? {
                                                ...vendor,
                                                ws_store_info: [
                                                  {
                                                    ...record.ws_store_info[0],
                                                    store_account:
                                                      record.ws_store_info[0]?.store_account.filter(
                                                        (account) => account.id === id,
                                                      ),
                                                  },
                                                ],
                                              }
                                            : vendor,
                                        );
                                        setSuggestList(filteredSuggestList);
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
                        <div style={{ color: "red" }}>
                          {bank} {account_number} {account_holder}
                        </div>
                      </Popover>
                    </TurtleBadge>
                  );

                  /*
                  if (record.ws_store_info.length === 1) {
                    const {
                      bank = "",
                      account_number = "",
                      account_holder = "",
                    } = record.ws_store_info[0]?.store_account[0] || {};

                    return `${bank} ${account_number} ${account_holder}`;
                  }
                  */
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
                        const newSuggestList = suggestList?.map((vendor) =>
                          vendor.vendor_id === record.vendor_id
                            ? {
                                ...vendor,
                                is_taxed: !record.is_taxed,
                              }
                            : vendor,
                        );
                        setSuggestList(newSuggestList);
                      }}
                      style={{ width: "52px" }}
                    />
                  );
                },
              },
              {
                align: "center",
                render: (_, record) => {
                  if (
                    record.ws_store_info.length === 1 &&
                    record.ws_store_info[0]?.store_account.length === 1
                  ) {
                    // resultList에 넣기
                    resultList?.push({
                      rt_store_id: -1,
                      vendor_id: record.vendor_id,
                      vendor_account_id: record.ws_store_info[0]?.store_account[0].id,
                      vendor_phone_id: record.ws_store_info[0]?.store_phone[0].id,
                      memo: record.memo,
                      is_taxed: record.is_taxed,
                    });
                    return <CheckOutlined style={{ color: "green" }} />;
                  }
                  return <CloseOutlined style={{ color: "red" }} />;
                },
              },
              {
                title: "사용할 거래처명",
                render: (_, record) => {
                  return <Input size="small" />;
                },
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
          미매칭
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
          //onClick={onClickCreate}
        >
          {t("vendor.create")}
        </TurtleButton>
      </Row>
    </Modal>
  );
}

export default CreateVendorsModal;
