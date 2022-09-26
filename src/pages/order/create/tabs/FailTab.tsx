import { StoreOrderItemExcelParsing } from '@apis/orderAPI';
import { TurtleTableTitle } from '@components/element';
import useOrderCart from '@hooks/useOrderCart';
import { Table, TabPaneProps, Tabs } from 'antd';
import { useState } from 'react';

interface Props extends TabPaneProps {
  loading: boolean;
}

function FailTab({ loading, ...props }: Props) {
  const { cart } = useOrderCart();
  const [selectedRowOrder, setSelectedRowOrder] =
    useState<StoreOrderItemExcelParsing>();

  return (
    <Tabs.TabPane {...props}>
      <Table
        scroll={{ x: 1400, y: 'auto', scrollToFirstRowOnChange: true }}
        loading={loading}
        size="small"
        rowKey={(record) => record.rt_store_id}
        dataSource={cart.failList}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
        title={() => (
          <TurtleTableTitle totalCount={cart.failList.length ?? 0} />
        )}
        columns={[
          {
            title: '쇼핑몰',
            width: 180,
            render: (_, record) => record.rt_store_name,
          },
          {
            title: '거래처',
            width: 200,
            render: (_, record) =>
              `${record.orders[0].vendor_name} 외 ${
                record.orders.length - 1
              }개`,
          },
          {
            title: '상품',
          },
          {
            title: '수량 합계',
          },
          {
            title: '공급가 합계',
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default FailTab;
