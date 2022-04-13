import { Card, Col, message, Row, Table, Tag, Typography } from "antd";
import { clearingAPI } from "apis";
import { AxiosError } from "axios";
import moment from "moment";
import { useQuery } from "react-query";
import { t } from "i18next";

function ClearingStatusCard() {
  const getSheetQuery = useQuery(
    ["getClearingSheet"],
    () =>
      clearingAPI.getSheet({
        start_date: moment().subtract(1, "months").format("YYYY-MM-DD"),
        end_date: moment().format("YYYY-MM-DD"),
        status: "all",
      }),
    {
      onError: (err: AxiosError) => {
        message.warn(err.response?.data.msg);
      },
    },
  );

  return (
    <>
      <Row>
        <Card style={{ width: "100%", height: "100%", borderRadius: 12 }} bordered={false}>
          <Table
            size="small"
            loading={getSheetQuery.isLoading}
            dataSource={getSheetQuery.data?.data.sheet_list}
            rowKey={(record) => record.id}
            pagination={{ position: ["bottomCenter"], showSizeChanger: false, defaultPageSize: 3 }}
            title={() => (
              <Row justify="space-between">
                <Col>
                  <Typography.Title level={4}>정산처리 현황</Typography.Title>
                </Col>
                <Col>
                  <Typography.Text type="secondary">최근 1개월</Typography.Text>
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
        </Card>
      </Row>
    </>
  );
}

export default ClearingStatusCard;
