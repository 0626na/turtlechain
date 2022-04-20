import { Badge, Col, Divider, message, Row, Space, Typography } from "antd";
import { clearingAPI } from "apis";
import { ClearingSheetShow } from "apis/clearingAPI";
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
import { useCallback, useState } from "react";
import { Line } from "react-chartjs-2";
import { useQuery } from "react-query";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ClearingChartCard() {
  const [storeList, setStoreList] = useState<string[]>([]);

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
        findStore(data.data.sheet_list);
      },
    },
  );

  const findStore = useCallback((sheet_list: ClearingSheetShow[]) => {
    const set = new Set<string>();
    sheet_list.forEach((sheet) => {
      set.add(sheet.store_name);
    });
    setStoreList(Array.from(set));
  }, []);

  const options = {
    grouped: true,
    interaction: {
      mode: "index" as "index",
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
        labels: {
          usePointStyle: true,
          padding: 10,
          font: {
            // 범례의 폰트 스타일도 지정할 수 있습니다.
            family: "'Noto Sans KR', 'serif'",
            lineHeight: 1,
          },
          display: true,
        },
      },
      tooltip: {
        backgroundColor: "black",
        padding: 10,
        bodySpacing: 5,
        usePointStyle: true,
        callbacks: {
          title: (context: any) => moment().set("date", context[0].label).format("YYYY-MM-DD"),
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawTicks: false,
          tickLength: 1,
          color: "#EDEFF1",
        },
        axis: "x" as "x",
      },
      y: {
        grid: {
          display: true,
          drawTicks: false,
          color: "#EDEFF1",
        },
        afterDataLimits: (scale: any) => {
          scale.max = scale.max * 1.1;
        },
        display: true,
      },
    },
  };

  const colors = ["#13BC9E", "#139EBC", "#4B70D0"];

  const labels = Array.from({ length: moment().endOf("month").get("date") }, (v, i) => i + 1);

  const data = {
    labels,
    datasets: storeList.map((store, index) => ({
      label: store,
      data: labels.map((day) => {
        if (day >= parseInt(moment().format("D"))) {
          return;
        }
        return getSheetQuery.data?.data.sheet_list
          .filter(
            ({ complete_date, store_name }) =>
              complete_date ===
                moment()
                  .startOf("month")
                  .add(day - 1, "day")
                  .format("YYYY-MM-DD") && store_name === store,
          )
          .map(({ clearing_total_price }) => clearing_total_price)
          .reduce((cur, acc) => cur + acc, 0);
      }),
      borderColor: colors[index],
      borderWidth: 2,
      backgroundColor: colors[index],
      pointRadius: 2,
    })),
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
          <Space size="middle" align="center" style={{ marginRight: 20 }}>
            {storeList.map((store, index) => (
              <Badge key={store} color={colors[index]} text={store} />
            ))}
          </Space>
          <Divider type="vertical" />
          <Typography.Text type="secondary">
            &nbsp;&nbsp;&nbsp;&nbsp;{moment().format("MM")}월
          </Typography.Text>
        </Col>
      </Row>
      <Row>
        <Line options={options} data={data} height={60} />
      </Row>
    </TurtleCardHome>
  );
}

export default ClearingChartCard;
