import moment from 'moment';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ClearingSheetShow } from '@apis/clearingAPI';
import { theme } from '@styles/theme';
import { css } from '@emotion/react';
import { t } from 'i18next';
import React from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const chartOption = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: theme.grey400,
      },
    } as const,
    y: {
      grid: {
        drawTicks: false,
      },
      ticks: {
        color: theme.grey400,
      },
    } as const,
  },
  layout: {
    padding: {
      top: 40,
    },
  },
};

const labels = [1, 2, 3, 4, 5].map((day) => t(`type.day.${day}`));
const thisWeek = [
  moment().startOf('week').add(1, 'day'),
  moment().startOf('week').add(2, 'day'),
  moment().startOf('week').add(3, 'day'),
  moment().startOf('week').add(4, 'day'),
  moment().startOf('week').add(5, 'day'),
];

const lastWeek = [
  moment().startOf('week').subtract(1, 'weeks').add(1, 'day'),
  moment().startOf('week').subtract(1, 'weeks').add(2, 'day'),
  moment().startOf('week').subtract(1, 'weeks').add(3, 'day'),
  moment().startOf('week').subtract(1, 'weeks').add(4, 'day'),
  moment().startOf('week').subtract(1, 'weeks').add(5, 'day'),
];

interface Props {
  completedClearingSheetList: ClearingSheetShow[];
}

function ClearingChartCard({ completedClearingSheetList }: Props) {
  const thisWeekData = thisWeek.map((day) =>
    completedClearingSheetList
      ?.filter((sheet) => sheet.complete_date === day.format('YYYY-MM-DD'))
      .map((sheet) => sheet.total_clearing_amount)
      .reduce((acc, cur) => acc + cur, 0),
  );

  const lastWeekData = lastWeek.map((day) =>
    completedClearingSheetList
      ?.filter((sheet) => sheet.complete_date === day.format('YYYY-MM-DD'))
      .map((sheet) => sheet.total_deposit_amount)
      .reduce((acc, cur) => acc + cur, 0),
  );

  const chartData = {
    labels,
    datasets: [
      {
        data: lastWeekData,
        backgroundColor: '#EAECEF',
        barThickness: 12,
        borderRadius: 4,
      },

      {
        data: thisWeekData,
        backgroundColor: '#13BCB2',
        barThickness: 12,
        borderRadius: 4,
      },
    ],
  };

  const totalThisWeekData = thisWeekData.reduce((acc, cur) => acc + cur, 0);

  return (
    <>
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <h4
          css={{
            display: 'inline',
            color: theme.grey500,
            fontSize: 18,
            fontWeight: 500,
          }}
        >
          {t('accumulated payments')}
        </h4>

        <div
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            flexBasis: 122,
          }}
        >
          <div css={markCss.self}>
            <div
              css={markCss.status}
              style={{
                ['--backgroundColor' as string]: '#EAECEF',
              }}
            />
            <span>{t('last week')}</span>
          </div>

          <div css={markCss.self}>
            <div
              css={markCss.status}
              style={{
                ['--backgroundColor' as string]: '#13BCB2',
              }}
            />
            <span>{t('this week')}</span>
          </div>
        </div>
      </div>
      <h1 css={{ marginTop: 12 }}>
        <span css={{ fontSize: 28, fontWeight: 700, color: theme.grey800 }}>
          {totalThisWeekData.toLocaleString()}
        </span>
        <span
          css={{
            fontSize: 18,
            fontWeight: 500,
            color: theme.grey800,
          }}
        >
          {t('description.won')}
        </span>
      </h1>

      <Bar options={chartOption} data={chartData} height={200} />
    </>
  );
}

const markCss = {
  self: css({
    fontWeight: 400,
    fontSize: 14,
    color: theme.grey600,
    display: 'flex',
    alignItems: 'center',
  }),

  status: css({
    display: 'inline-block',
    marginRight: 7,
    width: 8,
    height: 8,
    backgroundColor: 'var(--backgroundColor)',
    borderRadius: '50%',
  }),
};

export default ClearingChartCard;
