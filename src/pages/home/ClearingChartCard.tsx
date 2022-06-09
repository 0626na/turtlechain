import moment from 'moment';
import { useCallback, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useQuery } from 'react-query';
import { Badge, Col, Divider, message, Row, Space, Typography } from 'antd';
import { AxiosError } from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { TurtleCardHome } from '@components/common';
import clearingAPI, { ClearingSheetShow } from '@apis/clearingAPI';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function ClearingChartCard() {
  const [storeList, setStoreList] = useState<string[]>([]);

  const getSheetQuery = useQuery(
    ['getClearingSheet'],
    () =>
      clearingAPI.getSheet({
        start_date: moment().startOf('month').format('YYYY-MM-DD'),
        end_date: moment().endOf('month').format('YYYY-MM-DD'),
        credit_type: 'general',
        status: 'complete',
        page_size: 1000,
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
      mode: 'index' as 'index',
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
        backgroundColor: 'black',
        padding: 10,
        bodySpacing: 5,
        usePointStyle: true,
        callbacks: {
          title: (context: any) =>
            moment().set('date', context[0].label).format('YYYY-MM-DD'),
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawTicks: false,
          tickLength: 1,
          color: '#EDEFF1',
        },
        axis: 'x' as 'x',
      },
      y: {
        grid: {
          display: true,
          drawTicks: false,
          color: '#EDEFF1',
        },
        afterDataLimits: (scale: any) => {
          scale.max = scale.max * 1.1;
        },
        display: true,
      },
    },
  };

  const lineColor = [
    '#6BD4C1',
    '#93A9E3',
    '#84CDEB',
    '#6BD4C1',
    '#93A9E3',
    '#84CDEB',
    '#6BD4C1',
    '#93A9E3',
    '#84CDEB',
  ];

  const pointColor = [
    '#08B798',
    '#5B80DF',
    '#32ACDD',
    '#08B798',
    '#5B80DF',
    '#32ACDD',
    '#08B798',
    '#5B80DF',
    '#32ACDD',
  ];

  const labels = Array.from(
    { length: moment().endOf('month').get('date') },
    (v, i) => i + 1,
  );

  const data = {
    labels,
    datasets: storeList.map((store, index) => ({
      label: store,
      data: labels.map((day) => {
        if (day > parseInt(moment().format('D'))) {
          return;
        }
        return getSheetQuery.data?.data.sheet_list
          .filter(
            ({ complete_date, store_name }) =>
              complete_date ===
                moment()
                  .startOf('month')
                  .add(day - 1, 'day')
                  .format('YYYY-MM-DD') && store_name === store,
          )
          .map(({ total_clearing_amount }) => total_clearing_amount)
          .reduce((cur, acc) => cur + acc, 0);
      }),
      borderColor: lineColor[index],
      borderWidth: 2,
      backgroundColor: lineColor[index],
      pointRadius: 2,
      pointBorderColor: pointColor[index],
      pointBackgroundColor: pointColor[index],
    })),
  };

  return (
    <TurtleCardHome>
      <Row justify="space-between">
        <Col>
          <Space direction="vertical" size={0}>
            <Typography.Title
              style={{ marginBottom: 4, fontWeight: 500, fontSize: 16 }}
            >
              누적 정산금액
            </Typography.Title>
            <Typography.Title style={{ marginBottom: 20, fontSize: 28 }}>
              {getSheetQuery.data?.data.clearing_summary.complete.amount.toLocaleString()}
              <span style={{ fontSize: 20, fontWeight: 500, marginLeft: 4 }}>
                원
              </span>
            </Typography.Title>
          </Space>
        </Col>
        <Col>
          <Space size="middle" align="center" style={{ marginRight: 8 }}>
            {storeList.map((store, index) => (
              <Badge key={store} color={pointColor[index]} text={store} />
            ))}
          </Space>
          <Divider type="vertical" />
          <Typography.Text type="secondary">
            &nbsp;&nbsp;{moment().format('YYYY-MM')}
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
