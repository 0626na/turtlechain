import { useState } from "react";
import { message, Table, Space, Popconfirm } from "antd";
import { AxiosError } from "axios";
import { useQuery, useMutation } from "react-query";
import { t } from "i18next";
import { clearingAPI } from "apis";
import { RequestGetClearingSheet, ClearingSheet } from "apis/clearingAPI";
import ClearingDetailModal from "./ClearingDetailModal";
import TurtleButtonSub from "components/common/TurtleButtonSub";

/*
  Parent : index
  Children : ClearingDetailModal

  * Custom Function
    getClearingSheetQuery = 정산장 리스트 얻어오는 API
    mutateUpdateClearingSheet = 정산장 수정 API (삭제처리)
    onClickDelete = 삭제버튼 눌렀을 때 
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
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [selectedClearingSheet, setSelectedClearingSheet] = useState<ClearingSheet>();

  const getClearingSheetQuery = useQuery(
    [
      "getClearingSheet",
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

  const mutateUpdateClearingSheet = useMutation(
    ["updateClearingSheet"],
    clearingAPI.updateClearingSheet,
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

  const onClickDelete = (record: ClearingSheet) => {
    console.log("deeleleleltleltletl");
    // mutateUpdateClearingSheet.mutate({
    //   ...record,
    //   is_inactive: true,
    // });
  };

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
                  <Popconfirm title={t("message.confirm delete")} onConfirm={() => onClickDelete(record)}>
                    <TurtleButtonSub color="red" children={t("button.delete")} />
                  </Popconfirm>
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
