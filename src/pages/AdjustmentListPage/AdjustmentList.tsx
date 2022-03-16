import moment from "moment";
import { DeleteFilled, CheckOutlined } from "@ant-design/icons";
import { Table, Tag, Button, Popconfirm, Row, Space, Divider, Select, DatePicker } from "antd";
import SimplePagination from "components/SimplePagination";
import adjustmentAPI, { RequestGetList } from "apis/adjustmentAPI";
import { getLocalDateTimeString } from "utils/general";
import AdjustmentSearchFilter from "./AdjustmentSearchFilter";
import { useQuery } from "react-query";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { storeState } from "store/storeState";
import { useRecoilValue } from "recoil";
import Toolbar from "components/Toolbar";
import TurtleText from "components/common/TurtleText";
import SearchFilter from "components/SearchFilter";

const AdjustmentList = function () {
  const store = useRecoilValue(storeState);

  const [searchQuery, setSearchQuery] = useState<RequestGetList>({
    rt_store_id: store.id ?? -1,
    is_cleared: 2,
    start_date: moment().subtract(1, "months").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
    page: 1,
    type: "all",
  });

  const getAdjustmentListQuery = useQuery(
    ["getAdjustmentList", searchQuery],
    () => adjustmentAPI.getList(searchQuery),
    {
      enabled: !!store.id,
    },
  );

  useEffect(() => {
    setSearchQuery({ ...searchQuery, rt_store_id: store.id ?? -1 });
  }, [store.id]);

  // const [selectedRow, selectRow] = useState({
  //   sheet_id: -1,
  //   rt_store_id: -1,
  //   created_time: "",
  //   is_confirmed: 0,
  // });

  // // 입고장 삭제 요청
  // const deleteAdjQuery = useMutation(["deleteAdj"], adjustmentAPI.updateAdjustment, {
  //   onError: (error: AxiosError) => {
  //     message.error(error.response?.data?.msg);
  //   },
  //   onSuccess: () => {
  //     if (currentPage === 1) {
  //       getAdjustmentListQuery.refetch();
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

  // // 전체 데이터 수
  // const totalCount = useMemo(
  //   () => (getAdjustmentListQuery.data ? getAdjustmentListQuery.data.data.total_count : 0),
  //   [getAdjustmentListQuery.data],
  // );

  // const list = useMemo(
  //   () => (getAdjustmentListQuery.data ? getAdjustmentListQuery.data.data.adjustment_list : []),
  //   [getAdjustmentListQuery.data],
  // );

  let adjTypes = {
    exchange: "교환",
    reserve: "미송",
    refund: "환불",
    takeback: "반품",
  };

  return (
    <>
      <Toolbar />

      <Row style={{ paddingBottom: 0 }}>
        <TurtleText>{t("adjustment.lists")}</TurtleText>
      </Row>

      <Table
        size="small"
        dataSource={getAdjustmentListQuery.data?.data.adjustment_list}
        loading={getAdjustmentListQuery.isLoading}
        pagination={false}
        rowKey={(record) => record.id}
        scroll={{ y: "auto" }}
        title={() => (
          <Row justify="space-between">
            {`총 ${getAdjustmentListQuery.data?.data.total_count ?? 0}건`}
            <Space>
              <SearchFilter type="product" onSearch={() => {}} />

              <Divider type="vertical" style={{ margin: 0 }} />

              <Select
                bordered={false}
                size="small"
                style={{ width: 100 }}
                value={searchQuery.is_cleared}
                defaultValue={2}
                onChange={(is_cleared) => {
                  setSearchQuery({ ...searchQuery, is_cleared });
                }}
              >
                <Select.Option value={2}>{t("all")}</Select.Option>
                <Select.Option value={0}>{t("waiting")}</Select.Option>
                <Select.Option value={1}>{t("confirmed")}</Select.Option>
              </Select>

              <Divider type="vertical" style={{ margin: 0 }} />

              <DatePicker.RangePicker
                size="small"
                bordered={false}
                allowClear={false}
                value={[moment(searchQuery.start_date), moment(searchQuery.end_date)]}
                onChange={(_, dateStrings) => {
                  const start_date = dateStrings[0];
                  const end_date = dateStrings[1];
                  setSearchQuery({ ...searchQuery, start_date, end_date });
                }}
              />
            </Space>
          </Row>
        )}
        columns={[
          {
            ellipsis: true,
            width: 100,
            align: "center",
            title: t("progress"),
            render: (_, record) => {
              const { is_cleared } = record;
              const color = is_cleared ? "green" : "red";
              const text = is_cleared ? t("confirmed") : t("waiting");
              return <Tag color={color}>{text}</Tag>;
            },
          },
          {
            ellipsis: true,
            width: 120,
            title: t("adjustment date"),
            render: (_, record) => record.created_date,
          },
          {
            ellipsis: true,
            title: t("vendor.name"),
            render: (_, record) => record.vendor_info.vendor_name,
          },
          {
            ellipsis: true,
            title: t("product.name"),
            render: (_, record) => record.product_info.name,
          },
          {
            ellipsis: true,
            title: t("product.vendor product name"),
            render: (_, record) => record.product_info.vendor_product_name,
          },
          {
            ellipsis: true,
            title: t("product.price"),
            render: (_, record) => record.price.toLocaleString(),
          },
          {
            ellipsis: true,
            title: t("adjustment.count"),
            render: (_, record) => record.count,
          },
          {
            ellipsis: true,
            title: t("adjustment.type."),
            render: (_, record) => adjTypes[record.type],
          },
          // {
          //   title: "",
          //   dataIndex: "action",
          //   render: (_, record) => {
          //     return (
          //       <>
          //         <Button //
          //           size="small"
          //           shape="round"
          //           onClick={() => {}}
          //         >
          //           {t("view details")}
          //         </Button>
          //         {!record.is_cleared && (
          //           <>
          //             <Popconfirm
          //               title={t("description.really delete")}
          //               okText={t("yes")}
          //               cancelText={t("no")}
          //               onConfirm={() => {
          //                 onDelete(record);
          //               }}
          //             >
          //               <Button
          //                 icon={<DeleteFilled />}
          //                 danger
          //                 type="primary"
          //                 size="small"
          //                 shape="round"
          //               >
          //                 {t("delete")}
          //               </Button>
          //             </Popconfirm>
          //             <Popconfirm
          //               title={t("description.really confirmed")}
          //               okText={t("yes")}
          //               cancelText={t("no")}
          //             >
          //               <Button //
          //                 icon={<CheckOutlined />}
          //                 type="primary"
          //                 size="small"
          //                 shape="round"
          //               >
          //                 {t("confirmed")}
          //               </Button>
          //             </Popconfirm>
          //           </>
          //         )}
          //       </>
          //     );
          //   },
          // },
        ]}
      />

      {/* <AdjustmentSearchFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> */}
    </>
  );
};

export default AdjustmentList;
