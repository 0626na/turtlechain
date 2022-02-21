import { Card, Col, DatePicker, Row, Space, Table } from "antd";
import { mainAPI } from "apis";
import { RequestGetClearingStatus } from "apis/mainAPI";
import TurtleSelect from "components/common/TurtleSelect";
import { t } from "i18next";
import moment from "moment";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";

function ClearingStatusCard() {
  const [clearingStatus, setClearingStatus] = useState<string>("pending");
  const [searchQuery, setSearchQuery] = useState<RequestGetClearingStatus>({
    start_date: moment().subtract(1, "months").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
  });
  let index = 0;

  const getClearingStatusQuery = useQuery(["getClearingStatus", searchQuery], () =>
    mainAPI.getClearingStatus(searchQuery),
  );

  const statusOptions: Array<{ name: string; value: string }> = [
    {
      name: "전체",
      value: "all",
    },
    {
      name: "완료",
      value: "complete",
    },
    {
      name: "대기",
      value: "pending",
    },
  ];

  const filteredClearingList = useMemo(() => {
    if (clearingStatus === "pending") {
      return getClearingStatusQuery.data?.data.filter((clearing) => clearing.status === "pending");
    }
    if (clearingStatus === "complete") {
      return getClearingStatusQuery.data?.data.filter((clearing) => clearing.status === "complete");
    }
    return getClearingStatusQuery.data?.data;
  }, [getClearingStatusQuery.data, clearingStatus]);

  return (
    <>
      <Card
        style={{ width: "100%", height: "100%" }}
        title={
          <Row justify="space-between">
            <Col>정산처리현황</Col>
            <Col>
              <Space>
                <TurtleSelect
                  width="short"
                  value={clearingStatus}
                  options={statusOptions}
                  onSelect={(value) => {
                    setClearingStatus(value);
                  }}
                />
                <DatePicker.RangePicker
                  value={[moment(searchQuery.start_date), moment(searchQuery.end_date)]}
                  onChange={(_, dateStrings) => {
                    setSearchQuery({ start_date: dateStrings[0], end_date: dateStrings[1] });
                  }}
                />
              </Space>
            </Col>
          </Row>
        }
      >
        <Table
          size="small"
          loading={getClearingStatusQuery.isLoading}
          dataSource={filteredClearingList}
          rowKey={(record) => index++}
          pagination={{ position: ["bottomCenter"], showSizeChanger: false, defaultPageSize: 3 }}
          columns={[
            {
              ellipsis: true,
              title: "정산 요청 날짜",
              render: (_, record) => record.request_date,
            },
            {
              ellipsis: true,
              title: "정산 완료 날짜",
              render: (_, record) => record.complete_date,
            },
            {
              ellipsis: true,
              title: "쇼핑몰 명",
              render: (_, record) => record.rt_store_name,
            },
            {
              ellipsis: true,
              title: "총 거래처 수",
              render: (_, record) => record.vendor_total_count,
            },
            {
              ellipsis: true,
              title: "정산 총 금액",
              render: (_, record) =>
                `${record.total_price}원 ${
                  record.vat_price === 0 ? "" : `(부가세 ${record.vat_price}원 포함)`
                }`,
            },
            {
              ellipsis: true,
              title: "정산 처리 상태",
              render: (_, record) => (record.status === "complete" ? "완료" : "대기"),
            },
          ]}
        />
      </Card>
    </>
  );
}

export default ClearingStatusCard;
