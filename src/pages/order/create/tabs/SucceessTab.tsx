import { StoreOrder, StoreOrderItemExcelParsing } from '@apis/orderAPI';
import { TurtleTableTitle } from '@components/element';
import useOrderCart from '@hooks/useOrderCart';
import { Table, TabPaneProps, Tabs } from 'antd';
import { useState } from 'react';

interface Props extends TabPaneProps {
  loading: boolean;
}

function SuccessTab({ loading, ...props }: Props) {
  const { cart } = useOrderCart();
  const [selectedRowOrder, setSelectedRowOrder] =
    useState<StoreOrderItemExcelParsing>();
  return (
    <Tabs.TabPane {...props}>
      <Table
        scroll={{ x: 1400, y: 'auto', scrollToFirstRowOnChange: true }}
        dataSource={cart.successList}
        loading={loading}
        size="small"
        rowKey={(record) => record.rt_store_id}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
        title={() => (
          <TurtleTableTitle totalCount={cart.successList.length ?? 0} />
        )}
        expandable={{
          expandRowByClick: true,
          expandedRowKeys: [selectedRowOrder?.rt_store_id ?? -1],
          onExpand: (onExpand, record) => {
            if (!onExpand) {
              setSelectedRowOrder(undefined);
              return;
            }
            setSelectedRowOrder({
              rt_store_id: record.rt_store_id,
              rt_store_name: record.rt_store_name,
              orders: record.orders.map<StoreOrder>((order, index) => {
                return {
                  ...order,
                  order_id: index,
                };
              }),
            });
          },
          expandedRowRender: () => (
            <Table
              size="small"
              scroll={{ x: 'auto', y: 400, scrollToFirstRowOnChange: true }}
              dataSource={selectedRowOrder?.orders}
              rowKey={(record) => record.order_id}
              loading={selectedRowOrder === undefined}
              pagination={false}
              columns={[
                {
                  title: '거래처명',
                  render: (_, record) => record.vendor_name,
                },
                {
                  title: '거래처 주소',
                  width: 200,
                  render: (_, record) => record.vendor_address,
                },
                {
                  title: '휴대전화번호',
                  width: 200,
                  render: (_, record) =>
                    record.vendor_mobile === ''
                      ? record.ws_store_info[0].mobiles[0].phone
                      : record.vendor_mobile,
                },
                {
                  title: '거래처 상품명',
                  render: (_, record) => record.product_name,
                },
                {
                  title: '옵션',
                  render: (_, record) => record.product_option,
                },
                {
                  title: '분류',
                  width: 100,
                  render: (_, record) => record.order_type,
                },
                {
                  title: '수량',
                  width: 100,
                  render: (_, record) => record.product_count,
                },
                {
                  title: '공급가',
                  width: 100,
                  render: (_, record) =>
                    Number(record.product_price).toLocaleString(),
                },
              ]}
            />
          ),
        }}
        columns={[
          {
            title: '쇼핑몰',
            width: 180,
            render: (_, record) => record.rt_store_name,
          },
          {
            title: '거래처',
            render: (_, record) =>
              `${record.orders[0].vendor_name} 외 ${
                record.orders.length - 1
              }개`,
          },
          {
            title: '상품',
            render: (_, record) =>
              `${record.orders[0].product_name} 외 ${
                record.orders.length - 1
              }건`,
          },
          {
            title: '수량 합계',
            width: 140,
            render: (_, record) =>
              record.orders.reduce(
                (acc, order) => acc + Number(order.product_count),
                0,
              ),
          },
          {
            title: '공급가 합계',
            width: 140,
            render: (_, record) =>
              record.orders
                .reduce((acc, order) => acc + Number(order.product_price), 0)
                .toLocaleString(),
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default SuccessTab;
