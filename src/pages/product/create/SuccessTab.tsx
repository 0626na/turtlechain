import { t } from 'i18next';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { Table, TabPaneProps, Tabs, Typography } from 'antd';
import {
  TurtleIcon,
  TurtleInputPrice,
  TurtleTableTitle,
} from '@components/common';
import { productCartState } from '@store/productCartState';

interface Props extends TabPaneProps {
  loading: boolean;
}

function SuccessTab({ loading, ...props }: Props) {
  const [cart, setCart] = useRecoilState(productCartState);

  // 상품 삭제
  const deleteItem = useCallback(
    (code) => {
      setCart((cart) => ({
        ...cart,
        successList: cart.successList?.filter(
          (product) => product.product_code !== code,
        ),
      }));
    },
    [setCart],
  );

  // 장바구니의 successList 를 수정한다.
  const updateSuccessList = useCallback(
    (type: string, code, value) => {
      setCart((cart) => ({
        ...cart,
        successList: cart.successList.map((product) =>
          product.product_code === code
            ? {
                ...product,
                [type]: value,
              }
            : product,
        ),
      }));
    },
    [setCart],
  );

  return (
    <Tabs.TabPane {...props}>
      <Table
        size="small"
        loading={loading}
        dataSource={cart.successList}
        rowKey={(record) => record.product_code}
        pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
        scroll={{ x: 1400, y: 'auto' }}
        style={{ height: cart.successList.length <= 5 ? '45vh' : '' }}
        title={() => <TurtleTableTitle count={cart.successList.length} />}
        columns={[
          {
            ellipsis: true,
            width: 150,
            title: t('vendor.name'),
            render: (_, record) => record.vendor_name,
          },
          {
            ellipsis: true,
            width: 150,
            title: t('vendor.address'),
            render: (_, record) => record.vendor_address,
          },
          {
            ellipsis: true,
            width: 250,
            title: t('product.name'),
            render: (_, record) => record.name,
          },
          {
            ellipsis: true,
            width: 200,
            title: t('product.vendor product name'),
            render: (_, record) => record.vendor_product_name,
          },
          {
            ellipsis: true,
            width: 150,
            title: t('product.code'),
            render: (_, record) => record.product_code,
          },
          {
            ellipsis: true,
            width: 150,
            title: t('product.option'),
            render: (_, record) => record.option,
          },
          {
            ellipsis: true,
            align: 'right',
            width: 120,
            title: t('product.price'),
            render: (_, record) => (
              <TurtleInputPrice
                size="small"
                value={record.price}
                onChange={(value) => {
                  updateSuccessList('price', record.product_code, value);
                }}
              />
            ),
          },
          {
            ellipsis: true,
            title: t('product.image url'),
            render: (_, record) => (
              <Typography.Link href={record.image_url} target="_blank">
                {record.image_url}
              </Typography.Link>
            ),
          },
          {
            ellipsis: true,
            title: t('product.memo'),
            render: (_, record) => record.memo,
          },
          {
            ellipsis: true,
            width: 50,
            render: (_, record) => (
              <TurtleIcon
                type="delete"
                onClick={() => {
                  deleteItem(record.product_code);
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
