import { TurtleTableTitle } from '@components/element';
import useWarehousingCart from '@hooks/useWarehousingCart';
import { Table, TabPaneProps, Typography } from 'antd';
import { t } from 'i18next';
import Tabs from 'rc-tabs';
import React from 'react';

interface Props extends TabPaneProps {
  loading: boolean;
}

function FailTab({ loading, ...props }: Props) {
  const { cart } = useWarehousingCart();

  return (
    <Tabs.TabPane {...props}>
      <Table
        size="small"
        loading={loading}
        dataSource={cart.failList}
        rowKey={(record) => record.index as number}
        pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
        scroll={{ x: 1400, y: 'auto' }}
        title={() => <TurtleTableTitle totalCount={cart.failList.length} />}
        columns={[
          {
            ellipsis: true,
            width: 150,
            title: t('table.vendorName'),
            render: (_, record) => record.vendor_name,
          },
          {
            ellipsis: true,
            width: 150,
            title: t('table.vendorAddress'),
            render: (_, record) => record.vendor_address,
          },
          {
            ellipsis: true,
            width: 250,
            title: t('table.productName'),
            render: (_, record) => (
              <Typography.Text type="danger">
                {record.product_name}
              </Typography.Text>
            ),
          },
          {
            ellipsis: true,
            width: 200,
            title: t('table.vendorProductName'),
            render: (_, record) => (
              <Typography.Text type="danger">
                {record.vendor_product_name}
              </Typography.Text>
            ),
          },
          {
            ellipsis: true,
            width: 150,
            title: t('table.productCode'),
            render: (_, record) => record.product_code,
          },
          {
            ellipsis: true,
            width: 150,
            title: t('table.option'),
            render: (_, record) => record.product_option,
          },
          {
            ellipsis: true,
            width: 100,
            title: t('table.warehouseName'),
            render: (_, record) => record.store_house,
          },
          {
            ellipsis: true,
            width: 120,
            align: 'right',
            title: t('table.price'),
            render: (_, record) => record.price.toLocaleString(),
          },
          {
            ellipsis: true,
            width: 120,
            align: 'right',
            title: t('table.warehousingCount'),
            render: (_, record) => record.count,
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default FailTab;
