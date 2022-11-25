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
            title: t('table.productName'),
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
            render: (_, record) => record.type,
          },
          {
            title: t('table.count'),
            align: 'right',
            width: 116,
            render: (_, record) => record.count.toLocaleString(),
          },
          {
            title: t('table.price'),
            align: 'right',
            width: 116,
            render: (_, record) => record.price.toLocaleString(),
          },
          {
            title: t('table.memo'),
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default FailTab;
