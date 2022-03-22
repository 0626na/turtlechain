import { message, Pagination, Row, Table } from "antd";
import { adjustmentAPI } from "apis";
import { AdjustmentProductShow } from "apis/adjustmentAPI";
import { AxiosError } from "axios";
import TurtleModal from "components/common/TurtleModal";
import TurtleText from "components/common/TurtleText";
import { t } from "i18next";
import { useQuery } from "react-query";

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow?: AdjustmentProductShow;
}

function AdjustmentDetailModal({ visible, closeModal, selectedRow }: Props) {
  // 매입조정 상세내역 요청
  const getDetailQuery = useQuery(
    ["getAdjustmentDetail"],
    () => adjustmentAPI.get({ id: selectedRow?.id! }),
    {
      enabled: visible && !!selectedRow,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {},
    },
  );

  return (
    <TurtleModal
      centered
      width="90%"
      title={t("adjustment.detail")}
      visible={visible}
      onCancel={closeModal}
      footer={false}
    >
      <Row style={{ marginBottom: 16 }}>
        <TurtleText>{t("adjustment.list")}</TurtleText>
      </Row>

      <Table
        size="small"
        loading={getDetailQuery.isLoading}
        dataSource={selectedRow && [selectedRow]}
        rowKey={(record) => record.id}
        pagination={false}
        columns={[
          {
            ellipsis: true,
            align: "center",
            width: 120,
            title: t("adjustment date"),
            render: (_, record) => record.created_date,
          },
          {
            ellipsis: true,
            title: t("vendor.name"),
            render: (_, record) => record.vendor_info.vendor_name,
          },
          {
            ellipsis: true,
            title: t("product.name"),
            render: (_, record) => record.product_info.name,
          },
          {
            ellipsis: true,
            title: t("product.vendor product name"),
            render: (_, record) => record.product_info.vendor_product_name,
          },
          {
            ellipsis: true,
            title: t("adjustment.is vat included"),
            render: (_, record) => (record.is_vat_included ? "포함" : "미포함"),
          },
          {
            ellipsis: true,
            title: t("product.price"),
            render: (_, record) => record.price.toLocaleString(),
          },
          {
            ellipsis: true,
            title: t("adjustment.count all"),
            render: (_, record) => `${record.count - record.count_left} / ${record.count}`,
          },
          {
            ellipsis: true,
            title: t("adjustment.type."),
            render: (_, record) => t(`adjustment.type.${record.type}`),
          },
        ]}
      />

      <Row style={{ margin: "32px 0 16px 0" }}>
        <TurtleText>{t("adjustment.clearing list")}</TurtleText>
      </Row>

      <Table
        size="small"
        loading={getDetailQuery.isLoading}
        dataSource={
          getDetailQuery.data?.data.clearing_info && getDetailQuery.data?.data.clearing_info
        }
        rowKey={(record) => record.id}
        pagination={false}
        columns={[
          {
            ellipsis: true,
            align: "center",
            width: 120,
            title: t("adjustment.clearing date"),
            render: (_, record) => record.created_date,
          },
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
            title: t("adjustment.total price"),
            render: (_, record) => record.total_price.toLocaleString(),
          },
          {
            ellipsis: true,
            title: t("adjustment.supply price"),
            render: (_, record) => record.supply_price.toLocaleString(),
          },
          {
            ellipsis: true,
            title: t("adjustment.vat price"),
            render: (_, record) => record.vat_price.toLocaleString(),
          },
          {
            ellipsis: true,
            title: t("adjustment.is vat included"),
            render: (_, record) => (record.is_vat_included ? "포함" : "미포함"),
          },
          {
            ellipsis: true,
            title: t("adjustment.type."),
            render: (_, record) => t(`adjustment.type.${record.adjustment_type}`),
          },
          {
            ellipsis: true,
            title: t("adjustment.process type."),
            render: (_, record) => t(`adjustment.process type.${record.adjustment_process_type}`),
          },
        ]}
      />

      <Row style={{ margin: "32px 0 16px 0" }}>
        <TurtleText>{t("adjustment.warehousing list")}</TurtleText>
      </Row>

      <Table
        size="small"
        loading={getDetailQuery.isLoading}
        pagination={false}
        dataSource={
          getDetailQuery.data?.data.warehousing_info.id
            ? [getDetailQuery.data?.data.warehousing_info]
            : []
        }
        rowKey={(product) => product.id}
        columns={[
          {
            ellipsis: true,
            title: t("vendor.name"),
            render: (_, record) => record.vendor_info.vendor_name,
          },
          {
            ellipsis: true,
            title: t("product.name"),
            render: (_, record) => record.product_info.name,
          },
          {
            ellipsis: true,
            title: t("product.vendor product name"),
            render: (_, record) => record.product_info.vendor_product_name,
          },
          {
            ellipsis: true,
            title: t("product.option"),
            render: (_, record) => record.product_info.option,
          },
          {
            ellipsis: true,
            title: t("warehousing.count"),
            render: (_, record) => record.count,
          },
          {
            ellipsis: true,
            title: t("product.price"),
            render: (_, record) => record.price,
          },
        ]}
      />
    </TurtleModal>
  );
}

export default AdjustmentDetailModal;
