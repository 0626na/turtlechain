import { t } from 'i18next';
import { Table, TabPaneProps, Tabs, Tooltip, Typography } from 'antd';
import { MemoIcon, TurtleTableTitle } from '@components/element';
import useProductCart from '@hooks/useProductCart';

interface Props extends TabPaneProps {
  loading: boolean;
}

function FailTab({ loading, ...props }: Props) {
  const { cart } = useProductCart();

  return (
    <Tabs.TabPane {...props}>
      <Table
        size="small"
        pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
        dataSource={cart.failList}
        rowKey={(record) => record.product_code}
        scroll={{ x: 950, y: 'auto' }}
        columns={[
          {
            ellipsis: true,
            title: t('table.vendorName'),
            render: (_, record) => record.vendor_name,
          },
          {
            ellipsis: true,
            title: t('table.vendorAddress'),
            render: (_, record) => record.vendor_address,
          },
          {
            ellipsis: true,
            title: t('table.productName'),
            render: (_, record) => (
              <span style={{ color: 'red' }}>{record.name}</span>
            ),
          },
          {
            ellipsis: true,
            title: t('table.vendorProductName'),
            render: (_, record) => (
              <span style={{ color: 'red' }}>{record.vendor_product_name}</span>
            ),
          },
          {
            ellipsis: true,
            title: t('table.productCode'),
            render: (_, record) => record.product_code,
          },
          {
            ellipsis: true,
            title: t('table.option'),
            render: (_, record) => record.option,
          },
          {
            ellipsis: true,
            title: t('table.imageUrl'),
            render: (_, record) => (
              <Typography.Link href={record.image_url} target="_blank">
                {record.image_url}
              </Typography.Link>
            ),
          },
          {
            ellipsis: true,
            align: 'right',
            title: t('table.price'),
            render: (_, record) => record.price.toLocaleString(),
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default FailTab;
