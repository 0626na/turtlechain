import { OrderHistoryItem } from '@apis/orderAPI';
import { TurtleSearchInput, TurtleTableTitle } from '@components/element';
import { Table, TabPaneProps, Tabs } from 'antd';
import { t } from 'i18next';
import React, { useMemo, useState } from 'react';

interface Props extends TabPaneProps {
  data: OrderHistoryItem[];
  loading: boolean;
}

function FailTab({ data, loading, ...props }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredList = useMemo(
    () =>
      data.filter(
        (store) =>
          store.vendor_name.includes(searchQuery) ||
          store.address.includes(searchQuery) ||
          store.mobile.includes(searchQuery) ||
          store.name.includes(searchQuery),
      ),

    [data, searchQuery],
  );

  return (
    <Tabs.TabPane {...props}>
      <Table
        size="small"
        rowKey={(record) => String(record.id)}
        loading={loading}
        dataSource={filteredList}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
        title={() => (
          <TurtleTableTitle
            totalCount={data.length ?? 0}
            rightContent={
              <TurtleSearchInput
                placeholder={t('please input search query')}
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
