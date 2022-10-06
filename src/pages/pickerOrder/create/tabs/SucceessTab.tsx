import {
  TurtleFormSelect,
  TurtleIcon,
  TurtleNumberInput,
  TurtleSearchInput,
  TurtleSearchSelect,
  TurtleTableTitle,
} from '@components/element';
import { css } from '@emotion/react';
import useOrderCart from '@hooks/useOrderCart';
import { Col, Popconfirm, Row, Table, TabPaneProps, Tabs } from 'antd';
import { useMemo, useState } from 'react';

interface Props extends TabPaneProps {
  loading: boolean;
}

function SuccessTab({ loading, ...props }: Props) {
  const options = [
    {
      name: '쇼핑몰명',
      value: 'name',
    },
    {
      name: '거래처명',
      value: 'vendor_name',
    },
    {
      name: '휴대번호',
      value: 'mobile',
    },
  ];
  const { cart, setCart } = useOrderCart();
  const [selectedRowId, setSelectedRowId] = useState(0);

  const [searchQuery, setSearchQuery] = useState({
    type: 'name',
    search_string: '',
  });

  const filteredList = useMemo(
    () =>
      cart.successList.filter((item) => {
        const { type, search_string } = searchQuery;
        if (type === 'name') {
          return item.rt_store_name.toLowerCase().includes(search_string);
        }
        if (type === 'vendor_name') {
          return item.orders.filter((item) => {
            return item.vendor_name.toLowerCase().includes(search_string);
          });
        }
        if (type === 'mobile') {
          return item.orders.filter((item) => {
            return item.vendor_mobile.toLowerCase().includes(search_string);
          });
        }
        return true;
      }),
    [searchQuery, cart.successList],
  );

  return (
    <Tabs.TabPane {...props}>
      <Table
        scroll={{ x: 1400, y: 'auto', scrollToFirstRowOnChange: true }}
        dataSource={filteredList}
        loading={loading}
        size="small"
        rowKey={(record) => record.rt_store_id}
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
                    onChange={(e) => {
                      setSearchQuery({
                        ...searchQuery,
                        search_string: e.currentTarget.value,
                      });
                    }}
                  />
                </Col>
              </Row>
            }
          />
        )}
        expandable={{
          expandedRowKeys: [selectedRowId],
          onExpand: (onExpand, record) => {
            if (!onExpand) {
              setSelectedRowId(0);
              return;
            }
            setSelectedRowId(record.rt_store_id);
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
                  title: '거래처명',
                  render: (_, record) => record.vendor_name,
                },
                {
                  title: '거래처 주소',
                  width: 200,
                  render: (_, record) => record.vendor_address,
                },
                {
                  title: '휴대전화번호',
                  width: 200,
                  render: (_, record) => record.mobile,
                },
                {
                  title: '거래처 상품명',
                  render: (_, record) => record.product_name,
                },
                {
                  title: '옵션',
                  render: (_, record) => record.product_option,
                },
                {
                  title: '분류',
                  width: 100,
                  render: (_, record) => (
                    <TurtleFormSelect
                      items={[
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
                      ]}
                      value={record.order_type}
                      onChange={(value: string) => {
                        setCart({
                          failList: cart.failList,
                          successList: cart.successList.map((successItem) => ({
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
                          })),
                        });
                      }}
                    />
                  ),
                },
                {
                  title: '수량',
                  width: 100,
                  render: (_, record) => (
                    <TurtleNumberInput
                      value={record.product_count}
                      onChange={(value) => {
                        setCart({
                          failList: cart.failList,
                          successList: cart.successList.map((successItem) => ({
                            rt_store_id: successItem.rt_store_id,
                            rt_store_name: successItem.rt_store_name,
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
                          })),
                        });
                      }}
                    />
                  ),
                },
                {
                  title: '공급가',
                  width: 100,
                  render: (_, record) =>
                    Number(record.product_price).toLocaleString(),
                },
                {
                  width: 30,
                  align: 'center',
                  render: (_, record) => (
                    <Popconfirm
                      title="정말 삭제하시겠습니까?"
                      okText="네"
                      cancelText="취소"
                      onCancel={(e) => {
                        e?.stopPropagation();
                      }}
                      onConfirm={(e) => {
                        e?.stopPropagation();
                        setCart({
                          ...cart,
                          successList: cart.successList.map((item) => ({
                            ...item,
                            orders: item.orders.filter(
                              (order) => order.order_id !== record.order_id,
                            ),
                          })),
                        });
                      }}
                    >
                      <TurtleIcon name="delete" />
                    </Popconfirm>
                  ),
                },
              ]}
            />
          ),
        }}
        columns={[
          {
            title: '쇼핑몰',
            width: 180,
            render: (_, record) => record.rt_store_name,
          },
          {
            title: '거래처',
            render: (_, record) =>
              `${record.orders[0].vendor_name} 외 ${
                record.orders.length - 1
              }개`,
          },
          {
            title: '상품',
            render: (_, record) =>
              `${record.orders[0].product_name} 외 ${
                record.orders.length - 1
              }건`,
          },
          {
            title: '수량 합계',
            width: 140,
            render: (_, record) =>
              record.orders.reduce(
                (acc, order) => acc + Number(order.product_count),
                0,
              ),
          },
          {
            title: '공급가 합계',
            width: 140,
            render: (_, record) =>
              record.orders
                .reduce((acc, order) => acc + Number(order.product_price), 0)
                .toLocaleString(),
          },
          {
            width: 30,
            align: 'center',
            render: (_, record) => (
              <Popconfirm
                title="정말 삭제하시겠습니까?"
                okText="네"
                cancelText="취소"
                onCancel={(e) => {
                  e?.stopPropagation();
                }}
                onConfirm={(e) => {
                  e?.stopPropagation();
                  setCart({
                    ...cart,
                    successList: cart.successList.filter(
                      (item) => item.rt_store_id !== record.rt_store_id,
                    ),
                  });
                }}
              >
                <TurtleIcon name="delete" />
              </Popconfirm>
            ),
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

const marginRight = css`
  margin-right: 6px;
`;

export default SuccessTab;
