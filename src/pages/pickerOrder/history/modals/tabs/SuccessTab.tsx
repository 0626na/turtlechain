import React, { useMemo, useState } from 'react';
import orderAPI, { CreatingOrdersItem, OrderHistoryItem } from '@apis/orderAPI';
import { MemoIcon, TurtleTableTitle } from '@components/element';
import { Table, TabPaneProps, Tabs } from 'antd';
import OrderMemoModal from '@components/combine/modal/OrderMemoModal';
import useOrderCart from '@hooks/useOrderCart';
import useModal from '@hooks/useModal';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { message } from '@utils/message';
import { t } from 'i18next';

interface Props extends TabPaneProps {
  requestDate: string;
  storeID: number;
  sheetID: number;
  loading: boolean;
}

function SuccessTab({
  storeID,
  sheetID,
  requestDate,

  ...props
}: Props) {
  const [orderID, setOrderID] = useState(-1);
  const [visibleMemoModal, openMemoModal, closeMemoModal] = useModal();
  const { translateOrderType } = useOrderCart();

  const getOrderHistoryQuery = useQuery(['getOrderHistory', sheetID], () =>
    orderAPI.getOrderHistory({ sheet_id: sheetID }),
  );

  const updateMemoQuery = useMutation(orderAPI.updateOrderHistoryMemo, {
    onSuccess: () => {
      message.success(t('message.successMemoInput'));
      getOrderHistoryQuery.refetch();
      closeMemoModal();
    },
  });

  const orderHistoryList = getOrderHistoryQuery.data?.data.successes;

  return (
    <Tabs.TabPane {...props}>
      <OrderMemoModal
        defaultValue={
          getOrderHistoryQuery.data?.data.successes.find(
            (order) => order.id === orderID,
          )?.memo ?? ''
        }
        visible={visibleMemoModal}
        close={closeMemoModal}
        onOk={(value) => {
          updateMemoQuery.mutate({ memo: value, id: orderID });
        }}
      />
      <Table
        size="small"
        loading={getOrderHistoryQuery.isLoading}
        rowKey={(record) => String(record.id)}
        dataSource={orderHistoryList ?? []}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
        title={() => (
          <TurtleTableTitle
            totalCount={getOrderHistoryQuery.data?.data.successes.length ?? 0}
          />
        )}
        columns={[
          {
            title: t('table.vendorName'),
            width: 188,
            render: (_, record) => record.vendor_name,
          },
          {
            title: t('table.vendorAddress'),
            width: 196,
            render: (_, record) => record.address,
          },
          {
            title: t('table.mobile'),
            width: 176,
            render: (_, record) => record.mobile,
          },
          {
            title: t('table.vendorProductName'),
            width: 196,
            render: (_, record) => record.name,
          },
          {
            title: t('table.option'),
            width: 136,
            render: (_, record) => record.option,
          },
          {
            title: t('table.type'),
            width: 116,
            render: (_, record) => translateOrderType(record.type),
          },
          {
            title: t('table.requestCount'),
            align: 'right',
            width: 116,
            render: (_, record) => record.count.toLocaleString(),
          },
          {
            title: t('table.supplyPrice'),
            align: 'right',
            width: 116,
            render: (_, record) => record.price.toLocaleString(),
          },
          {
            title: t('table.memo'),
            align: 'center',
            onCell: (record) => ({
              style: { cursor: 'pointer' },
              onClick: (e) => {
                setOrderID(Number(record.id));
                openMemoModal();
              },
            }),
            render: (_, record) => <MemoIcon value={record.memo ?? ''} />,
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default SuccessTab;
