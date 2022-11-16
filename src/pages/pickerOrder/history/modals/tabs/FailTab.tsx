import { OrderHistoryItem } from '@apis/orderAPI';
import { TurtleTableTitle } from '@components/element';
import { Table, TabPaneProps, Tabs } from 'antd';
import { t } from 'i18next';
import React from 'react';

interface Props extends TabPaneProps {
  data: OrderHistoryItem[];
  loading: boolean;
}

function FailTab({ data, loading, ...props }: Props) {
  return (
    <Tabs.TabPane {...props}>
      <Table
        size="small"
        rowKey={(record) => String(record.id)}
        loading={loading}
        dataSource={data}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
        title={() => <TurtleTableTitle totalCount={data.length ?? 0} />}
        columns={[
          {
            title: t('order.history.clientName'),
            width: 188,
            render: (_, record) => record.vendor_name,
          },
          {
            title: t('order.history.clientAddress'),
            width: 196,
            render: (_, record) => record.address,
          },
          {
            title: t('order.history.mobile'),
            width: 176,
            render: (_, record) => record.mobile,
          },
          {
            title: t('order.history.productName'),
            width: 196,
            render: (_, record) => record.name,
          },
          {
            title: t('order.history.option'),
            width: 136,
            render: (_, record) => record.option,
          },
          {
            title: t('order.history.class'),
            width: 116,
            render: (_, record) => record.type,
          },
          {
            title: t('order.history.count'),
            align: 'right',
            width: 116,
            render: (_, record) => record.count.toLocaleString(),
          },
          {
            title: t('order.history.price'),
            align: 'right',
            width: 116,
            render: (_, record) => record.price.toLocaleString(),
          },
          {
            title: t('order.history.memo'),
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default FailTab;
