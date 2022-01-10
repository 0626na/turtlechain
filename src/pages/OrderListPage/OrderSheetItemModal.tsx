import { Button, Modal, Table } from "antd";
import SimplePagination from "components/SimplePagination";
import moment from "moment";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

interface Props {
  visible: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const WarehousingSheetItemModal = function ({ visible, openModal, closeModal }: Props) {
  const { t } = useTranslation();

  const testOrderSheet = [
    {
      order_time: new Date(),
      order_sheet_content: "거래처명/매입상품명 등 86개 품목 주문",
      order_sheet_status: "알림톡 1 / sms 1 / 실패 0",
      order_sheet_type: "최초",
      order_count: 3,
      order_sheet_price: 100000,
    },
  ];

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
        size="middle"
        scroll={{ x: "auto", y: 400 }}
        pagination={false}
        //loading={isLoading}
        dataSource={testOrderSheet}
        rowKey={(record) => record.order_sheet_content}
        columns={[
          {
            width: 200,
            align: "center",
            title: t("order.time"),
            dataIndex: "order_time",
            render: (_, record) => moment(record.order_time).format("YYYY-MM-DD hh:mm:ss"),
          },
          {
            align: "center",
            title: t("order.content"),
            dataIndex: "order_sheet_content",
          },
          {
            align: "center",
            title: `${t("order.sheet")} ${t("send status")}`,
            dataIndex: "order_sheet_status",
          },
          {
            width: 100,
            align: "center",
            title: `${t("order.")} ${t("count")}`,
            dataIndex: "order_count",
            render: (_, record) => record.order_count,
          },
          {
            width: 100,
            align: "center",
            title: `${t("order.")} ${t("price")}`,
            dataIndex: "order_sheet_price",
            render: (_, record) => record.order_sheet_price.toLocaleString(),
          },
        ]}
      />

      <Table
        size="small"
        scroll={{ x: 1000, y: 400 }}
        pagination={false}
        //dataSource={list}
        title={() => {
          return <b>주문서 리스트</b>;
        }}
        rowKey={(record) => record.product_code}
        columns={[
          {
            title: t("sequence"),
            dataIndex: "sequence",
          },
          {
            title: t("client name"),
            dataIndex: "store_name",
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

const Footer = styled.div`
  display: flex;
  justify-content: center;
`;

const FormTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default WarehousingSheetItemModal;
