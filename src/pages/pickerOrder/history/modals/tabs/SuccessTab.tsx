import React, { useMemo, useState } from 'react';
import orderAPI, { OrderHistoryItem } from '@apis/orderAPI';
import {
  MemoIcon,
  TurtleSearchInput,
  TurtleTableTitle,
} from '@components/element';
import { Table, TabPaneProps, Tabs } from 'antd';
import OrderMemoModal from '@components/combine/modal/OrderMemoModal';
import useOrderCart from '@hooks/useOrderCart';
import useModal from '@hooks/useModal';
import { useMutation, useQuery } from 'react-query';
import { message } from '@utils/message';
import { t } from 'i18next';

import { phonePattern } from '@utils/pattern';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [orderHistoryList, setOrderHistoryList] = useState<OrderHistoryItem[]>(
    [],
  );
  const { translateOrderType } = useOrderCart();

  /**
   * 발주내역 react-query
   */
  const {
    data: orderHistorySuccessData,
    refetch,
    isLoading,
  } = useQuery(
    ['getOrderHistory', sheetID],
    () => orderAPI.getOrderHistory({ sheet_id: sheetID }),
    {
      onSuccess: (data) => {
        setOrderHistoryList(data.data.successes);
      },
    },
  );

  /**
   * 발주내역 메모 mutation
   */
  const { mutate } = useMutation(orderAPI.updateOrderHistoryMemo, {
    onSuccess: () => {
      message.success(t('message.successMemoInput'));
      refetch();
      closeMemoModal();
    },
  });

  const filteredList = useMemo(
    () =>
      orderHistoryList.filter(
        (store) =>
          store.vendor_name.includes(searchQuery) ||
          store.address.includes(searchQuery) ||
          store.mobile.includes(searchQuery) ||
          store.name.includes(searchQuery),
      ),

    [orderHistoryList, searchQuery],
  );

  return (
    <Tabs.TabPane {...props}>
      <OrderMemoModal
        defaultValue={
          orderHistorySuccessData?.data.successes.find(
            (order) => order.id === orderID,
          )?.memo ?? ''
        }
        visible={visibleMemoModal}
        close={closeMemoModal}
        onOk={(value) => {
          mutate({ memo: value, id: orderID });
        }}
      />
      <Table
        size="small"
        loading={isLoading}
        rowKey={(record) => String(record.id)}
        dataSource={filteredList ?? []}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
        title={() => (
          <TurtleTableTitle
            totalCount={orderHistorySuccessData?.data.successes.length ?? 0}
            rightContent={
              <TurtleSearchInput
                placeholder={t(
                  'placeholder.search by vendor name, product name, mobile',
                )}
                value={searchQuery}
                onChange={(value) => setSearchQuery(value.currentTarget.value)}
              />
            }
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
            render: (_, record) =>
              record.mobile.replace(phonePattern, '$1-$2-$3'),
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
