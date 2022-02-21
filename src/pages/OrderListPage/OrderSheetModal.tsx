import { Button, Input, Modal, Row, Table } from "antd";
import { t } from "i18next";
import { useQuery } from "react-query";
import { orderAPI } from "apis";

interface Props {
  visible: boolean;
  closeModal: () => void;
  sheetId?: number;
}

const OrderSheetItemModal = function ({ visible, closeModal, sheetId }: Props) {
  const getOrderQuery = useQuery(
    "getOrder",
    () => orderAPI.get({ order_sheet_id: sheetId ?? -1 }),
    {
      enabled: !!sheetId,
    },
  );

  const getOrderItemQuery = useQuery(
    "getOrderItem",
    () => orderAPI.getItem({ sheet_id: sheetId ?? -1 }),
    {
      enabled: !!sheetId,
    },
  );

  return (
    <Modal
      centered
      width="90%"
      maskClosable={false}
      title={t("order.detail")}
      visible={visible}
      onOk={closeModal}
      onCancel={closeModal}
    >
      <Table // 상단 주문서 정보 테이블
        size="small"
        scroll={{ x: "auto", y: 400 }}
        pagination={false}
        loading={getOrderQuery.isLoading}
        dataSource={[{ ...getOrderQuery.data?.data }]}
        rowKey={(record) => 1}
        columns={[
          {
            ellipsis: true,
            title: "주문 날짜",
            render: (_, record) => record.created_date,
          },
          {
            ellipsis: true,
            title: "총 거래처 수",
            render: (_, record) => 125,
          },
          {
            ellipsis: true,
            title: "총 상품 수",
            render: () => 240,
          },
          {
            ellipsis: true,
            title: "총 주문 공급가액",
            render: () => "8,000,000",
          },
        ]}
      />

      <Table
        size="small"
        scroll={{ x: 1000, y: 400 }}
        pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
        dataSource={getOrderItemQuery.data?.data.order_item_list}
        rowKey={(record) => record.id}
        columns={[
          {
            ellipsis: true,
            title: "거래처명",
            render: (_, record) => record.product_info.vendor_info.vendor_name,
          },
          {
            ellipsis: true,
            title: "거래처 주소",
            dataIndex: "",
          },
          {
            title: t("client address"),
            dataIndex: "address",
          },
          {
            title: t("phone"),
            dataIndex: "phone",
          },
          {
            title: t("product name"),
            dataIndex: "product_name",
          },
          {
            title: t("option"),
            dataIndex: "option",
          },
          {
            title: t("order.count"),
            dataIndex: "order_count",
          },
          {
            title: t("supply price"),
            dataIndex: "price",
          },
          {
            title: t("order.type"),
            dataIndex: "order_type",
          },
          {
            title: t("memo"),
            dataIndex: "memo",
          },
          {
            width: 100,
            align: "center",
            title: "",
            dataIndex: "action",
            render: (_, record) => (
              <Button //
                danger
                size="small"
                shape="round"
                type="primary"
                //icon={<DeleteFilled />}
                onClick={() => {}}
              >
                {t("delete")}
              </Button>
            ),
          },
        ]}
      />
    </Modal>
  );
};

export default OrderSheetItemModal;
