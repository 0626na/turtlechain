import { t } from "i18next";
import { message, Table } from "antd";
import { clearingAPI } from "apis";
import { ClearingSheetShow } from "apis/clearingAPI";
import { AxiosError } from "axios";
import { TurtleModal, TurtleStatistics, TurtleTableTitle } from "components/common";
import { useQuery } from "react-query";

interface Props {
  visible: boolean;
  closeModal: () => void;
  sheet?: ClearingSheetShow;
}

function DetailModal({ visible, closeModal, sheet }: Props) {
  const getItemQuery = useQuery(
    ["getClearingItem"], //
    () =>
      clearingAPI.getItem({
        sheet_id: sheet?.id!,
        page_size: 100,
      }),
    {
      enabled: visible && !!sheet?.id,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

  return (
    <TurtleModal
      centered
      width="90%"
      bodyStyle={{ height: "80vh", overflow: "auto" }}
      title={t("clearing.detail")}
      visible={visible}
      onCancel={closeModal}
      footer={false}
    >
      <TurtleStatistics
        value={[
          {
            title: t("clearing.status.default"),
            value: t(`clearing.status.${sheet?.status}`).toString(),
          },
          { title: t("clearing.request date"), value: `${sheet?.request_date}` },
          { title: t("clearing.complete date"), value: `${sheet?.complete_date ?? " "}` },
          { title: t("clearing.total price"), value: `${sheet?.clearing_total_price}` },
        ]}
      />

      <Table
        size="small"
        loading={getItemQuery.isLoading}
        pagination={false}
        dataSource={getItemQuery.data?.data.item_list}
        rowKey={(item) => item.id}
        title={() => <TurtleTableTitle count={getItemQuery.data?.data.total_count ?? 0} />}
        columns={[
          {
            ellipsis: true,
            title: t("vendor.name"),
            render: (_, record) => record.vendor_name,
          },
          {
            ellipsis: true,
            title: t("vendor.address"),
            render: (_, record) => record.vendor_address,
          },
          {
            ellipsis: true,
            title: t("vendor.account"),
            render: (_, record) =>
              `${record.bank} ${record.account_number} ${record.account_holder}`,
          },
          {
            ellipsis: true,
            title: t("clearing.supply price"),
            render: (_, record) => record.supply_price.toLocaleString(),
          },
          {
            ellipsis: true,
            title: t("clearing.vat"),
            render: (_, record) => record.vat_price.toLocaleString(),
          },
          {
            ellipsis: true,
            title: t("clearing.price"),
            render: (_, record) => record.deposit_price.toLocaleString(),
          },
        ]}
      />
    </TurtleModal>
  );
}

export default DetailModal;
