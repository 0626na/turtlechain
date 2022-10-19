import React from 'react';
import {
  MemoIcon,
  TurtleIcon,
  TurtleTableNumberInput,
  TurtleTableTitle,
} from '@components/element';
import TurtleTableSelect from '@components/element/select/TurtleTableSelect';
import { css } from '@emotion/react';
import useModal from '@hooks/useModal';
import useOrderCart from '@hooks/useOrderCart';
import DeleteOrderModal from '@pages/order/create/modals/DeleteOrderModal';
import { message, Popconfirm, Table, TabPaneProps, Tabs } from 'antd';
import { t } from 'i18next';
import { useState } from 'react';
import OrderMemoModal from '../modals/OrderMemoModal';

interface Props extends TabPaneProps {
  loading: boolean;
}

function SuccessTab({ loading, ...props }: Props) {
  // const options = [
  //   {
  //     name: '쇼핑몰명',
  //     value: 'name',
  //   },
  //   {
  //     name: '거래처명',
  //     value: 'vendor_name',
  //   },
  //   {
  //     name: '휴대번호',
  //     value: 'mobile',
  //   },
  // ];

  const category = [
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
  const { cart, setCart } = useOrderCart();
  const [selectedRowID, setSelectedRowID] = useState(-1);
  const [selectOrderRowID, setSelectOrderRowID] = useState(0);
  //true: 쇼핑몰 삭제, false: 쇼핑몰 내부 거래처 데이터 삭제
  const [deleteMode, setDeleteMode] = useState(false);
  const [visibleDeleteModal, openDeleteModal, closeDeleteModal] = useModal();
  const [visibleMemoModal, openMemoModal, closeMemoModal] = useModal();

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
                    (order) => order.order_id !== selectOrderRowID,
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
          scroll={{ x: 1608, y: 504, scrollToFirstRowOnChange: true }}
          dataSource={cart.successList}
          loading={loading}
          size="small"
          rowKey={(record) => record.id?.toString()!}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
          }}
          title={() => (
            <TurtleTableTitle
              totalCount={cart.successList.length ?? 0}
              // rightContent={
              //   <Row>
              //     <Col css={marginRight}>
              //       <TurtleSearchSelect
              //         value={searchQuery.type}
              //         onChange={(value) => {
              //           setSearchQuery({
              //             ...searchQuery,
              //             type: value,
              //           });
              //         }}
              //         items={options}
              //       />
              //     </Col>

              //     <Col>
              //       <TurtleSearchInput
              //         placeholder="검색어를 입력하세요"
              //         value={searchQuery.search_string}
              //         onChange={(e) => {
              //           setSearchQuery({
              //             ...searchQuery,
              //             search_string: e.currentTarget.value,
              //           });
              //         }}
              //       />
              //     </Col>
              //   </Row>
              // }
            />
          )}
          expandable={{
            expandedRowKeys: [selectedRowID.toString()],
            onExpand: (onExpand, record) => {
              if (!onExpand) {
                setSelectedRowID(-1);
                return;
              }

              setSelectedRowID(record.id!);
            },
            expandedRowRender: (expandedRecord) => (
              <Table
                size="small"
                scroll={{ x: 'auto', y: 400, scrollToFirstRowOnChange: true }}
                dataSource={expandedRecord.orders}
                rowKey={(record) => record.order_id?.toString()!}
                loading={expandedRecord === undefined}
                pagination={false}
                columns={[
                  {
                    width: 184,
                  },
                  {
                    title: '거래처명',
                    width: 136,
                    render: (_, record) => record.vendor_name,
                  },
                  {
                    title: '거래처 주소',
                    width: 196,
                    render: (_, record) => record.vendor_address,
                  },
                  {
                    title: '휴대전화번호',
                    width: 156,
                    render: (_, record) => record.mobile,
                  },
                  {
                    title: '거래처 상품명',
                    width: 216,
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
                        onChange={(value: string) => {
                          setCart({
                            failList: cart.failList,
                            successList: cart.successList.map(
                              (successItem) => ({
                                rt_store_id: successItem.rt_store_id,
                                rt_store_name: successItem.rt_store_name,
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
                    title: '수량',
                    width: 136,
                    render: (_, record) => (
                      <TurtleTableNumberInput
                        step={1}
                        value={record.product_count}
                        onChange={(value) => {
                          setCart({
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
                    title: '공급가',
                    width: 136,
                    align: 'right',
                    render: (_, record) =>
                      Number(record.product_price).toLocaleString(),
                  },
                  {
                    title: '메모',
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
                          value=""
                          onClick={() => {
                            setSelectOrderRowID(record.order_id!);
                            openMemoModal();
                          }}
                        />

                        <TurtleIcon
                          name="delete"
                          onClick={() => {
                            setSelectOrderRowID(record.order_id!);
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
              title: '쇼핑몰',
              width: 184,
              render: (_, record) => record.rt_store_name,
            },
            {
              title: '거래처',
              width: 488,
              render: (_, record) =>
                `${record.orders[0].vendor_name} 외 ${
                  record.orders.length - 1
                }개`,
            },
            {
              title: '상품',
              width: 488,
              render: (_, record) =>
                `${record.orders[0].product_name} 외 ${
                  record.orders.length - 1
                }건`,
            },
            {
              title: '수량 합계',
              width: 136,
              render: (_, record) =>
                record.orders.reduce(
                  (acc, order) => acc + Number(order.product_count),
                  0,
                ),
            },
            {
              title: '공급가 합계',
              width: 128,
              align: 'right',
              render: (_, record) =>
                record.orders
                  .reduce((acc, order) => acc + Number(order.product_price), 0)
                  .toLocaleString(),
            },
            {
              width: 124,
              render: (_, record) => (
                <TurtleIcon
                  name="delete"
                  onClick={(e) => {
                    setSelectedRowID(record.id!);
                    e.stopPropagation();
                    setDeleteMode(true);
                    openDeleteModal();
                  }}
                />
              ),
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
