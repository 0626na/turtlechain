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
import DeleteOrderModal from '@components/combine/modal/DeleteOrderModal';
import { Col, Row, Table, TabPaneProps, Tabs } from 'antd';
import { message } from '@utils/message';
import { t } from 'i18next';
import { useState } from 'react';
import OrderMemoModal from '../../../../components/combine/modal/OrderMemoModal';
import { StoreOrder, StoreOrderItemExcelParsing } from '@apis/orderAPI';
import moment from 'moment';

interface Props extends TabPaneProps {
  loading: boolean;
}

export const category = [
  {
    value: 'order',
    name: t('order.types.order'),
  },
  {
    value: 'reserve',
    name: t('order.types.reserve'),
  },
  {
    value: 'takeback',
    name: t('order.types.takeback'),
  },
  {
    value: 'exchange',
    name: t('order.types.exchange'),
  },
  {
    value: 'sample',
    name: t('order.types.sample'),
  },
  {
    value: 'pickup',
    name: t('order.types.pickup'),
  },
  {
    value: 'extra',
    name: t('order.types.extra'),
  },
];

function SuccessTab({ loading, ...props }: Props) {
  const options = [
    {
      name: t('button.storeName'),
      value: 'name',
    },
    {
      name: t('button.vendorName'),
      value: 'vendor_name',
    },
    {
      name: t('button.mobile'),
      value: 'mobile',
    },
  ];

  const {
    cart,
    setCart,
    setSuccessListToMemo,
    setSuccessListToOrderCount,
    setSuccessListToOrderType,
  } = useOrderCart();
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

  /**
   * 페이지 이동시 초기화
   */
  useEffect(
    () =>
      setCart({
        successList: [],
        failList: [],
        parsingStatus: { success_count: 0, fail_count: 0, error_messages: [] },
        selectedDate: moment(),
      }),
    [],
  );

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
          message.success(t('message.successDeleteOrder'));
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
            successList: setSuccessListToMemo(
              cart.successList,
              selectedRowID,
              selectOrderRowID,
              value,
            ),
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
          scroll={{ x: 950, y: 'auto', scrollToFirstRowOnChange: true }}
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
                      placeholder={t(
                        'please input search query in order search',
                      )}
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
            rowExpandable: (record) => {
              return record.type !== 'single';
            },
            expandRowByClick: true,
            onExpand: (onExpand, record) => {
              if (!onExpand) {
                setSelectedRowID(-1);
                return;
              }

              setSelectedRowID(Number(record.id));
            },
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded
                ? record.type !== 'single' && (
                    <TurtleIcon
                      name="accordionUp"
                      onClick={(e) => onExpand(record, e)}
                    />
                  )
                : record.type !== 'single' && (
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
                            successList: setSuccessListToOrderType(
                              cart.successList,
                              value,
                              expandedRecord.rt_store_id,
                              Number(record.order_id),
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
                        onChange={(value) => {
                          setCart({
                            ...cart,
                            failList: cart.failList,
                            successList: setSuccessListToOrderCount(
                              cart.successList,
                              Number(record.order_id),
                              expandedRecord.rt_store_id,
                              String(value),
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
              render: (_, record) => record.rt_store_name ?? '',
            },
            {
              title: t('table.vendor'),
              render: (_, record) => {
                if (record.type === 'single')
                  return record.orders.length
                    ? record.orders[0].vendor_name
                    : '';
                return (
                  record.orders.length !== 0 &&
                  t('count except one', {
                    name: record.orders[0].vendor_name,
                    count: record.orders.length - 1,
                  })
                );
              },
            },
            {
              title: t('table.product'),
              render: (_, record) => {
                if (record.type === 'single')
                  return record.orders.length
                    ? record.orders[0].product_name
                    : '';

                return (
                  record.orders.length !== 0 &&
                  t('count except one', {
                    name: record.orders[0].product_name,
                    count: record.orders.length - 1,
                  })
                );
              },
            },
            {
              title: t('table.countTotal'),
              render: (_, record) =>
                record.orders.length !== 0 &&
                record.orders.reduce(
                  (acc, order) => acc + Number(order.product_count),
                  0,
                ),
            },
            {
              title: t('table.supplyPriceTotal'),
              align: 'right',
              render: (_, record) => {
                return record.orders
                  .reduce((acc, order) => acc + Number(order.product_price), 0)
                  .toLocaleString();
              },
            },
            {
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
