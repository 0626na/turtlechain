import {
  Descriptions,
  Modal,
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
import { Dispatch, SetStateAction, useState } from "react";
import TurtleBadge from "components/common/TurtleBadge";
import TurtleQuestionTooltip from "components/common/TurtleQuestionTooltip";
import { ClearingSheet, ResponseClearingItem, ResponseGetClearingItem } from "apis/clearingAPI";
import { clearingAPI } from "apis";
import { t } from "i18next";

interface Props {
  detailModalVisible: boolean;
  setDetailModalVisible: Dispatch<SetStateAction<boolean>>;
  selectedClearingSheet: ClearingSheet | undefined;
}

function ClearingDetailModal({
  detailModalVisible,
  setDetailModalVisible,
  selectedClearingSheet,
}: Props) {
  const [list, setList] = useState<Array<ResponseClearingItem>>([]);
  const getClearingItemQuery = useQuery(
    ["getClearingItem", selectedClearingSheet?.id], //
    () =>
      clearingAPI.getClearingItem({
        sheet_id: selectedClearingSheet ? selectedClearingSheet.id : 0,
      }),
    {
      enabled: selectedClearingSheet?.id !== 0 && !!selectedClearingSheet?.id,
      onSuccess: (data: ResponseGetClearingItem) => {
        console.log(data);
      },
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

  return (
    <Modal
      closable={false}
      centered={true}
      width={"90vw"}
      visible={detailModalVisible}
      onOk={() => setDetailModalVisible(!detailModalVisible)}
      onCancel={() => setDetailModalVisible(!detailModalVisible)}
      keyboard={true}
      destroyOnClose={true}
      maskClosable={false}
    >
      <Descriptions
        size="small"
        column={4}
        title={t("warehousing.detail list")}
        layout="vertical"
        bordered
        style={{ marginBottom: 12 }}
      >
        <Descriptions.Item label={t("created date")}>
          {selectedClearingSheet?.request_date}
        </Descriptions.Item>
        <Descriptions.Item label={t("warehousing.total count")}>
          {/* {selectedClearingSheet?.total_item_count} */}0
        </Descriptions.Item>
        <Descriptions.Item label={t("total supply price")}>
          {selectedClearingSheet?.total_price}
        </Descriptions.Item>
        <Descriptions.Item label={t("total vat price")}>
          {selectedClearingSheet?.status}
        </Descriptions.Item>
      </Descriptions>
      <Table
        rowKey={"id"}
        loading={getClearingItemQuery.isLoading}
        dataSource={getClearingItemQuery.data?.data}
        pagination={false}
        scroll={{ y: "55vh" }}
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
          },
          {
            ellipsis: true,
            title: t("clearing.vat_price"),
            dataIndex: "vat_price",
          },
          {
            ellipsis: true,
            title: t("clearing.is_vat_included"),
            dataIndex: "is_vat_included",
          },
        ]}
      />
    </Modal>
  );
}

export default ClearingDetailModal;
