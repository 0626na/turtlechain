'use strict';
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
import OrderMemoModal from '@components/combine/modal/OrderMemoModal';
import { valueType } from 'antd/lib/statistic/utils';

import { phonePattern } from '@utils/pattern';
import DeleteOrderModal from '@components/combine/modal/DeleteOrderModal';
import { StoreOrder } from '@apis/orderAPI';

interface Props extends TabPaneProps {
  loading: boolean;
}

export const category = [
  {
    value: '발주',
    name: '발주',
  },
  {
    value: '미송',
    name: '미송',
  },
  {
    value: '반품',
    name: '반품',
  },
  {
    value: '교환',
    name: '교환',
  },
  {
    value: '샘플',
    name: '샘플',
  },
  {
    value: '픽업',
    name: '픽업',
  },
  {
    value: '기타',
    name: '기타',
  },
];

export const options = [
  {
    name: '거래처명',
    value: 'vendor_name',
  },
  {
    name: '거래처주소',
    value: 'vendor_address',
  },
  {
    name: '휴대전화번호',
    value: 'mobile',
  },
];

function SuccessTab({ loading, ...props }: Props) {
  const { cart, setCart } = useOrderCart();
  const [selectedRowID, setSelectedRowID] = useState(-1);

  const [deleteMode, setDeleteMode] = useState(false); //true: 쇼핑몰 삭제, false: 쇼핑몰 내부 거래처 데이터 삭제
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

  useEffect(() => {});

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
          scroll={{ x: 1608, y: 504, scrollToFirstRowOnChange: true }}
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
                      placeholder="검색어를 입력하세요"
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
              title: '거래처명',
              width: 188,
              render: (_, record) => record.vendor_name,
            },
            {
              title: '거래처주소',
              width: 196,
              render: (_, record) => record.vendor_address,
            },
            {
              title: '휴대전화 번호',
              width: 176,
              render: (_, record) =>
                record.mobile.replace(phonePattern, '$1-$2-$3'),
            },
            {
              title: '거래처 상품명',
              width: 196,
              render: (_, record) => record.product_name,
            },
            {
              title: '옵션',
              width: 136,
              render: (_, record) => record.product_option,
            },
            {
              title: '분류',
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
              title: '요청 수량',
              width: 136,
              align: 'right',
              render: (_, record) => (
                <TurtleTableNumberInput
                  step={1}
                  value={Number(record.product_count)}
                  onChange={(value: valueType) =>
                    setCart({
                      ...cart,
                      successList: [
                        {
                          ...cart.successList[0],
                          orders: cart.successList[0].orders.map((order) => ({
                            ...order,
                            product_count:
                              record.order_id === order.order_id
                                ? String(value)
                                : order.product_count,
                          })),
                        },
                      ],
                    })
                  }
                />
              ),
            },
            {
              title: '가격',
              width: 136,
              align: 'right',
              render: (_, record) => record.product_price.toLocaleString(),
            },
            {
              title: <div css={css({ marginLeft: 25 })}>메모</div>,
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
                          setDeleteMode(true);
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
