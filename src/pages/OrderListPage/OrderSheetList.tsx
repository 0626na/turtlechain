import styled from "styled-components";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Sheet } from "apis/warehousingAPI";
import { DeleteFilled, CheckOutlined } from "@ant-design/icons";
import { Table, Tag, Button, Popconfirm, Row } from "antd";
import SimplePagination from "components/SimplePagination";
import TurtleText from "components/common/TurtleText";

interface Props {
  openOrderDetail: () => void;
}

const OrderSheetList = function ({ openOrderDetail }: Props) {
  const { t } = useTranslation();

  const testList = [
    {
      order_time: new Date(),
      order_content: "거래처명/매입상품명 등 86개 품목 주문",
      order_sheet_status: "알림톡 1 / sms 1 / 실패 0",
      order_sheet_type: "최초",
    },
    {
      order_time: new Date(),
      order_content: "거래처명/매입상품명 등 86개 품목 주문",
      order_sheet_status: "알림톡 1 / sms 1 / 실패 0",
      order_sheet_type: "최초",
    },
    {
      order_time: new Date(),
      order_content: "거래처명/매입상품명 등 86개 품목 주문",
      order_sheet_status: "알림톡 1 / sms 1 / 실패 0",
      order_sheet_type: "최초",
    },
    {
      order_time: new Date(),
      order_content: "거래처명/매입상품명 등 86개 품목 주문",
      order_sheet_status: "알림톡 1 / sms 1 / 실패 0",
      order_sheet_type: "최초",
    },
    {
      order_time: new Date(),
      order_content: "거래처명/매입상품명 등 86개 품목 주문",
      order_sheet_status: "알림톡 1 / sms 1 / 실패 0",
      order_sheet_type: "최초",
    },
    {
      order_time: new Date(),
      order_content: "거래처명/매입상품명 등 86개 품목 주문",
      order_sheet_status: "알림톡 1 / sms 1 / 실패 0",
      order_sheet_type: "최초",
    },
    {
      order_time: new Date(),
      order_content: "거래처명/매입상품명 등 86개 품목 주문",
      order_sheet_status: "알림톡 1 / sms 1 / 실패 0",
      order_sheet_type: "최초",
    },
  ];

  return (
    <Row>
      <TurtleText>{`${t("order")} ${t("list")}`}</TurtleText>
      <Table
        size="small"
        scroll={{ x: "auto", y: 400 }}
        pagination={false}
        //loading={isLoading}
        dataSource={testList}
        rowKey={(record) => record.order_content}
        columns={[
          {
            width: 200,
            align: "center",
            title: t("order time"),
            dataIndex: "order_time",
            render: (_, record) => moment(record.order_time).format("YYYY-MM-DD hh:mm:ss"),
          },
          {
            align: "center",
            title: t("order content"),
            dataIndex: "order_content",
          },
          {
            width: 170,
            align: "center",
            title: `${t("order sheet")} ${t("send status")}`,
            dataIndex: "order_sheet_status",
          },
          {
            width: 100,
            align: "center",
            title: `${t("order sheet")} ${t("type")}`,
            dataIndex: "order_sheet_type",
          },
          {
            width: 100,
            align: "center",
            title: `${t("order sheet")} ${t("resend")}`,
            dataIndex: "order_sheet_resend",
            render: (_, record) => {
              return (
                <Popconfirm
                  title={t("description.really resend")}
                  okText={t("yes")}
                  cancelText={t("no")}
                  onConfirm={() => {}}
                >
                  <Button danger type="primary" size="small" shape="round">
                    {t("resend")}
                  </Button>
                </Popconfirm>
              );
            },
          },
          {
            width: 100,
            align: "center",
            title: t("view details"),
            dataIndex: "action",
            render: (_, record) => {
              return (
                <ActionContainer
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Button //
                    size="small"
                    shape="round"
                    onClick={openOrderDetail}
                  >
                    {t("view details")}
                  </Button>
                </ActionContainer>
              );
            },
          },
        ]}
        footer={() => (
          <Row justify="center">
            <SimplePagination />
          </Row>
        )}
      />
    </Row>
  );
};

const ActionContainer = styled.div`
  & > * + * {
    margin-left: 10px;
  }
`;

export default OrderSheetList;
