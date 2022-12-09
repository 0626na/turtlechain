import { PageHeader } from '@layout/page';

import React from 'react';
import ClearingChartCard from './ClearingChartCard';
import { theme } from '@styles/theme';
import clearingAPI from '@apis/clearingAPI';
import { useQuery } from 'react-query';
import moment from 'moment';
import { css } from '@emotion/react';
import ProgressBar from './ProgressBar';
import AdjustmentStatusCard from './AdjustmentStatusCard';

import ClearingStatusCard from './ClearingStatusCard';
import AnnouncementCard from './AnnouncementCard';
import { t } from 'i18next';

function PageBody() {
  // 정산서 리스트 요청
  const getClearingSheetQuery = useQuery(['getClearingSheetQuery'], () =>
    clearingAPI.getSheet({
      credit_type: 'general',
      start_date: moment().startOf('month').format('YYYY-MM-DD'),
      end_date: moment().endOf('month').format('YYYY-MM-DD'),
      status: 'all',
      page_size: 1000,
    }),
  );

  const clearingSheetList = getClearingSheetQuery.data?.data.sheet_list ?? [];
  const completedClearingSheetList =
    clearingSheetList?.filter((sheet) => sheet.status === 'complete') ?? [];
  const totalDepositAmount = completedClearingSheetList // 세금계산서 발행금액
    .map((sheet) => sheet.total_deposit_amount)
    .reduce((acc, cur) => acc + cur, 0);

  const thisMonth = moment().format('M');
  return (
    <>
      <PageHeader title="" />

      <div css={pageContent}>
        {/* upper */}
        <div
          css={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <h3 css={{ fontSize: 20, color: theme.grey600 }}>
            {t('tax invoice to be issued', { month: thisMonth })}
          </h3>

          <h1 css={{ marginTop: 14 }}>
            <span css={{ fontSize: 40, fontWeight: 700, color: theme.grey800 }}>
              {totalDepositAmount?.toLocaleString()}
            </span>
            <span
              css={{
                fontSize: 24,
                fontWeight: 700,
                color: theme.grey800,
              }}
            >
              {t('description.won')}
            </span>
          </h1>

          <ProgressBar />
        </div>

        {/* under */}
        <div
          css={{
            marginTop: 100,
            height: 440,
            display: 'flex',
            gap: 24,
          }}
        >
          <div css={cardLayout}>
            <ClearingChartCard
              completedClearingSheetList={completedClearingSheetList}
            />
          </div>

          <div css={cardLayout}>
            <ClearingStatusCard clearingSheetList={clearingSheetList} />
          </div>

          <div css={container}>
            <a
              target="_blank"
              href="https://turtlechain-guide.oopy.io/18a4f13e-e989-475b-97aa-84600c75b822"
              css={announcementCardLayout}
            >
              <AnnouncementCard />
            </a>
            <div css={adjustmentStatusCardLayout}>
              <AdjustmentStatusCard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const pageContent = css({
  padding: '0px 60px 20px 60px',
  flexGrow: 1,
});

const cardLayout = css({
  flex: 1,
  boxShadow: '0px 8px 20px rgba(41, 77, 119, 0.14)',
  padding: '36px 36px 52px 36px',
  borderRadius: 16,
});

const container = css({
  flex: 1,
  gap: 20,
  display: 'flex',
  flexDirection: 'column',
});

const announcementCardLayout = css({
  padding: '30px 36px 30px 36px',
  height: 80,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: 16,
  boxShadow: '0px 8px 20px rgba(41, 77, 119, 0.14)',
});

const adjustmentStatusCardLayout = css({
  padding: '36px 36px 52px 36px',
  height: 335,
  borderRadius: 16,
  boxShadow: '0px 8px 20px rgba(41, 77, 119, 0.14)',
});
export default PageBody;
