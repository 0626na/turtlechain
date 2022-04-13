import { Card, Col, DatePicker, Row, Space, Typography } from "antd";
import mainAPI, { RequestGetClearingStatistic } from "apis/mainAPI";
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
  const [searchQuery, setSearchQuery] = useState<RequestGetClearingStatistic>({
    start_date: moment().startOf("week").format("YYYY-MM-DD"),
    end_date: moment().endOf("week").format("YYYY-MM-DD"),
  });

  const getClearingStatisticQuery = useQuery(
    ["getClearingStatistic", searchQuery],
    () => mainAPI.getClearingStatistic(searchQuery),
    {
      onSuccess: () => {},
    },
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  const labels = useMemo(() => {
    const returnArr = [];
    for (let i = 0; i < 7; i++) {
      returnArr.push(moment(searchQuery.start_date).add(i, "d").format("MM-DD"));
    }
    return returnArr;
  }, [searchQuery.start_date]);

  const borderColors = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
  ];
  const backgroundColors = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 206, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(255, 159, 64, 0.2)",
  ];

  const data = useMemo(
    () => ({
      labels,
      datasets: getClearingStatisticQuery.data?.data.store_list.map((store, i) => {
        return {
          label: store.rt_store_name,
          data: labels.map((label) => {
            let price = 0;
            store.daily_list.forEach((daily) => {
              if (daily.complete_date.includes(label)) {
                price = daily.total_price;
              }
            });
            return price;
          }),
          borderColor: borderColors[i % 6],
          backgroundColor: backgroundColors[i % 6],
        };
      }) ?? [{ label: "no data", data: [] }],
    }),
    [getClearingStatisticQuery.data?.data.store_list],
  );

  const customWeekStartEndFormat = (value: any) =>
    `${moment(value).startOf("week").format(weekFormat)} ~ ${moment(value)
      .endOf("week")
      .format(weekFormat)}`;

  const weekFormat = "MM/DD";

  return (
    <Card
      bordered={false}
      title={
        <Row justify="space-between">
          <Col>누적 정산</Col>
          <Col>
            <Space>
              <DatePicker
                defaultValue={moment()}
                onChange={(date) => {
                  setSearchQuery({
                    start_date: moment(date).startOf("week").format("YYYY-MM-DD"),
                    end_date: moment(date).endOf("week").format("YYYY-MM-DD"),
                  });
                }}
                format={customWeekStartEndFormat}
                picker="week"
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
        <Col span={12}>
          <Space direction="vertical">
            <Typography.Text>정산금액</Typography.Text>
            <Typography.Title>
              {getClearingStatisticQuery.data?.data.company_total_price.toLocaleString()}원
            </Typography.Title>
          </Space>
        </Col>
      </Row>
    </Card>
  );
}

export default ClearingChartCard;
