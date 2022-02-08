import {
  Button,
  Col,
  Input,
  message,
  Modal,
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
import { excelAPI } from "apis";
import { AxiosError } from "axios";
import { useState } from "react";
import { Vendor } from "apis/excelAPI";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import TurtleBadge from "components/common/TurtleBadge";
import { FileTextOutlined } from "@ant-design/icons";

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function CreateVendorsModal({ visible, closeModal }: Props) {
  const { t } = useTranslation();

  const form = new FormData();

  const parseVendorsQuery = useMutation("parseVendors", excelAPI.parseVendors, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      setCount(data.data.count);
      setSuccessList(data.data.success);
      setFailList(data.data.need_select_vendor);
    },
  });

  const [count, setCount] = useState<{
    success_count: number;
    select_vendor_count: number;
    select_account_count: number;
    select_count: number;
    fail_count: number;
  }>();
  const [successList, setSuccessList] = useState<Array<Vendor>>();
  const [failList, setFailList] = useState<Array<Vendor>>();

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
      bodyStyle={{ height: "700px", overflowY: "auto" }}
    >
      <Space>
        <Typography.Text>거래처 업로드</Typography.Text>
        <Upload //
          multiple={false}
          accept=".csv, .xls, .xlxs"
          beforeUpload={(file: any) => {
            // console.log(file);
            // form.append("files", file);
            // parseVendorsQuery.mutate(form);
          }}
          customRequest={({ file, onSuccess }) => {
            form.append("files", file);
            parseVendorsQuery.mutate(form);
          }}
        >
          <Button icon={<UploadOutlined />}>파일 선택하기</Button>
        </Upload>
      </Space>
      <Tabs defaultActiveKey="1" size="large">
        <Tabs.TabPane tab="정상" key="1">
          거래처 대량 등록 미리보기 {count?.success_count}건
          <Table
            size="small"
            loading={parseVendorsQuery.isLoading}
            dataSource={successList}
            rowKey={(record) => record.ws_store_info[0].id}
            pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
            expandable={{
              expandedRowRender: (record) => (
                <>
                  <Input />
                  <Row justify="end" gutter={4} style={{ marginTop: "8px" }}>
                    <Col>
                      <TurtleButtonSub size="small" color="grey">
                        취소
                      </TurtleButtonSub>
                    </Col>
                    <Col>
                      <TurtleButtonSub size="small">확인</TurtleButtonSub>
                    </Col>
                  </Row>
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
                render: (_, record) => record.ws_store_info[0].id,
              },
              {
                ellipsis: true,
                title: "거래처명",
                render: (_, record) => record.ws_store_info[0].name,
              },
              {
                ellipsis: true,
                title: "거래처 주소",
                render: (_, record) => record.ws_store_info[0].address,
              },
              {
                ellipsis: true,
                title: "휴대번호",
                render: (_, record) => record.ws_store_info[0].store_phone[0]?.phone,
              },
              {
                ellipsis: true,
                title: "계좌정보",
                render: (_, record) => {
                  const {
                    bank = "",
                    account_number = "",
                    account_holder = "",
                  } = record.ws_store_info[0].store_account[0] || {};

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
                      //checked={record.is_taxed}
                      style={{ width: "52px" }}
                    />
                  );
                },
              },
            ]}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="이상" key="2">
          거래처 대량 등록 미리보기 {count?.fail_count}건
          <Table
            size="small"
            loading={parseVendorsQuery.isLoading}
            dataSource={failList}
            rowKey={(record) => record.ws_store_info[0].id}
            pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
            columns={[
              {
                ellipsis: true,
                title: "거래처 코드",
                render: (_, record) => record.ws_store_info[0].id,
              },
              {
                ellipsis: true,
                title: "거래처명",
                render: (_, record) => {
                  if (record.ws_store_info.length === 1) return record.ws_store_info[0].name;

                  return (
                    <TurtleBadge count={record.ws_store_info.length} color="red">
                      <Popover
                        content={
                          <>
                            <p>이미 등록된 거래처명</p>
                            <Radio.Group>
                              <Space direction="vertical">
                                {record.ws_store_info.map(({ name }) => (
                                  <Radio value={name} key={name}>
                                    {name}
                                  </Radio>
                                ))}
                              </Space>
                            </Radio.Group>
                          </>
                        }
                      >
                        다중거래처
                      </Popover>
                    </TurtleBadge>
                  );
                },
              },
              {
                ellipsis: true,
                title: "거래처 주소",
                render: (_, record) => {
                  if (record.ws_store_info.length === 1) return record.ws_store_info[0].address;
                  return (
                    <TurtleBadge count={record.ws_store_info.length}>
                      <Popover
                        content={
                          <>
                            <p>이미 등록된 주소</p>
                            <Radio.Group>
                              <Space direction="vertical">
                                {record.ws_store_info.map(({ address }) => (
                                  <Radio value={address} key={address}>
                                    {address}
                                  </Radio>
                                ))}
                              </Space>
                            </Radio.Group>
                          </>
                        }
                      >
                        다중주소
                      </Popover>
                    </TurtleBadge>
                  );
                },
              },
              {
                ellipsis: true,
                title: "휴대번호",
                render: (_, record) => record.ws_store_info[0].store_phone[0]?.phone,
              },
              {
                ellipsis: true,
                title: "계좌정보",
                render: (_, record) => {
                  const {
                    bank = "",
                    account_number = "",
                    account_holder = "",
                  } = record.ws_store_info[0].store_account[0] || {};

                  return `${bank} ${account_number} ${account_holder}`;
                },
              },
              {
                title: "메모",
                render: (_, record) => {
                  return (
                    <Tooltip placement="topLeft" title={record.ws_store_info[0]}>
                      메모
                    </Tooltip>
                  );
                },
              },
              {
                title: "부가세 포함 여부",
                ellipsis: true,
                align: "center",
                render: (_, record) => {
                  return (
                    <Popconfirm
                      title={t("description.update tax included")}
                      okText={t("yes")}
                      cancelText={t("no")}
                      onConfirm={() => {}}
                    >
                      <Switch
                        checkedChildren={t("button.include")}
                        //checked={record.is_taxed}
                        style={{ width: "52px" }}
                      />
                    </Popconfirm>
                  );
                },
              },
              {
                align: "center",
                render: (_, record) => {
                  return (
                    <TurtleButtonSub //
                      size="small"
                      onClick={() => {}}
                    >
                      매칭하기
                    </TurtleButtonSub>
                  );
                },
              },
            ]}
          />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
}

export default CreateVendorsModal;
