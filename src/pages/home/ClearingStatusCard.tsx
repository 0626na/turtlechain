import { Col, message, Row, Table, Tag, Typography } from "antd";
import { clearingAPI } from "apis";
import { AxiosError } from "axios";
import moment from "moment";
import { useQuery } from "react-query";
import { t } from "i18next";
import { TurtleCardHome } from "components/common";

function ClearingStatusCard() {
  const getSheetQuery = useQuery(
    ["getClearingSheet"],
    () =>
      clearingAPI.getSheet({
        start_date: moment().startOf("month").format("YYYY-MM-DD"),
        end_date: moment().endOf("month").format("YYYY-MM-DD"),
        status: "all",
        page_size: 1000,
      }),
    {
      onError: (err: AxiosError) => {
        message.warn(err.response?.data.msg);
      },
    },
  );

  return (
    <TurtleCardHome>
      <Table
        size="small"
        loading={getSheetQuery.isLoading}
        dataSource={getSheetQuery.data?.data.sheet_list}
        rowKey={(record) => record.id}
        pagination={{ position: ["bottomRight"], showSizeChanger: false, defaultPageSize: 3 }}
        title={() => (
          <Row justify="space-between">
            <Col>
              <Typography.Title level={5}>정산처리 현황</Typography.Title>
            </Col>
            <Col>
              <Typography.Text type="secondary">{moment().format("MM")}월</Typography.Text>
            </Col>
          </Row>
        )}
        columns={[
          {
            ellipsis: true,
            width: 100,
            align: "center",
            title: t("clearing.status.default"),
            render: (_, record) => {
              const { status } = record;
              const color =
                status === "request" ? "green" : status === "pending" ? "orange" : "geekblue";
              const text = t(`clearing.status.${status}`);
              return <Tag color={color}>{text}</Tag>;
            },
          },
          {
            ellipsis: true,
            title: t("clearing.request date"),
            render: (_, record) => record.request_date,
          },
          {
            ellipsis: true,
            title: t("clearing.complete date"),
            render: (_, record) => record.complete_date,
          },
          {
            ellipsis: true,
            title: t("store.name"),
            render: (_, record) => record.store_name,
          },
          {
            ellipsis: true,
            title: t("clearing.total price"),
            render: (_, record) => `${record.clearing_total_price.toLocaleString()}원`,
          },
        ]}
      />
    </TurtleCardHome>
  );
}

export default ClearingStatusCard;
