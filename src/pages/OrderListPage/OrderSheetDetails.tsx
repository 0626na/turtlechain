import { Button, Popconfirm, Table } from "antd";
import SimplePagination from "components/SimplePagination";
import moment from "moment";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

interface Props {
  onClose: () => void;
}

const OrderSheetDetails = function ({ onClose }: Props) {
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
    <>
      <Table
        size="small"
        scroll={{ x: "auto", y: 400 }}
        pagination={false}
        //loading={isLoading}
        dataSource={testOrderSheet}
        rowKey={(record) => record.order_sheet_content}
        columns={[
          {
            width: 200,
            align: "center",
            title: t("order time"),
            dataIndex: "order_time",
            render: (_, record) =>
              moment(record.order_time).format("YYYY-MM-DD hh:mm:ss"),
          },
          {
            align: "center",
            title: t("order content"),
            dataIndex: "order_sheet_content",
          },
          {
            align: "center",
            title: `${t("order sheet")} ${t("send status")}`,
            dataIndex: "order_sheet_status",
          },
          {
            width: 100,
            align: "center",
            title: `${t("order")} ${t("count")}`,
            dataIndex: "order_count",
            render: (_, record) => record.order_count + " 건",
          },
          {
            width: 100,
            align: "center",
            title: `${t("order")} ${t("price")}`,
            dataIndex: "order_sheet_price",
            render: (_, record) =>
              record.order_sheet_price.toLocaleString() + " 원",
          },
        ]}
        title={() => {
          return (
            <FormTitleContainer>
              <b>{`${t("order")} ${t("info")}`}</b>
              <Button // 주문 리스트로 돌아가는 Button
                type="primary"
                onClick={onClose}
              >
                {t("go list")}
              </Button>
            </FormTitleContainer>
          );
        }}
        footer={() => (
          <Footer>
            <SimplePagination />
          </Footer>
        )}
      />
    </>
  );
};

const Footer = styled.div`
  display: flex;
  justify-content: center;
`;

const ActionContainer = styled.div`
  & > * + * {
    margin-left: 10px;
  }
`;

const FormTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default OrderSheetDetails;
