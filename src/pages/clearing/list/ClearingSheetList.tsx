import { useState } from "react";
import { message, Table, Space, Popconfirm, Row } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { AxiosError } from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { t } from "i18next";
import { clearingAPI } from "apis";
import { RequestGetClearingSheet, ClearingSheet } from "apis/clearingAPI";
import ClearingDetailModal from "./ClearingDetailModal";
import { TurtleButtonSub } from "components/common";

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
  const qc = useQueryClient();
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [selectedClearingSheet, setSelectedClearingSheet] = useState<ClearingSheet>();

  const getClearingSheetQuery = useQuery(
    [
      "getClearingSheet",
      [
        searchQuery.rt_store_id,
        searchState.clearing_status,
        searchState.clearing_date,
        searchQuery.start_date,
        searchQuery.end_date,
      ],
    ], //
    () => {
      const params: RequestGetClearingSheet = {
        rt_store_id: searchQuery.rt_store_id,
        page: searchState.page,
      };
      if (searchState.clearing_status !== "all") {
        params.status = searchState.clearing_status;
      }
      if (searchState.clearing_date) {
        params.date_filter = searchState.clearing_date;
      }
      if (searchQuery.start_date) {
        params.start_date = searchQuery.start_date;
      }
      if (searchQuery.end_date) {
        params.end_date = searchQuery.end_date;
      }
      return clearingAPI.getClearingSheet(params);
    },
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
      onSuccess: () => {
        message.success(t("message.success delete clearing"));
        qc.refetchQueries("getClearingSheet");
      },
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

  const onClickDelete = (record: ClearingSheet) => {
    mutateUpdateClearingSheet.mutate({
      ...record,
      is_inactive: true,
    });
  };

  return (
    <>
      <Row>
        <Space>
          <WarningOutlined />
          <span>{t("message.warning clearing information")}</span>
        </Space>
      </Row>
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
            render: (value) => <span>{value.toLocaleString()}</span>,
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
                  <Popconfirm
                    title={t("message.confirm delete")}
                    onConfirm={() => onClickDelete(record)}
                  >
                    <TurtleButtonSub
                      color="red"
                      children={t("button.delete")}
                      loading={mutateUpdateClearingSheet.isLoading}
                    />
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
