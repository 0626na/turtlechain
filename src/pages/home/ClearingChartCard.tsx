import { Col, message, Row, Space, Typography } from "antd";
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
import { TurtleCardHome } from "components/common";
import moment from "moment";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { useQuery } from "react-query";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ClearingChartCard() {
  const [storeList, setStoreList] = useState([]);

  const getSheetQuery = useQuery(
    ["getClearingSheet"],
    () =>
      clearingAPI.getSheet({
        start_date: moment().startOf("month").format("YYYY-MM-DD"),
        end_date: moment().endOf("month").format("YYYY-MM-DD"),
        status: "complete",
      }),
    {
      onError: (err: AxiosError) => {
        message.warn(err.response?.data.msg);
      },
      onSuccess: (data) => {
        console.log(data.data);
        const set = new Set();
        data.data.sheet_list.forEach((sheet) => {
          set.add(sheet.store_name);
        });
        // setStoreList();
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
  };

  const labels = Array.from({ length: moment().endOf("month").get("date") }, (v, i) => i + 1);

  const data = {
    labels,
    datasets: [
      {
        label: "test1",
        data: labels.map((data) => Math.random() * 1000),
        borderColor: "#13BC9E",
        backgroundColor: "white",
        pointRadius: 0,
      },
    ],
  };

  return (
    <TurtleCardHome>
      <Row justify="space-between">
        <Col>
          <Space direction="vertical" size={0}>
            <Typography.Title level={5}>누적 정산금액</Typography.Title>
            <Typography.Title level={2}>
              {getSheetQuery.data?.data.clearing_summary.complete.price.toLocaleString()} 원
            </Typography.Title>
          </Space>
        </Col>
        <Col>
          <Typography.Text type="secondary">{moment().format("MM")} 월</Typography.Text>
        </Col>
      </Row>
      <Row>{/* <Line options={options} data={data} /> */}</Row>
    </TurtleCardHome>
  );
}

export default ClearingChartCard;
