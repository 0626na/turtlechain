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
  Button,
  Tooltip,
  Space,
} from "antd";
import { vendorAPI } from "apis";
import { AxiosError } from "axios";
import TurtleButton from "components/common/TurtleButton";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import TurtleText from "components/common/TurtleText";
import SearchFilter from "components/SearchFilter";
import { useMutation, useQuery } from "react-query";
import { t } from "i18next";

import { useState } from "react";
import { RequestGetClearingSheet, ClearingSheet } from "apis/clearingAPI";
import { clearingAPI } from "apis";
import ClearingDetailModal from "./ClearingDetailModal";

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
      "getWarehousingSheet",
      [searchQuery.rt_store_id, searchState.clearing_status, searchState.clearing_date],
    ], //
    () =>
      clearingAPI.getClearingSheet({
        rt_store_id: searchQuery.rt_store_id,
        page: searchState.page,
      }),
    {
      enabled: searchQuery.rt_store_id !== "",
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
