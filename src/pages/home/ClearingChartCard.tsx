import { Card, Col, DatePicker, message, Row, Space, Typography } from "antd";
import { clearingAPI } from "apis";
import { AxiosError } from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import moment from "moment";
import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { useQuery } from "react-query";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ClearingChartCard() {
  const getSheetQuery = useQuery(
    ["getClearingSheet"],
    () =>
      clearingAPI.getSheet({
        start_date: moment().subtract(1, "months").format("YYYY-MM-DD"),
        end_date: moment().format("YYYY-MM-DD"),
        status: "complete",
      }),
    {
      onError: (err: AxiosError) => {
        message.warn(err.response?.data.msg);
      },
      onSuccess: (data) => {
        console.log(data.data);
      },
    },
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    element: {
      point: "star",
    },
  };

  const labels = Array.from({ length: moment().endOf("month").get("date") }, (v, i) => i + 1);

  const data = {
    labels,
    datasets: [
      {
        label: "test1",
        data: labels.map((data) => data * 100),
        borderColor: "#13BC9E",
        backgroundColor: "white",
      },
    ],
  };

  return (
    <Col span={18}>
      <Card bordered={false} style={{ borderRadius: 8 }}>
        <Row justify="space-between">
          <Col>
            <Typography.Title level={4}>누적 정산수</Typography.Title>
          </Col>
          <Col>
            <Typography.Text type="secondary">최근 1개월</Typography.Text>
          </Col>
        </Row>
        <Row>
          <Line options={options} data={data} />
        </Row>
      </Card>
    </Col>
  );
}

export default ClearingChartCard;
