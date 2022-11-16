import React, { useMemo } from 'react';
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
import DeleteOrderModal from '@components/combine/modal/DeleteOrderModal';
import { Col, Row, Table, TabPaneProps, Tabs } from 'antd';
import { message } from '@utils/message';
import { t } from 'i18next';
import { useState } from 'react';
import OrderMemoModal from '../../../../components/combine/modal/OrderMemoModal';
import { valueType } from 'antd/lib/statistic/utils';
import { StoreOrder } from '@apis/orderAPI';

interface Props extends TabPaneProps {
  loading: boolean;
}

export const category = [
  {
    value: t('order.types.order'),
    name: t('order.types.order'),
  },
  {
    value: t('order.types.notDelivery'),
    name: t('order.types.notDelivery'),
  },
  {
    value: t('order.types.return'),
    name: t('order.types.return'),
  },
  {
    value: t('order.types.exchange'),
    name: t('order.types.exchange'),
  },
  {
    value: t('order.types.sample'),
    name: t('order.types.sample'),
  },
  {
    value: t('order.types.pickUp'),
    name: t('order.types.pickUp'),
  },
  {
    value: t('order.types.etc'),
    name: t('order.types.etc'),
  },
];

function SuccessTab({ loading, ...props }: Props) {
  const options = [
    {
      name: t('order.search.storeName'),
      value: 'name',
    },
    {
      name: t('order.search.clientName'),
      value: 'vendor_name',
    },
    {
      name: t('order.search.mobile'),
      value: 'mobile',
    },
  ];

  const { cart, setCart } = useOrderCart();
  const [selectedRowID, setSelectedRowID] = useState(-1);
  const [selectOrderRowID, setSelectOrderRowID] = useState(0);
  const [deleteMode, setDeleteMode] = useState(false); //true: 쇼핑몰 삭제, false: 쇼핑몰 내부 거래처 데이터 삭제
  const [visibleDeleteModal, openDeleteModal, closeDeleteModal] = useModal();
  const [visibleMemoModal, openMemoModal, closeMemoModal] = useModal();
  const [searchQuery, setSearchQuery] = useState({
    type: 'name',
    search_string: '',
  });

  const filterdList = useMemo(() => {
    if (searchQuery.type === 'name')
      return cart.successList.filter((item) =>
        item.rt_store_name.includes(searchQuery.search_string),
      );
    if (searchQuery.type === 'vendor_name')
      return cart.successList.map((store) => ({
        ...store,
        orders: store.orders.filter((order) =>
          order.vendor_name.includes(searchQuery.search_string),
        ),
      }));

    if (searchQuery.type === 'mobile')
      return cart.successList.map((store) => ({
        ...store,
        orders: store.orders.filter((order) =>
          order.mobile.includes(searchQuery.search_string),
        ),
      }));
    return cart.successList;
  }, [cart.successList, searchQuery]);

  return (
    <>
      <DeleteOrderModal
        visible={visibleDeleteModal}
        onCancel={closeDeleteModal}
        onOK={() => {
          deleteMode
            ? setCart({
                ...cart,
                successList: cart.successList.filter(
                  (item) => item.id !== selectedRowID,
                ),
              })
            : setCart({
                ...cart,
                successList: cart.successList.map((store) => ({
                  ...store,
                  orders: store.orders.filter(
                    (order: StoreOrder) => order.order_id !== selectOrderRowID,
                  ),
                })),
              });
          message.success(t('message.successDelete'));
          closeDeleteModal();
        }}
      />

      <OrderMemoModal
        defaultValue={
          cart.successList
            .find((store) => store.id === selectedRowID)
            ?.orders.find((order) => order.order_id === selectOrderRowID)
            ?.memo ?? ''
        }
        visible={visibleMemoModal}
        close={closeMemoModal}
        onOk={(value) => {
          setCart({
            ...cart,
            successList: cart.successList.map((store) => {
              if (store.id === selectedRowID) {
                return {
                  ...store,
                  orders: store.orders.map((order) => {
                    if (order.order_id === selectOrderRowID)
                      return { ...order, memo: value };

                    return order;
                  }),
                };
              }
              return store;
            }),
          });
          message.success(t('message.successMemoInput'));
          closeMemoModal();
        }}
      />
      <Tabs.TabPane {...props}>
        <Table
          css={{
            '&& tbody > tr:hover > td': {
              backgroundColor: '#E2F6F7',
            },
          }}
          scroll={{ x: 1608, y: 504, scrollToFirstRowOnChange: true }}
          dataSource={filterdList}
          loading={loading}
          size="small"
          rowKey={(record) => String(record.id)}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
          }}
          title={() => (
            <TurtleTableTitle
              totalCount={cart.successList.length ?? 0}
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
                      placeholder={t('placeholder.inputQuery')}
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
          expandable={{
            rowExpandable: (record) => record.type !== 'single',
            expandRowByClick: true,
            onExpand: (onExpand, record) => {
              if (!onExpand) {
                setSelectedRowID(-1);
                return;
              }

              setSelectedRowID(Number(record.id));
            },
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <TurtleIcon
                  name="accordionUp"
                  onClick={(e) => onExpand(record, e)}
                />
              ) : (
                <TurtleIcon
                  name="accordionDown"
                  onClick={(e) => onExpand(record, e)}
                />
              ),
            expandedRowRender: (expandedRecord) => (
              <Table
                size="small"
                scroll={{ x: 'auto', y: 400, scrollToFirstRowOnChange: true }}
                dataSource={expandedRecord.orders}
                rowKey={(record) => String(record.order_id)}
                loading={expandedRecord === undefined}
                pagination={false}
                columns={[
                  {
                    width: 184,
                  },
                  {
                    title: t('table.vendorName'),
                    width: 136,
                    render: (_, record) => record.vendor_name ?? '',
                  },
                  {
                    title: t('table.vendorAddress'),
                    width: 196,
                    render: (_, record) => record.vendor_address ?? '',
                  },
                  {
                    title: t('table.mobile'),
                    width: 156,
                    render: (_, record) => record.mobile ?? '',
                  },
                  {
                    title: t('table.vendorProductName'),
                    width: 216,
                    render: (_, record) => record.product_name ?? '',
                  },
                  {
                    title: t('table.option'),
                    width: 136,
                    render: (_, record) => record.product_option ?? '',
                  },
                  {
                    title: t('table.type'),
                    width: 136,
                    render: (_, record) => (
                      <TurtleTableSelect
                        items={category}
                        value={record.order_type}
                        onChange={(value: string) => {
                          setCart({
                            ...cart,
                            failList: cart.failList,
                            successList: cart.successList.map(
                              (successItem) => ({
                                rt_store_id: successItem.rt_store_id,
                                rt_store_name: successItem.rt_store_name,
                                type: successItem.type,
                                orders:
                                  successItem.rt_store_id ===
                                  expandedRecord.rt_store_id
                                    ? successItem.orders.map((order) => ({
                                        ...order,
                                        order_type:
                                          order.order_id === record.order_id
                                            ? value
                                            : order.order_type,
                                      }))
                                    : successItem.orders,
                              }),
                            ),
                          });
                        }}
                      />
                    ),
                  },
                  {
                    title: t('table.count'),
                    align: 'right',
                    width: 136,
                    render: (_, record) => (
                      <TurtleTableNumberInput
                        step={1}
                        value={Number(record.product_count)}
                        onChange={(value: valueType) => {
                          setCart({
                            ...cart,
                            failList: cart.failList,
                            successList: cart.successList.map(
                              (successItem) => ({
                                ...successItem,
                                orders:
                                  successItem.rt_store_id ===
                                  expandedRecord.rt_store_id
                                    ? successItem.orders.map((item) => ({
                                        ...item,
                                        product_count:
                                          item.order_id === record.order_id &&
                                          value !== null
                                            ? value.toString()
                                            : item.product_count,
                                      }))
                                    : successItem.orders,
                              }),
                            ),
                          });
                        }}
                      />
                    ),
                  },
                  {
                    title: t('table.supplyPrice'),
                    width: 136,
                    align: 'right',
                    render: (_, record) =>
                      Number(record.product_price).toLocaleString() ?? 0,
                  },
                  {
                    title: t('table.memo'),
                    align: 'center',
                    width: 107,
                    render: (_, record) => (
                      <div
                        css={css`
                          display: flex;
                          justify-content: space-evenly;
                          align-items: center;
                        `}
                      >
                        <MemoIcon
                          value={record.memo ?? ''}
                          onClick={() => {
                            setSelectOrderRowID(Number(record.order_id));
                            openMemoModal();
                          }}
                        />

                        <TurtleIcon
                          name="delete"
                          onClick={() => {
                            setSelectOrderRowID(Number(record.order_id));
                            setDeleteMode(false);
                            openDeleteModal();
                          }}
                        />
                      </div>
                    ),
                  },
                ]}
              />
            ),
          }}
          columns={[
            {
              title: t('table.store'),
              width: 184,
              render: (_, record) => record.rt_store_name ?? '',
            },
            {
              title: t('table.vendor'),
              width: 488,
              render: (_, record) => {
                return (
                  record.orders.length !== 0 &&
                  `${record.orders[0].vendor_name} 외 ${
                    record.orders.length - 1
                  }개`
                );
              },
            },
            {
              title: t('table.product'),
              width: 488,
              render: (_, record) =>
                record.orders.length !== 0 &&
                t('order.recordRender', {
                  name: record.orders[0].product_name,
                  count: record.orders.length - 1,
                }),
            },
            {
              title: t('table.countTotal'),
              width: 136,
              render: (_, record) =>
                record.orders.length !== 0 &&
                record.orders.reduce(
                  (acc, order) => acc + Number(order.product_count),
                  0,
                ),
            },
            {
              title: t('table.supplyPriceTotal'),
              width: 128,
              align: 'right',
              render: (_, record) =>
                record.orders.length !== 0 &&
                record.orders
                  .reduce((acc, order) => acc + Number(order.product_price), 0)
                  .toLocaleString(),
            },
            {
              width: 124,
              onCell: (record) => ({
                style: { cursor: 'pointer' },
                onClick: (e) => {
                  e.stopPropagation();
                  setSelectedRowID(Number(record.id));
                  setDeleteMode(true);
                  openDeleteModal();
                },
              }),
              render: (_, record) => <TurtleIcon name="delete" />,
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
