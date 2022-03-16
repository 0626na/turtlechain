import styled from "styled-components";
import { RequestGetSheet, WarehousingSheet } from "apis/warehousingAPI";
import { DeleteFilled, CheckOutlined } from "@ant-design/icons";
import { Table, Tag, Button, Popconfirm, Pagination, Row } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import { getLocalDateTimeString } from "utils/general";
import TurtleText from "components/common/TurtleText";
import { t } from "i18next";
import Toolbar from "components/Toolbar";

const WarehousingSheetList = function () {
  const store = useRecoilValue(storeState);
  const [getSheetQuery, setGetSheetQuery] = useState<RequestGetSheet>({
    rt_store_id: -1,
    is_confirmed: "",
    start_date: "",
    end_date: "",
    page: 1,
  });

  // let adjTypes = {
  //   exchange: "교환",
  //   reserve: "미송",
  //   balance: "잔",
  //   takeback: "반품",
  // };
  // useEffect(() => {}, [store]);

  // // 쇼핑몰 id
  // const store = useRecoilValue(storeState);
  // const [visibleDetailModal, setVisibleDetailModal] = useState(false);
  // const [sheetItemList, setSheetItemList] = useState<Array<WarehousingProduct>>([]);

  // type SearchType = "vendor_name" | "vendor_address" | "product_code" | "product_name";
  // const [searchType, setSearchType] = useState<SearchType>("vendor_name");
  // const [searchText, setSearchText] = useState("");
  // const search_options = [
  //   {
  //     value: "vendor_name",
  //     label: t("vendor.name"),
  //   },
  //   {
  //     value: "vendor_address",
  //     label: t("vendor.address"),
  //   },
  //   {
  //     value: "product_code",
  //     label: t("product code"),
  //   },
  //   {
  //     value: "product_name",
  //     label: t("product name"),
  //   },
  // ];

  // const [selectedRow, selectRow] = useState({
  //   sheet_id: -1,
  //   rt_store_id: -1,
  //   created_time: "",
  //   is_confirmed: 0,
  // });

  // const filteredList = useMemo(
  //   () =>
  //     sheetItemList.filter(
  //       (item) =>
  //         // item
  //         item![searchType].toString().indexOf(searchText) !== -1,
  //     ),
  //   [sheetItemList, searchType, searchText],
  // );

  // const [sheetList, setSheetList] = useState<Array<WarehousingSheet>>();
  // const [currentPage, setCurrentPage] = useState(1);
  // const [searchQuery, setSearchQuery] = useState<RequestGetSheet>({
  //   rt_store_id: store.id ?? -1,
  //   is_confirmed: "",
  //   start_date: moment().subtract(1, "months").format("YYYY-MM-DD"),
  //   end_date: moment().format("YYYY-MM-DD"),
  //   page: 1,
  // });

  // // 입고장 리스트 요청
  // const getSheetQuery = useQuery(
  //   ["getSheet", searchQuery],
  //   () => warehousingAPI.getSheet(searchQuery),
  //   {
  //     enabled: !!store.id,
  //   },
  // );

  // // 입고장 삭제 요청
  // const deleteSheetQuery = useMutation(["deleteSheet"], warehousingAPI.updateSheet, {
  //   onError: (error: AxiosError) => {
  //     message.error(error.response?.data?.msg);
  //   },
  //   onSuccess: () => {
  //     if (currentPage === 1) {
  //       getSheetQuery.refetch();
  //     } else {
  //       setCurrentPage(1);
  //       setSearchQuery({ ...searchQuery });
  //       // setSearchQuery({ ...searchQuery, last_id: -1, switch_type: "next" });
  //     }

  //     notification.open({
  //       type: "success",
  //       message: t("message.success delete warehousing"),
  //     });
  //   },
  // });

  // // 입고장 수정 요청
  // const confirmSheetQuery = useMutation(["confirmSheet"], warehousingAPI.updateSheet, {
  //   onError: (error: AxiosError) => {
  //     message.error(error.response?.data?.msg);
  //   },
  //   onSuccess: () => {
  //     getSheetQuery.refetch();
  //     notification.open({
  //       type: "success",
  //       message: t("message.success confirm warehousing"),
  //     });
  //   },
  // });

  // // 입고장 리스트
  // const list = useMemo(
  //   () => (getSheetQuery.data ? getSheetQuery.data.sheet_list : []),
  //   [getSheetQuery.data],
  // );

  // // 전체 데이터 수
  // const totalCount = useMemo(
  //   () => (getSheetQuery.data ? getSheetQuery.data.total_count : 0),
  //   [getSheetQuery.data],
  // );

  // // 입고장 상세내역 리스트 요청

  // useEffect(() => {
  //   setSearchQuery({ ...searchQuery, rt_store_id: store.id ?? -1 });
  // }, [store.id]);

  return (
    <>
      <Toolbar />

      <Row style={{ paddingBottom: 0 }}>
        <TurtleText>{t("warehousing.lists")}</TurtleText>
      </Row>
      <Row>
        {/* <WarehousingSearchFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> */}
        <Table
          size="small"
          scroll={{ y: "auto" }}
          pagination={false}
          onRow={(record) => {
            return {
              onClick: () => {
                //onSelectRow(record);
              },
            };
          }}
          //loading={isLoading}
          //dataSource={list}
          rowKey={(record) => record.id}
          style={{ height: "580px" }}
          columns={[
            {
              width: 100,
              align: "center",
              title: t("progress"),
              dataIndex: "is_confirmed",
              render: (_, record) => {
                const { is_confirmed } = record;
                const color = is_confirmed ? "green" : "red";
                const text = is_confirmed ? t("confirmed") : t("waiting");
                return <Tag color={color}>{text}</Tag>;
              },
            },
            {
              width: 120,
              align: "center",
              title: t("warehousing.date"),
              dataIndex: "created_time",
              render: (_, record) => getLocalDateTimeString(record.created_time),
              // moment(record.created_time).format("YYYY-MM-DD"),
            },
            {
              align: "right",
              title: t("warehousing.total count"),
              dataIndex: "total_item_count",
              render: (_, record) => record.total_item_count.toLocaleString(),
            },
            {
              align: "right",
              title: t("total supply price"),
              dataIndex: "total_price",
              render: (_, record) => record.total_price.toLocaleString(),
            },
            {
              width: 300,
              align: "center",
              title: "",
              dataIndex: "action",
              render: (_, record) => {
                return (
                  <ActionContainer
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Button //
                      size="small"
                      shape="round"
                      onClick={() => {
                        //onSelectRow(record);
                      }}
                    >
                      {t("view details")}
                    </Button>
                    {!record.is_confirmed && (
                      <>
                        <Popconfirm
                          title={t("description.really delete")}
                          okText={t("yes")}
                          cancelText={t("no")}
                          onConfirm={() => {
                            //onDelete(record);
                          }}
                        >
                          <Button
                            icon={<DeleteFilled />}
                            danger
                            type="primary"
                            size="small"
                            shape="round"
                          >
                            {t("delete")}
                          </Button>
                        </Popconfirm>
                        {/* <Popconfirm
                        title={t("description.really confirmed")}
                        okText={t("yes")}
                        cancelText={t("no")}
                        onConfirm={() => {
                          onConfirm(record);
                        }}
                      >
                        <Button //
                          icon={<CheckOutlined />}
                          type="primary"
                          size="small"
                          shape="round"
                        >
                          {t("confirmed")}
                        </Button>
                      </Popconfirm> */}
                      </>
                    )}
                  </ActionContainer>
                );
              },
            },
          ]}
          footer={() => (
            <Footer>
              <Pagination
                size="small"
                //total={totalCount}
                showSizeChanger={false}
                current={getSheetQuery.page}
              />
            </Footer>
          )}
        />
        {/* <WarehousingSheetItemModal
        {...selectedRow}
        sheet_id={selectedRow.sheet_id}
        visible={visibleDetailModal}
        onClose={() => {
          setVisibleDetailModal(false);
        }}
        onUpdated={() => {
          getSheetQuery.refetch();
        }}
      /> */}
      </Row>
    </>
  );
};

const Footer = styled.div`
  display: flex;
  justify-content: center;
`;

const ActionContainer = styled.div`
  & > * + * {
    margin-left: 10px;
  }
`;

export default WarehousingSheetList;
