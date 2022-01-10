import styled from "styled-components";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Table, Tag, Button, Popconfirm, Row } from "antd";
import SimplePagination from "components/SimplePagination";
import TurtleText from "components/common/TurtleText";
import TurtleButton from "components/common/TurtleButton";

interface Props {
  openOrderDetail: () => void;
}

const OrderSheetList = function ({ openOrderDetail }: Props) {
  const { t } = useTranslation();

  const testOrderSheet = {
    order_time: new Date(),
    order_content: "주문00 / 미송0 / 반품0 / 교환0 / 샘플0 / 픽업0 / 기타0",
    order_sheet_status: "알림톡 1 / sms 1 / 실패 0",
    order_status: "최초",
  };

  const list = [];
  for (let i = 0; i < 20; i++) {
    list.push(testOrderSheet);
  }

  return (
    <Row>
      <TurtleText>{`${t("order.")} ${t("list")}`}</TurtleText>
      <Table
        size="small"
        scroll={{ x: "auto", y: 500 }}
        pagination={false}
        //loading={isLoading}
        dataSource={list}
        rowKey={(record) => record.order_content}
        columns={[
          {
            width: 100,
            align: "center",
            title: t("order.status"),
            dataIndex: "order_status",
          },
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
            dataIndex: "order_content",
          },
          {
            width: 200,
            align: "center",
            title: `${t("order.sheet")} ${t("send status")}`,
            dataIndex: "order_sheet_status",
          },
          {
            width: 150,
            align: "center",
            title: `${t("order.sheet")} ${t("resend")}`,
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
            width: 150,
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
                  <TurtleButton size="small" color="mint" onClick={openOrderDetail}>
                    {t("view details")}
                  </TurtleButton>
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
