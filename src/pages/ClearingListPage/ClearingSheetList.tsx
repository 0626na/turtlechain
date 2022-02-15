import { message, Table, Space } from "antd";
import { AxiosError } from "axios";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import { useQuery } from "react-query";
import { t } from "i18next";

import { useState } from "react";
import { RequestGetClearingSheet, ClearingSheet } from "apis/clearingAPI";
import { clearingAPI } from "apis";
import ClearingDetailModal from "./ClearingDetailModal";
import { useRecoilValue } from "recoil";
import { storeIdState } from "store/storeIdState";

/*
  Parent : index
  Children : ClearingDetailModal

  * Custom Function
    getClearingSheetQuery = 정산 아이템 리스트 얻어오는 API
*/

interface Props {
  searchQuery: RequestGetClearingSheet;
  searchState: {
    page: number;
    clearing_status: "all" | "request" | "pending" | "complete";
    clearing_date: undefined | "request_date" | "complete_date";
  };
}

function ClearingSheetList({ searchQuery, searchState }: Props) {
  const storeId = useRecoilValue(storeIdState);

  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [selectedClearingSheet, setSelectedClearingSheet] = useState<ClearingSheet>();

  const getClearingSheetQuery = useQuery(
    [
      "getWarehousingSheet",
      [searchQuery.rt_store_id, searchState.clearing_status, searchState.clearing_date],
    ], //
    () =>
      clearingAPI.getClearingSheet({
        rt_store_id: searchQuery.rt_store_id,
        page: searchState.page,
      }),
    {
      enabled: searchQuery.rt_store_id !== undefined,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );
  return (
    <>
      <Table
        rowKey={"id"}
        onRow={(record) => ({
          onClick: () => {
            setSelectedClearingSheet(record);
          },
        })}
        loading={getClearingSheetQuery.isLoading}
        dataSource={getClearingSheetQuery.data?.data}
        columns={[
          {
            ellipsis: true,
            title: "Temporary id remove this",
            dataIndex: "id",
            key: "id",
          },
          {
            ellipsis: true,
            title: t("clearing.request_date"),
            dataIndex: "request_date",
          },
          {
            ellipsis: true,
            title: t("clearing.complete_date"),
            dataIndex: "complete_date",
          },
          {
            ellipsis: true,
            title: t("clearing.total_price"),
            dataIndex: "total_price",
          },
          {
            ellipsis: true,
            title: t("clearing.status.default"),
            dataIndex: "status",
            render: (value) => {
              return <Space>{t("clearing.status." + value)}</Space>;
            },
          },
          {
            ellipsis: true,
            title: t("clearing.detail.default"),
            render: () => (
              <TurtleButtonSub
                color="gray"
                children={t("button.details")}
                onClick={() => {
                  setDetailModalVisible(!detailModalVisible);
                }}
              />
            ),
          },
          {
            ellipsis: true,
            title: t("clearing.delete"),
            render: (record) => {
              if (record.status === "request")
                return (
                  <TurtleButtonSub color="red" children={t("button.delete")} onClick={() => {}} />
                );
            },
          },
        ]}
      />
      <ClearingDetailModal
        detailModalVisible={detailModalVisible}
        setDetailModalVisible={setDetailModalVisible}
        selectedClearingSheet={selectedClearingSheet}
      />
    </>
  );
}

export default ClearingSheetList;
