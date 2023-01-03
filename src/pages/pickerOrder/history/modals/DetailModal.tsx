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

/**
 * 발주 상세내역 모달
 * @param visible 발주 표시 유무 boolean
 * @param onclose 모달 닫을때 이벤트 함수
 * @param sheetId 보고자 하는 발주내역 ID
 */
function DetailModal({ visible, onclose, sheetId }: Props) {
  const { data: orderHistoryData, isLoading } = useQuery(
    ['getOrderHistoryCount', sheetId],
    () => orderAPI.getOrderHistory({ sheet_id: sheetId }),
  );

  const storeName = orderHistoryData?.data.order_sheet.rt_store_name ?? '';
  const orderDate =
    moment(orderHistoryData?.data.order_sheet.request_date).format(
      'YYYY-MM-DD',
    ) ?? '';
  const vendorCount = orderHistoryData?.data.order_sheet.total_store_count ?? 0;
  const orderTotalCount =
    orderHistoryData?.data.order_sheet.total_item_subcount ?? 0;
  const orderTotalPrice =
    orderHistoryData?.data.order_sheet.total_success_price ?? 0;

  return (
    <>
      <TurtleContentModal
        title={t('look orderDetail')}
        size="large"
        onClose={onclose}
        visible={visible}
      >
        <TurtleStatistics
          value={[
            {
              title: t('table.retailerStoreName'),
              value: storeName,
            },
            {
              title: t('table.orderDate'),
              value: orderDate,
            },
            {
              title: t('table.clientCount'),
              value: t('count', {
                count: Number(vendorCount.toLocaleString()),
              }),
            },
            {
              title: t('table.totalCount'),
              value: t('count', {
                count: Number(orderTotalCount.toLocaleString()),
              }),
            },
            {
              title: t('table.totalPrice'),
              value: t('price', {
                price: Number(orderTotalPrice).toLocaleString(),
              }),
            },
          ]}
        />
        <TurtleTabs>
          <SuccessTab
            sheetID={sheetId}
            storeID={Number(orderHistoryData?.data.order_sheet.rt_store_id)}
            requestDate={String(
              orderHistoryData?.data.order_sheet.request_date,
            )}
            key={'successHistory'}
            tab={`${t('success')}(${
              orderHistoryData?.data.successes.length ?? 0
            })`}
            loading={isLoading}
          />
          <FailTab
            key={'failHistory'}
            tab={`${t('fail')}(${orderHistoryData?.data.fails.length ?? 0})`}
            data={
              orderHistoryData?.data.fails.map((item, index) => ({
                ...item,
                id: index,
              })) ?? []
            }
            loading={isLoading}
          />
        </TurtleTabs>
      </TurtleContentModal>
    </>
  );
}

export default DetailModal;
