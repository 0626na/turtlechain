import { t } from 'i18next';
import { Table, TabPaneProps, Tabs, Tooltip, Typography } from 'antd';
import { MemoIcon, TurtleIcon, TurtleTableTitle } from '@components/element';
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
              <span style={{ color: 'red' }}>{record.name}</span>
            ),
          },
          {
            ellipsis: true,
            width: 250,
            title: t('table.vendorProductName'),
            render: (_, record) => (
              <span style={{ color: 'red' }}>{record.vendor_product_name}</span>
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
            width: 200,
            title: t('table.option'),
            render: (_, record) => record.option,
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
            width: 200,
            title: t('table.imageUrl'),
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
            render: (_, record) => (
              <Tooltip title={record.memo}>
                <MemoIcon value={record.memo} />
              </Tooltip>
            ),
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default FailTab;
