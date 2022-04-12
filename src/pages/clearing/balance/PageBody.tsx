import { t } from "i18next";
import { DatePicker, Divider, Pagination, Row, Table } from "antd";
import { clearingAPI } from "apis";
import { AxiosError } from "axios";
import { TurtleTableTitle } from "components/common";
import { MainContent, MenuBar } from "layouts/main";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import { useCallback, useEffect, useState } from "react";
import { BalanceShow, RequestGetBalance } from "apis/clearingAPI";
import moment from "moment";
import DetailModal from "./DetailModal";

function PageBody() {
  const store = useRecoilValue(storeState);
  const [searchQuery, setSearchQuery] = useState<RequestGetBalance>({
    rt_store_id: store.id,
    start_date: moment().subtract("1", "month").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
    tab: "balance",
  });
  const [selectedRow, selectRow] = useState<BalanceShow>();
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const getBalanceQuery = useQuery(
    ["getBalance", searchQuery],
    () => clearingAPI.getBalance(searchQuery),
    {
      enabled: !!searchQuery.rt_store_id,
      onError: (error: AxiosError) => {
        console.log(error.response?.data.msg);
      },
    },
  );

  useEffect(() => {
    setSearchQuery({
      rt_store_id: store.id,
      start_date: moment().subtract("1", "month").format("YYYY-MM-DD"),
      end_date: moment().format("YYYY-MM-DD"),
      tab: "balance",
    });
  }, [store.id]);

  const openDetailModal = useCallback((record) => {
    selectRow(record);
    setDetailModalVisible(true);
  }, []);

  return (
    <>
      <MenuBar />

      <MainContent title={t("clearing.balance lists")}>
        <Table
          size="small"
          dataSource={getBalanceQuery.data?.data.item_list}
          loading={getBalanceQuery.isLoading}
          pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
          rowKey={(record) => record.id}
          scroll={{ y: "auto" }}
          onRow={(record) => ({
            onClick: () => {
              openDetailModal(record);
            },
          })}
          title={() => (
            <TurtleTableTitle count={0}>
              <Divider type="vertical" style={{ margin: 0 }} />
              <DatePicker.RangePicker
                size="small"
                allowClear={false}
                value={[moment(searchQuery.start_date), moment(searchQuery.end_date)]}
                onChange={(_, [start_date, end_date]) => {
                  setSearchQuery({ ...searchQuery, start_date, end_date });
                }}
              />
            </TurtleTableTitle>
          )}
          columns={[
            {
              ellipsis: true,
              width: 150,
              align: "center",
              title: t("clearing.recent date"),
              render: (_, record) => moment(record.created_time).format("YYYY-MM-DD"),
            },
            {
              ellipsis: true,
              title: t("vendor.name"),
              render: (_, record) => record.vendor_info.vendor_name,
            },
            {
              ellipsis: true,
              title: t("vendor.address"),
              render: (_, record) => record.vendor_info.vendor_address,
            },
            {
              ellipsis: true,
              title: "환불 받을 금액",
              render: (_, record) => record.refund_amount.toLocaleString(),
            },
            {
              ellipsis: true,
              title: "사용 가능 금액",
              render: (_, record) => record.overpaid_amount?.toLocaleString(),
            },
            {
              ellipsis: true,
              width: 500,
              title: "최근 내역",
              render: (_, record) => record.memo,
            },
          ]}
        />
      </MainContent>

      <DetailModal
        visible={detailModalVisible}
        closeModal={() => {
          setDetailModalVisible(false);
        }}
        selectedRow={selectedRow}
      />
    </>
  );
}

export default PageBody;
