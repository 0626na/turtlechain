import React from 'react';
import orderAPI from '@apis/orderAPI';
import { TurtleContentModal } from '@components/combine';
import TurtleStatistics from '@components/element/TurtleStatistics';
import moment from 'moment';
import { useQuery } from 'react-query';
import { TurtleTabs } from '@components/element';
import SuccessTab from './tabs/SuccessTab';
import FailTab from './tabs/FailTab';
import { t } from 'i18next';

interface Props {
  visible: boolean;
  onclose: () => void;
  sheetId: number;
}

function DetailModal({ visible, onclose, sheetId }: Props) {
  const getOrderHistoryCountQuery = useQuery(
    ['getOrderHistoryCount', sheetId],
    () => orderAPI.getOrderHistory({ sheet_id: sheetId }),
  );

  return (
    <>
      <TurtleContentModal
        title={t('order.history.detailModalTitle')}
        size="large"
        onClose={onclose}
        visible={visible}
      >
        <TurtleStatistics
          value={[
            {
              title: t('order.history.store'),
              value:
                getOrderHistoryCountQuery.data?.data.order_sheet
                  .rt_store_name ?? '',
            },
            {
              title: t('order.history.date'),
              value:
                moment(
                  getOrderHistoryCountQuery.data?.data.order_sheet.request_date,
                ).format('YYYY-MM-DD') ?? '',
            },
            {
              title: t('order.history.orderClient'),
              value: `${
                getOrderHistoryCountQuery.data?.data.order_sheet.total_store_count.toString() ??
                '0'
              }개`,
            },
            {
              title: t('order.totalCount'),
              value: t('order.count', {
                count:
                  getOrderHistoryCountQuery.data?.data.order_sheet
                    .total_item_subcount ?? 0,
              }),
            },
            {
              title: t('order.totalPrice'),
              value: t('order.price', {
                price:
                  getOrderHistoryCountQuery.data?.data.order_sheet.total_success_price.toLocaleString() ??
                  '0',
              }),
            },
          ]}
        />
        <TurtleTabs>
          <SuccessTab
            sheetID={sheetId}
            storeID={Number(
              getOrderHistoryCountQuery.data?.data.order_sheet.rt_store_id,
            )}
            requestDate={String(
              getOrderHistoryCountQuery.data?.data.order_sheet.request_date,
            )}
            key={'successHistory'}
            tab={`${t('order.history.success')}(${
              getOrderHistoryCountQuery.data?.data.successes.length ?? 0
            })`}
            loading={getOrderHistoryCountQuery.isLoading}
          />
          <FailTab
            key={'failHistory'}
            tab={`${t('order.history.fail')}(${
              getOrderHistoryCountQuery.data?.data.fails.length ?? 0
            })`}
            data={
              getOrderHistoryCountQuery.data?.data.fails.map((item, index) => ({
                ...item,
                id: index,
              })) ?? []
            }
            loading={getOrderHistoryCountQuery.isLoading}
          />
        </TurtleTabs>
      </TurtleContentModal>
    </>
  );
}

export default DetailModal;
