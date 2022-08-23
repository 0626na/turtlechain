import { t } from 'i18next';
import {
  Checkbox,
  InputNumber,
  Table,
  TabPaneProps,
  Tabs,
  Tooltip,
  Typography,
} from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { warehousingCartState } from '@store/warehousingCartState';
import { pricePattern } from '@utils/pattern';
import { TurtleIcon, TurtleTableTitle } from '@components/common';
import { NewSearchFilter } from '@components/combine';

interface Props extends TabPaneProps {
  loading: boolean;
  reservedMessage: string;
}

function SuccessTab({ loading, reservedMessage, ...props }: Props) {
  const [cart, setCart] = useRecoilState(warehousingCartState);
  const [messageVisible, setMessageVisible] = useState(false);
  // 상품 삭제
  const deleteItem = useCallback(
    (index) => {
      setCart((cart) => ({
        ...cart,
        successList: cart.successList?.filter((item) => item.index !== index),
      }));
    },
    [setCart],
  );

  // 입고 수량 합계 계산
  const totalProductCount = useMemo(
    () => cart.successList.reduce((acc, cur) => acc + cur.count, 0),
    [cart.successList],
  );

  // 금액 합계 계산
  const totalProductPrice = useMemo(
    () => cart.successList.reduce((acc, cur) => acc + cur.count * cur.price, 0),
    [cart.successList],
  );

  // 장바구니의 successList 를 수정한다.
  const updateSuccessList = useCallback(
    (type: string, index, value) => {
      setCart((cart) => ({
        ...cart,
        successList: cart.successList.map((item) =>
          item.index === index
            ? {
                ...item,
                [type]: value,
              }
            : item,
        ),
      }));
    },
    [setCart],
  );

  const maybeReservedStyle = (maybe_reserved: boolean) => ({
    backgroundColor: maybe_reserved ? '#F2F2F3' : 'transparent',
  });

  useEffect(() => {
    reservedMessage !== '' ? setMessageVisible(true) : setMessageVisible(false);
  }, [reservedMessage]);

  const filteredList = useMemo(
    () =>
      cart.successList.filter((item) => {
        const { type, search_string } = cart.searchQuery;
        if (type === 'name') {
          return item.product_name.toLowerCase().includes(search_string);
        }
        if (type === 'vendor_product_name') {
          return item.vendor_product_name.toLowerCase().includes(search_string);
        }
        if (type === 'vendor_name') {
          return item.vendor_name.toLowerCase().includes(search_string);
        }
        return true;
      }),
    [cart.successList, cart.searchQuery],
  );

  return (
    <Tabs.TabPane {...props}>
      <Table
        size="small"
        loading={loading}
        dataSource={filteredList}
        rowKey={(record) => record.index!}
        pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
        scroll={{ x: 1400, y: 'auto' }}
        style={{ height: filteredList.length <= 5 ? '45vh' : '' }}
        title={() => (
          <TurtleTableTitle
            count={cart.successList.length}
            searchCount={filteredList.length}
            totalAmount={filteredList.reduce(
              (acc, cur) => acc + cur.price * cur.count,
              0,
            )}
          >
            <NewSearchFilter
              searchQuery={cart.searchQuery}
              setSearchQuery={(searchQuery) => {
                setCart((cart) => ({ ...cart, searchQuery }));
              }}
            />
          </TurtleTableTitle>
        )}
        footer={() =>
          `입고수량 합계 : ${totalProductCount}개 | 입고금액 합계 : ${totalProductPrice.toLocaleString()}원`
        }
        columns={[
          {
            ellipsis: true,
            width: 150,
            title: t('vendor.name'),
            render: (_, record) => record.vendor_name,
            onCell: (record) => ({
              style: maybeReservedStyle(record.maybe_reserved),
            }),
          },
          {
            ellipsis: true,
            width: 150,
            title: t('vendor.address'),
            render: (_, record) => record.vendor_address,
            onCell: (record) => ({
              style: maybeReservedStyle(record.maybe_reserved),
            }),
          },
          {
            ellipsis: true,
            width: 250,
            title: (
              <Tooltip
                title={
                  <Typography.Text
                    style={{ color: 'white' }}
                    onClick={() => setMessageVisible(false)}
                  >
                    {reservedMessage}
                  </Typography.Text>
                }
                visible={messageVisible}
              >
                {t('product.name')}
              </Tooltip>
            ),
            render: (_, record) => record.product_name,
            onCell: (record) => ({
              style: maybeReservedStyle(record.maybe_reserved),
            }),
          },
          {
            ellipsis: true,
            width: 200,
            title: t('product.vendor product name'),
            render: (_, record) => record.vendor_product_name,
            onCell: (record) => ({
              style: maybeReservedStyle(record.maybe_reserved),
            }),
          },
          {
            ellipsis: true,
            width: 150,
            title: t('product.code'),
            render: (_, record) => record.product_code,
            onCell: (record) => ({
              style: maybeReservedStyle(record.maybe_reserved),
            }),
          },
          {
            ellipsis: true,
            width: 150,
            title: t('product.option'),
            render: (_, record) => record.product_option,
            onCell: (record) => ({
              style: maybeReservedStyle(record.maybe_reserved),
            }),
          },
          {
            ellipsis: true,
            width: 100,
            title: '창고명',
            render: (_, record) => record.store_house,
            onCell: (record) => ({
              style: maybeReservedStyle(record.maybe_reserved),
            }),
          },
          {
            ellipsis: true,
            width: 120,
            align: 'right',
            title: t('product.price'),
            render: (_, record) => (
              <InputNumber
                size="small"
                step={1000}
                value={record.price}
                formatter={(value) => `${value}`.replace(pricePattern, ',')}
                min={0}
                onChange={(value) => {
                  updateSuccessList('price', record.index, value);
                }}
              />
            ),
            onCell: (record) => ({
              style: maybeReservedStyle(record.maybe_reserved),
            }),
          },
          {
            ellipsis: true,
            align: 'right',
            width: 120,
            title: t('warehousing.count'),
            render: (_, record) => (
              <InputNumber
                size="small"
                min={1}
                value={record.count}
                onChange={(value) => {
                  updateSuccessList('count', record.index, value);
                }}
              />
            ),
            onCell: (record) => ({
              style: maybeReservedStyle(record.maybe_reserved),
            }),
          },
          {
            ellipsis: true,
            width: 100,
            align: 'right',
            title: t('warehousing.is reserved'),
            render: (_, record) => (
              <Checkbox
                checked={record.is_reserved}
                onChange={() => {
                  updateSuccessList(
                    'is_reserved',
                    record.index,
                    !record.is_reserved,
                  );
                }}
              />
            ),
            onCell: (record) => ({
              style: maybeReservedStyle(record.maybe_reserved),
            }),
          },
          {
            ellipsis: true,
            width: 50,
            render: (_, record) => (
              <TurtleIcon
                type="delete"
                onClick={() => {
                  deleteItem(record.index);
                }}
              />
            ),
            onCell: (record) => ({
              style: maybeReservedStyle(record.maybe_reserved),
            }),
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default SuccessTab;
