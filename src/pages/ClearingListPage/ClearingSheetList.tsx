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
} from "antd";
import { vendorAPI } from "apis";
import { AxiosError } from "axios";
import TurtleButton from "components/common/TurtleButton";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import TurtleText from "components/common/TurtleText";
import SearchFilter from "components/SearchFilter";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { t } from "i18next";

import styled from "styled-components";
import { QuestionCircleOutlined, BookOutlined, BookFilled, EditFilled } from "@ant-design/icons";
import { Vendor, RequestGetVendors } from "apis/vendorAPI";
import { useState } from "react";
import TurtleBadge from "components/common/TurtleBadge";
import TurtleQuestionTooltip from "components/common/TurtleQuestionTooltip";
import { RequestGetClearingSheet } from "apis/clearingAPI";
import { clearingAPI } from "apis";

interface Props {
  searchQuery: RequestGetClearingSheet;
  searchState: {
    page: number;
    clearing_status: "all" | "request" | "pending" | "complete";
    clearing_date: undefined | "request_date" | "complete_date";
  };
}

function ClearingSheetList({ searchQuery, searchState }: Props) {
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
    <Table
      rowKey={"id"}
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
        },
        {
          ellipsis: true,
          title: t("clearing.detail"),
          render: () => <TurtleButtonSub children={t("button.details")} onClick={() => {}} />,
        },
        {
          ellipsis: true,
          title: t("clearing.delete"),
          render: (record) => {
            if (record.status === "request")
              return <TurtleButtonSub children={t("button.delete")} onClick={() => {}} />;
          },
        },
      ]}
    />
  );
}

export default ClearingSheetList;
