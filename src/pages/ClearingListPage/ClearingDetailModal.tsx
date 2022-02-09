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
import styled from "styled-components";
import { QuestionCircleOutlined, BookOutlined, BookFilled, EditFilled } from "@ant-design/icons";
import { Vendor, RequestGetVendors } from "apis/vendorAPI";
import { useState } from "react";
import TurtleBadge from "components/common/TurtleBadge";
import TurtleQuestionTooltip from "components/common/TurtleQuestionTooltip";
import { ResponseGetClearingItem } from "apis/clearingAPI";
import { clearingAPI } from "apis";
import { t } from "i18next";


function ClearingDetailModal() {
  const getClearingItemQuery = useQuery(
    ["getClearingItem"], //
    () =>
      clearingAPI.getClearingItem({
        sheet_id: 1,
      }),
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );
  return (
    <Table
      rowKey={"id"}
      loading={getClearingItemQuery.isLoading}
      dataSource={getClearingItemQuery.data?.data}
      columns={[
        {
          ellipsis: true,
          title: "Temporary id remove this",
          dataIndex: "id",
          key: "id",
        },
        {
          ellipsis: true,
          title: t("clearing.vendor.code"),
          dataIndex: "vendor_id",
        },
        {
          ellipsis: true,
          title: t("clearing.vendor.name"),
          dataIndex: "vendor_name",
        },
        {
          ellipsis: true,
          title: t("clearing.vendor.address"),
          dataIndex: "total_price",
        },
        {
          ellipsis: true,
          title: t("clearing.account"),
          dataIndex: "account_number",
        },
        {
          ellipsis: true,
          title: t("clearing.price"),
          dataIndex: "total_price",
        },
        {
          ellipsis: true,
          title: t("clearing.supply_price"),
          dataIndex: "supply_price",
        },{
          ellipsis: true,
          title: t("clearing.vat_price"),
          dataIndex: "vat_price",
        },{
          ellipsis: true,
          title: t("clearing.is_vat_included"),
          dataIndex: "is_vat_included",
        },
      ]}
    />
  );
}

export default ClearingDetailModal;
