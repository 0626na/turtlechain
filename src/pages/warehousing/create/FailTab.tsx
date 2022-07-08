import { t } from 'i18next';
import { useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { Table, TabPaneProps, Tabs, Typography } from 'antd';
import { warehousingCartState } from '@store/warehousingCartState';

interface Props extends TabPaneProps {
  loading: boolean;
}

function FailTab({ loading, ...props }: Props) {
  const cart = useRecoilValue(warehousingCartState);
  const failIndex = useRef(0);

  return (
    <Tabs.TabPane {...props}>
      <Table
        size="small"
        loading={loading}
        dataSource={cart.failList}
        rowKey={() => failIndex.current++}
        pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
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
              <Typography.Text type="danger">
                {record.product_name}
              </Typography.Text>
            ),
          },
          {
            ellipsis: true,
            title: t('product.vendor product name'),
            render: (_, record) => (
              <Typography.Text type="danger">
                {record.vendor_product_name}
              </Typography.Text>
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
            render: (_, record) => record.product_option,
          },
          {
            ellipsis: true,
            title: '창고명',
            render: (_, record) => record.store_house,
          },
          {
            ellipsis: true,
            align: 'right',
            title: t('product.price'),
            render: (_, record) => record.price.toLocaleString(),
          },
          {
            ellipsis: true,
            title: t('warehousing.count'),
            render: (_, record) => record.count,
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default FailTab;
