import React from 'react';
import orderAPI from '@apis/orderAPI';
import { TurtleContentModal } from '@components/combine';
import TurtleStatistics from '@components/element/TurtleStatistics';
import moment from 'moment';
import { useQuery } from 'react-query';
import { TurtleTabs } from '@components/element';
import SuccessTab from './tabs/SuccessTab';
import FailTab from './tabs/FailTab';

interface Props {
  visible: boolean;
  onclose: () => void;
  sheetId: number;
}

function DetailModal({ visible, onclose, sheetId }: Props) {
  const getOrderHistoryQuery = useQuery(
    ['getOrderHistory', sheetId],
    () => orderAPI.getOrderHistory({ sheet_id: sheetId }),
    {
      enabled: sheetId !== 0,
    },
  );

  return (
    <>
      <TurtleContentModal
        title="발주내역 상세보기"
        size="large"
        onClose={onclose}
        visible={visible}
      >
        <TurtleStatistics
          value={[
            {
              title: '쇼핑몰',
              value:
                getOrderHistoryQuery.data?.data.order_sheet.rt_store_name ?? '',
            },
            {
              title: '발주 일자',
              value:
                moment(
                  getOrderHistoryQuery.data?.data.order_sheet.created_time,
                ).format('YYYY-MM-DD') ?? '',
            },
            {
              title: '발주 거래처',
              value:
                `${getOrderHistoryQuery.data?.data.order_sheet.total_store_count.toString()}개` ??
                '0개',
            },
            {
              title: '발주수량 합계',
              value:
                `${getOrderHistoryQuery.data?.data.order_sheet.total_item_subcount.toString()}개` ??
                '0개',
            },
            {
              title: '발주금액 합계',
              value:
                `${getOrderHistoryQuery.data?.data.order_sheet.total_success_price.toLocaleString()}원` ??
                '0원',
            },
          ]}
        />
        <TurtleTabs>
          <SuccessTab
            key={'successHistory'}
            tab={`성공(${getOrderHistoryQuery.data?.data.successes.length})`}
            data={getOrderHistoryQuery.data?.data.successes ?? []}
            loading={getOrderHistoryQuery.isLoading}
          />
          <FailTab
            key={'failHistory'}
            tab={`실패(${getOrderHistoryQuery.data?.data.fails.length})`}
            data={getOrderHistoryQuery.data?.data.fails ?? []}
            loading={getOrderHistoryQuery.isLoading}
          />
        </TurtleTabs>
      </TurtleContentModal>
    </>
  );
}

export default DetailModal;
