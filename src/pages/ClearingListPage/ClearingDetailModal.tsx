import { Dispatch, SetStateAction, useMemo } from "react";
import { Descriptions, Modal, message, Table } from "antd";
import { useQuery } from "react-query";
import { AxiosError } from "axios";
import { t } from "i18next";
import { clearingAPI } from "apis";
import { ClearingSheet } from "apis/clearingAPI";

/*
  Parent : ClearingSheetList
  Children : None

  * React Function
    vendorCountTotal = 거래처 수 합계

  * Custom Function
    getClearingItemQuery = 정산 아이템 리스트 얻어오는 API
*/

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
  const getClearingItemQuery = useQuery(
    ["getClearingItem", selectedClearingSheet?.id], //
    () =>
      clearingAPI.getClearingItem({
        sheet_id: selectedClearingSheet ? selectedClearingSheet.id : 0,
      }),
    {
      enabled: selectedClearingSheet?.id !== 0 && !!selectedClearingSheet?.id,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

  const vendorCountTotal = useMemo(
    () =>
      new Set(
        getClearingItemQuery.data?.data.map((value: any) => {
          return value.vendor_id;
        }),
      ).size,
    [getClearingItemQuery.data?.data],
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
        title={t("clearing.detail list")}
        layout="vertical"
        bordered
        style={{ marginBottom: 12 }}
      >
        <Descriptions.Item label={t("clearing.request_date")}>
          {selectedClearingSheet?.request_date}
        </Descriptions.Item>
        <Descriptions.Item label={t("clearing.total_vendor_count")}>
          {vendorCountTotal}
        </Descriptions.Item>
        <Descriptions.Item label={t("clearing.total_price")}>
          {selectedClearingSheet?.total_price.toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label={t("clearing.status.default")}>
          {t("clearing.status." + selectedClearingSheet?.status)}
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
            title: t("clearing.vendor.name"),
            dataIndex: "vendor_name",
          },
          {
            ellipsis: true,
            title: t("clearing.vendor.address"),
            dataIndex: "total_price",
            // TODO : 주소가 필요합니다.
            render: (value) => <span>{"need address"}</span>,
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
            render: (value) => <span>{value.toLocaleString()}</span>,
          },
          {
            ellipsis: true,
            title: t("clearing.supply_price"),
            dataIndex: "supply_price",
            render: (value) => <span>{value.toLocaleString()}</span>,
          },
          {
            ellipsis: true,
            title: t("clearing.vat_price"),
            dataIndex: "vat_price",
            render: (value) => <span>{value.toLocaleString()}</span>,
          },
          {
            ellipsis: true,
            title: t("clearing.is_vat_included"),
            dataIndex: "is_vat_included",
            render: (value) => <>{!!value ? "O" : ""}</>,
          },
          {
            ellipsis: true,
            title: t("clearing.detail.type.default"),
            render: (_v, record) => {
              const dict: any = {
                warehousing: t("clearing.detail.type.warehousing"),
                adjustment: {
                  "": t("clearing.detail.type.adjustment todayreserve"),
                  subtract: t("clearing.detail.type.adjustment subtract"),
                  refund: t("clearing.detail.type.adjustment refund"),
                },
              };
              if (record.type === "warehousing") {
                return <>{dict[record.type]}</>;
              } else if (record.type === "adjustment") {
                return (
                  <>
                    {
                      dict[record.type][
                        record.adjustment_process_type ? record.adjustment_process_type : ""
                      ]
                    }
                  </>
                );
              }
            },
          },
        ]}
      />
    </Modal>
  );
}

export default ClearingDetailModal;
