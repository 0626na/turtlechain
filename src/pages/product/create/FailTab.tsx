import { t } from 'i18next';
import { Table, TabPaneProps, Tabs } from 'antd';
import { useRecoilValue } from 'recoil';
import { productCartState } from '@store/productCartState';

interface Props extends TabPaneProps {
  loading: boolean;
}

function FailTab({ loading, ...props }: Props) {
  const cart = useRecoilValue(productCartState);

  return (
    <Tabs.TabPane {...props}>
      <Table
        size="small"
        loading={loading}
        pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
        dataSource={cart.failList}
        rowKey={(record) => record.product_code}
        scroll={{ y: 'auto' }}
        columns={[
          {
            ellipsis: true,
            title: t('vendor.name'),
            render: (_, record) => record.vendor_name,
          },
          {
            ellipsis: true,
            title: t('vendor.address'),
            render: (_, record) => record.vendor_address,
          },
          {
            ellipsis: true,
            title: t('product.name'),
            render: (_, record) => (
              <span style={{ color: 'red' }}>{record.name}</span>
            ),
          },
          {
            ellipsis: true,
            title: t('product.vendor product name'),
            render: (_, record) => (
              <span style={{ color: 'red' }}>{record.vendor_product_name}</span>
            ),
          },
          {
            ellipsis: true,
            title: t('product.code'),
            render: (_, record) => record.product_code,
          },
          {
            ellipsis: true,
            title: t('product.option'),
            render: (_, record) => record.option,
          },
          {
            ellipsis: true,
            title: t('product.supply price'),
            render: (_, record) => record.supply_price.toLocaleString(),
          },
          {
            ellipsis: true,
            title: t('product.vat price'),
            render: (_, record) => record.vat_price.toLocaleString(),
          },
          {
            ellipsis: true,
            title: t('product.image url'),
            render: (_, record) => record.image_url,
          },
          {
            ellipsis: true,
            title: t('product.memo'),
            render: (_, record) => record.memo,
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default FailTab;
