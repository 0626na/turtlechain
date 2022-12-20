import React from 'react';
import moment from 'moment';
import { useQuery } from 'react-query';
import adjustmentAPI from '@apis/adjustmentAPI';
import { theme } from '@styles/theme';
import { ArrowRightIcon, TurtleTag } from '@components/element';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';

function AdjustmentStatusCard() {
  const navigate = useNavigate();
  // 매입조정 리스트 요청
  const getAdjustmentListQuery = useQuery(['getAdjustmentListQuery'], () =>
    adjustmentAPI.getList({
      is_cleared: '',
      start_date: moment().startOf('month').format('YYYY-MM-DD'),
      end_date: moment().endOf('month').format('YYYY-MM-DD'),
      rt_store_id: null,
    }),
  );

  const goAdjustment = () => {
    navigate('/warehousing/adjustment');
  };

  const pending = {
    count:
      getAdjustmentListQuery.data?.data.adjustment_summary?.not_cleared.count,
    price:
      getAdjustmentListQuery.data?.data.adjustment_summary?.not_cleared.price ??
      0,
  };

  const completed = {
    count:
      getAdjustmentListQuery.data?.data.adjustment_summary?.cleared.count ?? 0,
    price:
      getAdjustmentListQuery.data?.data.adjustment_summary?.cleared.price ?? 0,
  };

  return (
    <div
      css={{ cursor: 'pointer', height: 335 }}
      onClick={() => {
        goAdjustment();
      }}
    >
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: 66,
        }}
      >
        <h4 css={{ fontWeight: 500, color: theme.grey500 }}>
          {t('title.adjustment')}
        </h4>
        <div>
          <ArrowRightIcon value={theme.grey300} />
        </div>
      </div>

      <div css={{ display: 'flex', gap: 64, justifyContent: 'center' }}>
        {(
          [
            {
              color: 'orange',
              title: t('pndg'),
              count: pending.count,
              price: pending.price,
            },
            {
              color: 'skyblue',
              title: t('cmplt'),
              count: completed.count,
              price: completed.price,
            },
          ] as const
        ).map(({ color, title, count, price }, index) => (
          <div
            key={index}
            css={{
              flexBasis: '150px',
              height: 160,
              textAlign: 'center',
            }}
          >
            <TurtleTag color={color}>{title}</TurtleTag>
            <div
              css={{
                fontWeight: 700,
                color: theme.grey800,
                fontSize: 36,
                marginTop: 24,
              }}
            >
              {count}
            </div>
            <div
              css={{
                color: theme.grey400,
                fontWeight: 400,
                fontSize: 16,
                marginTop: 16,
              }}
            >
              {price.toLocaleString()}
              {t('description.won')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdjustmentStatusCard;
