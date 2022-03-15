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
import { useMutation, useQuery } from "react-query";
import { Vendor, RequestGetVendorList, VendorAccount } from "apis/vendorAPI";
import { useCallback, useEffect, useState } from "react";
import TurtleBadge from "components/common/TurtleBadge";
import TurtleQuestionTooltip from "components/common/TurtleQuestionTooltip";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import { FileTextOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import VendorUpdateModal from "./VendorUpdateModal";
import { phonePattern } from "utils/pattern";
import moment from "moment";
import Toolbar from "components/Toolbar";

interface VendorShow extends Vendor {
  memo_active: boolean;
  memo_value: string;
}

function VendorList() {
  const store = useRecoilValue(storeState);
  const [vendorList, setVendorList] = useState<Array<VendorShow>>();
  const [visibleUpdateModal, setVisibleUpdateModal] = useState(false);
  //const [selectedVendor, selectVendor] = useState<VendorShow>();

  // 거래처 목록 불러오기 query
  const [searchQuery, setSearchQuery] = useState<RequestGetVendorList>({
    page: 1,
    type: "all",
    search_string: "",
    rt_store_id: -1,
  });

  // 거래처 목록 불러오기 요청
  const getVendorsQuery = useQuery(
    ["getVendors", searchQuery], //
    () => vendorAPI.getVendorList({ ...searchQuery, rt_store_id: store.id ?? -1 }),
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

  // 쇼핑몰 바뀔 때 거래처 리스트 재검색
  useEffect(() => {
    setSearchQuery({ ...searchQuery, rt_store_id: store.id, page: 1 });
  }, [store.id]);

  const changeMemoValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, record: VendorShow) => {
      setVendorList(
        vendorList?.map((vendor) =>
          vendor.vendor_code === record.vendor_code
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
          vendor.vendor_code === record.vendor_code
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
        is_vat_included: record.is_vat_included,
      });
    },
    [vendorList, updateVendorQuery],
  );

  const setMemoActive = useCallback(
    (record: VendorShow) => {
      setVendorList(
        vendorList?.map((vendor) =>
          vendor.vendor_code === record.vendor_code
            ? {
                ...vendor,
                memo_active: true,
              }
            : vendor,
        ),
      );
    },
    [vendorList],
  );

  const setMemoInactive = useCallback(
    (record: VendorShow) => {
      setVendorList(
        vendorList?.map((vendor) =>
          vendor.vendor_code === record.vendor_code
            ? {
                ...vendor,
                memo_active: false,
                memo_value: record.memo,
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
          vendor.vendor_code === record.vendor_code
            ? {
                ...vendor,
                is_vat_included: !record.is_vat_included,
              }
            : vendor,
        ),
      );
      updateVendorQuery.mutate({
        id: record.id,
        memo: record.memo,
        is_vat_included: !record.is_vat_included,
      });
    },
    [vendorList, updateVendorQuery],
  );

  // 검색 버튼 클릭
  const searchVendors = useCallback(
    ({ type, search_string }) => {
      setSearchQuery({
        ...searchQuery,
        page: 1,
        type,
        search_string,
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

  return (
    <>
      <Toolbar />

      <Row style={{ paddingBottom: 0 }}>
        <TurtleText>{t("vendor.lists")}</TurtleText>
      </Row>

      <Table
        size="small"
        loading={getVendorsQuery.isLoading}
        dataSource={vendorList}
        rowKey={(record) => record.vendor_code}
        pagination={false}
        scroll={{ y: "auto" }}
        title={() => (
          <Row justify="space-between">
            <b>{`총 ${getVendorsQuery.data?.data.total_count ?? 0}건`}</b>
            <SearchFilter type="vendor" onSearch={searchVendors} />
          </Row>
        )}
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
                      {record.memo && (
                        <TurtleButtonSub
                          size="small"
                          color="grey"
                          onClick={() => {
                            setMemoInactive(record);
                          }}
                        >
                          취소
                        </TurtleButtonSub>
                      )}
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
                          setMemoActive(record);
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
              <Tooltip placement="topLeft" title={record.vendor_code}>
                {record.vendor_code}
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
            render: (_, { vendor_phone, ws_store_info: { store_phone } }) => {
              return (
                <TurtleBadge count={store_phone.length}>
                  <Popover
                    content={store_phone.map(({ id, phone }) => (
                      <p key={id}>{phone.replace(phonePattern, `$1-$2-$3`)}</p>
                    ))}
                  >
                    {vendor_phone.phone.replace(phonePattern, `$1-$2-$3`)}
                  </Popover>
                </TurtleBadge>
              );
            },
          },
          {
            ellipsis: true,
            title: t("vendor.account"),
            render: (_, { vendor_account, ws_store_info: { store_account } }) => {
              const makeAccount = (account: VendorAccount) =>
                `${account?.bank} ${account?.account_number} ${account?.account_holder}`;

              return (
                <Tooltip title={makeAccount(vendor_account)}>{makeAccount(vendor_account)}</Tooltip>
              );
            },
          },
          {
            ellipsis: true,
            width: 120,
            title: t("vendor.include tax"),
            render: (_, record) => (
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
                  checked={record.is_vat_included}
                  style={{ width: "52px" }}
                />
              </Popconfirm>
            ),
          },
          Table.EXPAND_COLUMN,
        ]}
      />
    </>
  );
}

export default VendorList;
