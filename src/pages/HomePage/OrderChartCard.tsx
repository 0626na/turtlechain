import { Card, Col, DatePicker, Row, Space, Typography } from "antd";
import { RequestGetOrderStatistic } from "apis/mainAPI";
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
import { useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function OrderChartCard() {
  const [searchQuery, setSearchQuery] = useState<RequestGetOrderStatistic>({
    start_date: moment().subtract(1, "months").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
  });
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "chartArea" as const,
      },
    },
  };

  const labels = ["January", "February", "March", "April", "May", "June", "July"];

  const data = {
    labels,
    datasets: [
      {
        label: "쇼핑몰 A",
        data: labels.map(() => 1000),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "쇼핑몰 B",
        data: labels.map(() => 1100),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <Card
      title={
        <Row justify="space-between">
          <Col>누적 주문</Col>
          <Col>
            <Space>
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
      <Row gutter={26}>
        <Col span={12}>
          <Line options={options} data={data} />
        </Col>
        <Col span={6}>
          <Space direction="vertical">
            <Typography.Text>주문건수</Typography.Text>
            <Typography.Title>999,999건</Typography.Title>
          </Space>
        </Col>
        <Col span={6}>
          <Space direction="vertical">
            <Typography.Text>주문금액</Typography.Text>
            <Typography.Title>999,999,999원</Typography.Title>
          </Space>
        </Col>
      </Row>
    </Card>
  );
}

export default OrderChartCard;
