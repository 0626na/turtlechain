import {
  Col,
  Input,
  message,
  notification,
  Pagination,
  Popconfirm,
  Row,
  Switch,
  Table,
  Tooltip,
} from "antd";
import { vendorAPI } from "apis";
import { AxiosError } from "axios";
import TurtleButton from "components/common/TurtleButton";
import TurtleText from "components/common/TurtleText";
import SearchFilter from "components/SearchFilter";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import styled from "styled-components";
import { QuestionCircleOutlined, BookOutlined, BookFilled, EditFilled } from "@ant-design/icons";
import { Vendor, RequestGetVendors, VendorAccount } from "apis/vendorAPI";
import { useState } from "react";
import TurtleBadge from "components/common/TurtleBadge";
import VendorUpdateModal from "./VendorUpdateModal";
import TurtleQuestionTooltip from "components/common/TurtleQuestionTooltip";

interface Props {
  searchQuery: RequestGetVendors;
  searchState: {
    page: number;
    type: string;
    search_query: string;
  };
  searchVendors: () => void;
  selectPage: (page: number) => void;
}

function VendorList({ searchQuery, searchState, searchVendors, selectPage }: Props) {
  const { t } = useTranslation();

  const [editable, setEditable] = useState(false);
  const [memo, setMemo] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedRow, selectRow] = useState<Vendor>({
    id: -1,
    vendor_id: "",
    vendor_name: "",
    vendor_phone: "",
    vendor_account: "",
    is_taxed: false,
    memo: "",
    ws_store_info: {
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
    },
    ws_store_id: -1,
  });

  // 거래처 목록 불러오기 요청
  const getVendorsQuery = useQuery(
    ["getVendors", searchQuery], //
    () => vendorAPI.getVendors(searchQuery),
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

  // 거래처 부가세, 메모 수정 요청
  const updateVendorQuery = useMutation(["updateVendor"], vendorAPI.updateVendor, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      setEditable(false);
      setMemo("");
      getVendorsQuery.refetch();
      notification.open({
        type: "success",
        message: t("message.success update"),
      });
    },
  });

  const openModal = (record: Vendor) => {
    selectRow(record);
    setVisibleModal(true);
  };

  const closeModal = () => {
    setVisibleModal(false);
  };

  return (
    <>
      <StyledDiv>
        <TurtleText>{t("vendor.lists")}</TurtleText>
        <SearchFilter onSearch={searchVendors} />
      </StyledDiv>
      <Table
        size="small"
        scroll={{ x: "auto" }}
        loading={getVendorsQuery.isLoading}
        dataSource={getVendorsQuery.data?.data.vendor_list}
        rowKey={(record) => record.ws_store_id}
        pagination={false}
        expandable={{
          expandedRowRender: (record) => {
            return editable ? (
              <Row>
                <Col span={22}>
                  <Input
                    size="small"
                    defaultValue={record.memo}
                    onChange={(e) => {
                      setMemo(e.currentTarget.value);
                    }}
                  />
                </Col>
                <Col>
                  <EditFilled
                    style={{ marginLeft: "10px" }}
                    onClick={() => {
                      if (memo === record.memo) {
                        setEditable(false);
                        return;
                      }
                      updateVendorQuery.mutate({
                        id: record.id,
                        is_taxed: record.is_taxed,
                        memo: memo,
                      });
                      getVendorsQuery.refetch();
                    }}
                  />
                </Col>
              </Row>
            ) : (
              <>
                <span>{record.memo}</span>
                <EditFilled
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                    setMemo(record.memo);
                    setEditable((editable) => !editable);
                  }}
                />
              </>
            );
          },
          expandIcon: ({ expanded, onExpand, record }) => {
            return record.memo !== null ? (
              <BookFilled onClick={(e) => onExpand(record, e)} />
            ) : (
              <BookOutlined onClick={(e) => onExpand(record, e)} />
            );
          },
        }}
        columns={[
          {
            width: "9%",
            ellipsis: true,
            title: t("vendor.code"),
            dataIndex: "vendor_id",
            render: (id) => (
              <Tooltip placement="topLeft" title={id}>
                {id}
              </Tooltip>
            ),
          },
          {
            ellipsis: true,
            title: t("vendor.name"),
            dataIndex: ["ws_store_info", "name"],
            render: (name) => (
              <Tooltip placement="topLeft" title={name}>
                {name}
              </Tooltip>
            ),
          },
          {
            width: "13%",
            ellipsis: true,
            title: t("vendor.address"),
            dataIndex: "",
            render: (_, { ws_store_info: { building, floor, col, loc, ext } }) => {
              const address = `${building} ${floor}층 ${col}${col ? "열" : ""} ${loc}호 ${ext}`;
              return (
                <Tooltip placement="topLeft" title={address}>
                  {address}
                </Tooltip>
              );
            },
          },
          {
            width: "12%",
            ellipsis: true,
            title: t("vendor.store phone"),
            dataIndex: "",
            render: (_, { ws_store_info: { store_phone } }) => {
              const phones: Array<string> = [];
              store_phone.forEach(({ phone }) => {
                phones.push(phone);
              });

              const contents = phones.map((phone) => {
                return <p key={phone}>{phone}</p>;
              });

              return (
                <TurtleBadge count={phones.length}>
                  <Tooltip placement="topLeft" title={contents}>
                    {phones[0]}
                  </Tooltip>
                </TurtleBadge>
              );
            },
          },
          {
            width: "20%",
            ellipsis: true,
            title: t("vendor.account"),
            dataIndex: "",
            render: (_, { ws_store_info: { store_account } }) => {
              const accounts: Array<VendorAccount> = [];
              store_account.forEach(({ id, bank, account_holder, account_number }) => {
                accounts.push({ id, bank, account_holder, account_number });
              });

              const makeContent = (account: VendorAccount) => {
                return `${account?.bank} ${account?.account_number} ${account?.account_holder}`;
              };

              const contents = accounts.map((account) => {
                return <p key={account.account_number}>{makeContent(account)}</p>;
              });

              return (
                <TurtleBadge count={contents.length}>
                  <Tooltip placement="topLeft" title={contents}>
                    {makeContent(accounts[0])}
                  </Tooltip>
                </TurtleBadge>
              );
            },
          },
          Table.EXPAND_COLUMN,
          {
            align: "center",
            width: "12%",
            ellipsis: true,
            title: t("vendor.include tax"),
            dataIndex: "is_taxed",
            render: (_, record) => {
              return (
                <Popconfirm
                  title={t("description.update tax included")}
                  okText={t("yes")}
                  cancelText={t("no")}
                  onConfirm={() => {
                    updateVendorQuery.mutate({
                      id: record.id,
                      is_taxed: !record.is_taxed,
                      memo: record.memo,
                    });
                    getVendorsQuery.refetch();
                  }}
                >
                  <Switch
                    checkedChildren={t("button.include")}
                    checked={record.is_taxed}
                    style={{ width: "52px" }}
                  />
                </Popconfirm>
              );
            },
          },
          {
            width: "15%",
            ellipsis: true,
            align: "center",
            title: () => {
              return (
                <>
                  {t("common.request update")}
                  <TurtleQuestionTooltip content={t("tooltip.request update")} />
                </>
              );
            },
            dataIndex: "action",
            render: (_, record) => {
              return (
                <TurtleButton //
                  size="small"
                  ghost
                  onClick={() => openModal(record)}
                >
                  {t("button.request update")}
                </TurtleButton>
              );
            },
          },
        ]}
        footer={() => (
          <Row justify="center">
            <Pagination
              size="small"
              total={getVendorsQuery.data?.data.total_count}
              showSizeChanger={false}
              current={searchState.page}
              onChange={selectPage}
            />
          </Row>
        )}

        // end of Table
      />
      <VendorUpdateModal //
        visible={visibleModal}
        closeModal={closeModal}
        selectedRow={selectedRow}
      />
    </>
  );
}

const StyledDiv = styled.div`
  padding-bottom: 0;
`;

export default VendorList;
