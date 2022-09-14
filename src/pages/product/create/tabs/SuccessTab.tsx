import React from 'react';
import { MemoIcon, TurtleIcon, TurtleTableTitle } from '@components/element';
import TurtleInputPrice from '@components/element/input/TurtlePriceInput';
import useProductCart from '@hooks/useProductCart';
import { Table, TabPaneProps, Tabs, Tooltip, Typography } from 'antd';
import { t } from 'i18next';
import NeedUpdatePopover from '../popovers/NeedUpdatePopover';

interface Props extends TabPaneProps {
  loading: boolean;
}
function SuccessTab({ loading, ...props }: Props) {
  const { cart, updatePrice, deleteProduct } = useProductCart();

  const needUpdateStyle = (needUpdate: boolean) => ({
    style: {
      backgroundColor: needUpdate ? '#F2F2F3' : 'transparent',
    },
  });

  return (
    <Tabs.TabPane {...props}>
      <Table
        size="small"
        loading={loading}
        dataSource={cart.successList}
        rowKey={(record) => record.product_code}
        pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
        scroll={{ x: 1400, y: 'auto' }}
        title={() => <TurtleTableTitle totalCount={cart.successList.length} />}
        columns={[
          {
            ellipsis: true,
            width: 150,
            title: t('table.vendorName'),
            onCell: (record) => needUpdateStyle(record.need_update),
            render: (_, record) => record.vendor_name,
          },
          {
            ellipsis: true,
            width: 150,
            title: t('table.vendorAddress'),
            onCell: (record) => needUpdateStyle(record.need_update),
            render: (_, record) => record.vendor_address,
          },
          {
            ellipsis: true,
            width: 250,
            title: (
              <NeedUpdatePopover>{t('table.productName')}</NeedUpdatePopover>
            ),
            onCell: (record) => needUpdateStyle(record.need_update),
            render: (_, record) => record.name,
          },
          {
            ellipsis: true,
            width: 250,
            title: t('table.vendorProductName'),
            onCell: (record) => needUpdateStyle(record.need_update),
            render: (_, record) => record.vendor_product_name,
          },
          {
            ellipsis: true,
            width: 150,
            title: t('table.productCode'),
            onCell: (record) => needUpdateStyle(record.need_update),
            render: (_, record) => record.product_code,
          },
          {
            ellipsis: true,
            width: 200,
            title: t('table.option'),
            onCell: (record) => needUpdateStyle(record.need_update),
            render: (_, record) => record.option,
          },
          {
            ellipsis: true,
            align: 'right',
            width: 120,
            title: t('table.price'),
            onCell: (record) => needUpdateStyle(record.need_update),
            render: (_, record) => (
              <TurtleInputPrice
                size="small"
                value={record.price}
                onChange={(value) => {
                  updatePrice(record, Number(value));
                }}
              />
            ),
          },
          {
            ellipsis: true,
            title: t('table.imageUrl'),
            width: 200,
            onCell: (record) => needUpdateStyle(record.need_update),
            render: (_, record) => (
              <Typography.Link href={record.image_url} target="_blank">
                {record.image_url}
              </Typography.Link>
            ),
          },
          {
            ellipsis: true,
            width: 50,
            title: t('table.memo'),
            onCell: (record) => needUpdateStyle(record.need_update),
            render: (_, record) => (
              <Tooltip title={record.memo}>
                <div>
                  <MemoIcon value={record.memo} />
                </div>
              </Tooltip>
            ),
          },
          {
            ellipsis: true,
            width: 50,
            onCell: (record) => needUpdateStyle(record.need_update),
            render: (_, record) => (
              <TurtleIcon
                name="delete"
                onClick={() => {
                  deleteProduct(record);
                }}
              />
            ),
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default SuccessTab;
