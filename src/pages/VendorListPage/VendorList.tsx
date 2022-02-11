import {
  Col,
  Input,
  message,
  notification,
  Pagination,
  Popconfirm,
  Popover,
  Row,
  Switch,
  Table,
  Tooltip,
} from "antd";
import { vendorAPI } from "apis";
import { AxiosError } from "axios";
import TurtleText from "components/common/TurtleText";
import SearchFilter from "components/SearchFilter";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Vendor, RequestGetVendors, VendorAccount } from "apis/vendorAPI";
import { useCallback, useEffect, useState } from "react";
import TurtleBadge from "components/common/TurtleBadge";
import TurtleQuestionTooltip from "components/common/TurtleQuestionTooltip";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import { FileTextOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { useRecoilValue } from "recoil";
import { storeIdState } from "store/storeIdState";
import VendorUpdateModal from "./VendorUpdateModal";

interface VendorShow extends Vendor {
  memo_active: boolean;
  memo_value: string;
}

function VendorList() {
  const storeId = useRecoilValue(storeIdState);
  const [vendorList, setVendorList] = useState<Array<VendorShow>>();
  const [visibleUpdateModal, setVisibleUpdateModal] = useState(false);
  const [selectedVendor, selectVendor] = useState<VendorShow>();

  // 거래처 목록 불러오기 query
  const [searchQuery, setSearchQuery] = useState<RequestGetVendors>({
    page: 1,
    type: "all",
    search_query: "",
    rt_store_id: -1,
  });

  // 거래처 목록 불러오기 요청
  const getVendorsQuery = useQuery(
    ["getVendors", searchQuery], //
    () => vendorAPI.getVendors({ ...searchQuery, rt_store_id: storeId ?? -1 }),
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        setVendorList(
          data.data.vendor_list.map((vendor) => ({
            ...vendor,
            memo_active: !vendor.memo,
            memo_value: vendor.memo,
          })),
        );
      },
    },
  );

  // 거래처 부가세, 메모 수정 요청
  const updateVendorQuery = useMutation(
    ["updateVendor"], //
    vendorAPI.updateVendor,
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: () => {
        notification.open({
          type: "success",
          message: t("message.success update"),
        });
      },
    },
  );

  // 거래처 바뀔 때 리스트 검색
  useEffect(() => {
    setSearchQuery({ ...searchQuery, rt_store_id: storeId });
  }, [storeId]);

  const changeMemoValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, record: VendorShow) => {
      setVendorList(
        vendorList?.map((vendor) =>
          vendor.vendor_id === record.vendor_id
            ? {
                ...vendor,
                memo_value: e.currentTarget.value,
              }
            : vendor,
        ),
      );
    },
    [vendorList],
  );

  const changeMemo = useCallback(
    (record: VendorShow) => {
      if (record.memo_value === record.memo) return;
      setVendorList(
        vendorList?.map((vendor) =>
          vendor.vendor_id === record.vendor_id
            ? {
                ...vendor,
                memo: record.memo_value,
                memo_active: false,
              }
            : vendor,
        ),
      );
      updateVendorQuery.mutate({
        id: record.id,
        memo: record.memo_value,
        is_taxed: record.is_taxed,
      });
    },
    [vendorList, updateVendorQuery],
  );

  const changeMemoActive = useCallback(
    (record: VendorShow) => {
      setVendorList(
        vendorList?.map((vendor) =>
          vendor.vendor_id === record.vendor_id
            ? {
                ...vendor,
                memo_active: !record.memo_active,
              }
            : vendor,
        ),
      );
    },
    [vendorList],
  );

  const changeIsTaxed = useCallback(
    (record: VendorShow) => {
      setVendorList(
        vendorList?.map((vendor) =>
          vendor.vendor_id === record.vendor_id
            ? {
                ...vendor,
                is_taxed: !record.is_taxed,
              }
            : vendor,
        ),
      );
      updateVendorQuery.mutate({
        id: record.id,
        memo: record.memo,
        is_taxed: !record.is_taxed,
      });
    },
    [vendorList, updateVendorQuery],
  );

  // 검색 버튼 클릭
  const searchVendors = useCallback(
    ({ type, search_query }) => {
      setSearchQuery({
        ...searchQuery,
        page: 1,
        type,
        search_query,
      });
      //getVendorsQuery.refetch();
    },
    [searchQuery],
  );

  // 페이지 선택
  const selectPage = useCallback(
    (page: number) => {
      setSearchQuery({ ...searchQuery, page });
    },
    [searchQuery],
  );

  const openUpdateModal = useCallback((record: VendorShow) => {
    //selectRow(record);
    setVisibleUpdateModal(true);
  }, []);

  const closeUpdateModal = useCallback(() => {
    setVisibleUpdateModal(false);
  }, []);

  return (
    <>
      <div>
        <TurtleText>{t("vendor.lists")}</TurtleText>
        <SearchFilter onSearch={searchVendors} />
      </div>
      <Table
        size="small"
        loading={getVendorsQuery.isLoading}
        dataSource={vendorList}
        rowKey={(record) => record.vendor_id}
        pagination={false}
        expandable={{
          expandedRowRender: (record) => (
            <>
              {record.memo_active ? (
                <>
                  <Input
                    value={record.memo_value}
                    onChange={(e) => {
                      changeMemoValue(e, record);
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
                          changeMemo(record);
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
                          changeMemoActive(record);
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
            width: "10%",
            title: t("vendor.code"),
            render: (_, record) => (
              <Tooltip placement="topLeft" title={record.vendor_id}>
                {record.vendor_id}
              </Tooltip>
            ),
          },
          {
            ellipsis: true,
            title: t("vendor.name"),
            render: (_, record) => (
              <Tooltip placement="topLeft" title={record.vendor_name}>
                {record.vendor_name === null ? record.ws_store_info.name : record.vendor_name}
              </Tooltip>
            ),
          },
          {
            ellipsis: true,
            title: t("vendor.address"),
            render: (_, { ws_store_info: { building, floor, col, loc, ext } }) => {
              const address = `${building} ${floor}${floor ? "층" : ""} ${col}${
                col ? "열" : ""
              } ${loc}${floor ? "호" : ""} ${ext}`;
              return (
                <Tooltip placement="topLeft" title={address}>
                  {address}
                </Tooltip>
              );
            },
          },
          {
            ellipsis: true,
            title: t("vendor.store phone"),
            render: (_, { ws_store_info: { store_phone } }) => {
              if (store_phone.length === 1) {
                return (
                  <Tooltip placement="topLeft" title={store_phone[0].phone}>
                    {store_phone[0].phone}
                  </Tooltip>
                );
              }

              return (
                <TurtleBadge count={store_phone.length}>
                  <Popover
                    content={store_phone.map(({ id, phone }) => (
                      <p key={id}>{phone}</p>
                    ))}
                  >
                    {store_phone[0].phone}
                  </Popover>
                </TurtleBadge>
              );
            },
          },
          {
            ellipsis: true,
            width: "20%",
            title: t("vendor.account"),
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
            ellipsis: true,
            title: t("vendor.include tax"),
            render: (_, record) => {
              return (
                <Popconfirm
                  title={t("description.update tax included")}
                  okText={t("yes")}
                  cancelText={t("no")}
                  onConfirm={() => {
                    changeIsTaxed(record);
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
            render: (_, record) => {
              return (
                <TurtleButtonSub //
                  size="small"
                  color="green"
                  onClick={() => {
                    openUpdateModal(record);
                  }}
                >
                  {t("button.request update")}
                </TurtleButtonSub>
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
              current={searchQuery.page}
              onChange={selectPage}
            />
          </Row>
        )}

        // end of Table
      />
      <VendorUpdateModal //
        visible={visibleUpdateModal}
        closeModal={closeUpdateModal}
        //selectedRow={selectedRow}
      />
    </>
  );
}

export default VendorList;
