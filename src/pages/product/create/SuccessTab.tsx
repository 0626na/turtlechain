import { t } from 'i18next';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { Table, TabPaneProps, Tabs } from 'antd';
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
                vat_price:
                  type === 'supply_price'
                    ? Math.round(value * 0.1)
                    : product.vat_price,
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
        scroll={{ y: 'auto' }}
        style={{ height: cart.successList.length <= 5 ? '45vh' : '' }}
        title={() => <TurtleTableTitle count={cart.successList.length} />}
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
            render: (_, record) => record.name,
          },
          {
            ellipsis: true,
            title: t('product.vendor product name'),
            render: (_, record) => record.vendor_product_name,
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
            width: 150,
            title: t('product.supply price'),
            render: (_, record) => (
              <TurtleInputPrice
                size="small"
                value={record.supply_price}
                onChange={(value) => {
                  updateSuccessList('supply_price', record.product_code, value);
                }}
              />
            ),
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
          {
            ellipsis: true,
            width: '8%',
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
