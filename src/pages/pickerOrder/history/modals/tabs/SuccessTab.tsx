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
  const [selectedRowID, setSelectedRowID] = useState(-1);
  const [visibleMemoModal, openMemoModal, closeMemoModal] = useModal();
  const { translateOrderType } = useOrderCart();

  const getOrderHistoryQuery = useQuery(['getOrderHistory', sheetID], () =>
    orderAPI.getOrderHistory({ sheet_id: sheetID }),
  );

  const updateMemoQuery = useMutation(orderAPI.createOrderItem, {
    onSuccess: () => {
      message.success(t('message.successMemoInput'));
      getOrderHistoryQuery.refetch();
      closeMemoModal();
    },
  });

  const orderHistoryList = useMemo(() => {
    return getOrderHistoryQuery.data?.data.successes.map((item, index) => ({
      ...item,
      id: index,
    }));
  }, [getOrderHistoryQuery.data?.data]);

  return (
    <Tabs.TabPane {...props}>
      <OrderMemoModal
        defaultValue={
          getOrderHistoryQuery.data?.data.successes.find(
            (order) => order.id === selectedRowID,
          )?.memo ?? ''
        }
        visible={visibleMemoModal}
        close={closeMemoModal}
        onOk={(value) => {
          updateMemoQuery.mutate({
            rt_stores: [
              {
                rt_store_id: storeID,
                request_date: requestDate,
                orders:
                  getOrderHistoryQuery.data?.data.successes.map<CreatingOrdersItem>(
                    (order) => ({
                      vendor_name: order.vendor_name,
                      vendor_address: order.address,
                      vendor_mobile: '',
                      mobile: order.mobile,
                      product_name: order.name,
                      product_option: order.option,
                      product_count: order.count,
                      creation_type: order.creation_type,
                      product_price: order.price,
                      order_type: order.type,
                      memo: order.id === selectedRowID ? value : order.memo,
                      ws_store_id: order.ws_store_id,
                    }),
                  ) ?? [],
              },
            ],
          });
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
                setSelectedRowID(Number(record.id));
                console.log(orderHistoryList);
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
