import React, { useEffect, useMemo } from 'react';
import {
  MemoIcon,
  TurtleIcon,
  TurtleSearchInput,
  TurtleSearchSelect,
  TurtleTableNumberInput,
  TurtleTableTitle,
} from '@components/element';
import TurtleTableSelect from '@components/element/select/TurtleTableSelect';
import { css } from '@emotion/react';
import useModal from '@hooks/useModal';
import useOrderCart from '@hooks/useOrderCart';
import { Col, Row, Table, TabPaneProps, Tabs } from 'antd';
import { message } from '@utils/message';
import { t } from 'i18next';
import { useState } from 'react';
import { valueType } from 'antd/lib/statistic/utils';
import { phonePattern } from '@utils/pattern';
import DeleteOrderModal from '@components/combine/modal/DeleteOrderModal';
import { StoreOrder } from '@apis/orderAPI';
import OrderMemoModal from '@components/combine/modal/OrderMemoModal';

interface Props extends TabPaneProps {
  loading: boolean;
}

export const category = [
  {
    value: 'order',
    name: t('type.orderTypes.order'),
  },
  {
    value: 'reserve',
    name: t('type.orderTypes.reserve'),
  },
  {
    value: 'takeback',
    name: t('type.orderTypes.takeback'),
  },
  {
    value: 'exchange',
    name: t('type.orderTypes.exchange'),
  },
  {
    value: 'sample',
    name: t('type.orderTypes.sample'),
  },
  {
    value: 'pickup',
    name: t('type.orderTypes.pickup'),
  },
  {
    value: 'extra',
    name: t('type.orderTypes.extra'),
  },
];

export const options = [
  {
    name: t('table.vendorName'),
    value: 'vendor_name',
  },
  {
    name: t('table.vendorAddress'),
    value: 'vendor_address',
  },
  {
    name: t('table.mobile'),
    value: 'mobile',
  },
];

function SuccessTab({ loading, ...props }: Props) {
  const { cart, setCart, setSuccessListToOrderCount, countSucessOrdersCount } =
    useOrderCart();
  const [selectedRowID, setSelectedRowID] = useState(-1);

  const [visibleDeleteModal, openDeleteModal, closeDeleteModal] = useModal();
  const [visibleMemoModal, openMemoModal, closeMemoModal] = useModal();
  const [searchQuery, setSearchQuery] = useState({
    type: 'vendor_name',
    search_string: '',
  });

  const filterdList = useMemo(() => {
    const orderArray: StoreOrder[] = [];
    if (cart.successList.length === 0) return orderArray;

    cart.successList.map((item) =>
      item.orders.map((order) => orderArray.push(order)),
    );

    if (searchQuery.type === 'vendor_name')
      return orderArray.filter((order) =>
        order.vendor_name.includes(searchQuery.search_string),
      );
    if (searchQuery.type === 'vendor_address')
      return orderArray.filter((order) =>
        order.vendor_address.includes(searchQuery.search_string),
      );

    if (searchQuery.type === 'mobile')
      return orderArray.filter((order) =>
        order.mobile.includes(searchQuery.search_string),
      );

    return orderArray;
  }, [cart.successList, searchQuery]);

  const updateMemo = () => {
    if (cart.successList.length !== 0) {
      const orders: StoreOrder[] = [];
      cart.successList.map((item) =>
        item.orders.map((order) => orders.push(order)),
      );
      return (
        orders.find((order) => Number(order.order_id) === selectedRowID)
          ?.memo ?? ''
      );
    }

    return '';
  };

  return (
    <>
      <OrderMemoModal
        visible={visibleMemoModal}
        close={closeMemoModal}
        defaultValue={updateMemo()}
        onOk={(value) => {
          setCart({
            ...cart,
            successList: [
              {
                ...cart.successList[0],
                orders: cart.successList[0].orders.map((order) => ({
                  ...order,
                  memo: order.order_id === selectedRowID ? value : order.memo,
                })),
              },
            ],
          });
          message.success(t('message.successMemoInput'));
          closeMemoModal();
        }}
      />
      <DeleteOrderModal
        visible={visibleDeleteModal}
        onCancel={closeDeleteModal}
        onOK={() => {
          setCart({
            ...cart,
            successList: [
              {
                ...cart.successList[0],
                orders: cart.successList[0].orders.filter(
                  (order) => order.order_id !== selectedRowID,
                ),
              },
            ],
          });
          message.success(t('message.successDelete'));
          closeDeleteModal();
        }}
      />
      <Tabs.TabPane {...props}>
        <Table
          scroll={{ x: 'auto', y: 400, scrollToFirstRowOnChange: true }}
          dataSource={filterdList}
          loading={loading}
          size="small"
          rowKey={(record) => String(record.order_id)}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
          }}
          title={() => (
            <TurtleTableTitle
              totalCount={countSucessOrdersCount()}
              rightContent={
                <Row>
                  <Col css={marginRight}>
                    <TurtleSearchSelect
                      value={searchQuery.type}
                      onChange={(value) => {
                        setSearchQuery({
                          ...searchQuery,
                          type: value,
                        });
                      }}
                      items={options}
                    />
                  </Col>

                  <Col>
                    <TurtleSearchInput
                      placeholder={t('placeholder.input search query')}
                      value={searchQuery.search_string}
                      onChange={(e) =>
                        setSearchQuery({
                          ...searchQuery,
                          search_string: e.currentTarget.value,
                        })
                      }
                    />
                  </Col>
                </Row>
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
              render: (_, record) => record.vendor_address,
            },
            {
              title: t('table.mobile'),
              width: 176,
              render: (_, record) =>
                record.mobile.replace(phonePattern, '$1-$2-$3'),
            },
            {
              title: t('table.vendorProductName'),
              width: 240,
              render: (_, record) => record.product_name,
            },
            {
              title: t('table.option'),
              width: 150,
              render: (_, record) => record.product_option,
            },
            {
              title: t('table.type'),
              width: 136,
              render: (_, record) => (
                <TurtleTableSelect
                  items={category}
                  value={record.order_type}
                  onChange={(value: string) =>
                    setCart({
                      ...cart,
                      successList: [
                        {
                          ...cart.successList[0],
                          orders: cart.successList[0].orders.map((order) => ({
                            ...order,
                            order_type:
                              record.order_id === order.order_id
                                ? value
                                : order.order_type,
                          })),
                        },
                      ],
                    })
                  }
                />
              ),
            },
            {
              title: t('table.requestCount'),
              width: 136,
              align: 'right',
              render: (_, record) => (
                <TurtleTableNumberInput
                  step={1}
                  value={Number(record.product_count)}
                  onChange={(value) =>
                    setCart({
                      ...cart,
                      successList: setSuccessListToOrderCount(
                        cart.successList,
                        Number(record.order_id),
                        cart.successList[0].rt_store_id,
                        String(value),
                      ),
                    })
                  }
                />
              ),
            },
            {
              title: t('table.supplyPrice'),
              width: 136,
              align: 'right',
              render: (_, record) => record.product_price.toLocaleString(),
            },
            {
              title: <div css={css({ marginLeft: 25 })}>{t('table.memo')}</div>,
              width: 308,
              render: (_, record) => {
                return (
                  <div
                    css={css({
                      display: 'flex',
                      justifyContent: 'space-between',
                    })}
                  >
                    <div css={css({ marginLeft: 30 })}>
                      <MemoIcon
                        value={record.memo ?? ''}
                        onClick={() => {
                          setSelectedRowID(Number(record.order_id));
                          openMemoModal();
                        }}
                      />
                    </div>
                    <div css={css({ marginRight: 30 })}>
                      <TurtleIcon
                        name="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRowID(Number(record.order_id));
                          openDeleteModal();
                        }}
                      />
                    </div>
                  </div>
                );
              },
            },
          ]}
        />
      </Tabs.TabPane>
    </>
  );
}

const marginRight = css`
  margin-right: 6px;
`;

export default SuccessTab;
