import {
  TurtleFormSelect,
  TurtleNumberInput,
  TurtleTableTitle,
} from '@components/element';
import useOrderCart from '@hooks/useOrderCart';
import { Table, TabPaneProps, Tabs } from 'antd';

interface Props extends TabPaneProps {
  loading: boolean;
}

function FailTab({ loading, ...props }: Props) {
  const { cart, setCart, failList, setFailList } = useOrderCart();

  return (
    <Tabs.TabPane {...props}>
      <Table
        scroll={{ x: 1400, y: 'auto', scrollToFirstRowOnChange: true }}
        loading={loading}
        size="small"
        rowKey={(record) => record.id}
        dataSource={failList}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
        title={() => (
          <TurtleTableTitle totalCount={cart.failList.length ?? 0} />
        )}
        columns={[
          {
            title: '거래처명',
            width: 200,
            render: (_, record) => record.vendor_name,
          },
          {
            title: '거래처 주소',
            render: (_, record) => record.vendor_address,
          },
          {
            title: '휴대전화 번호',
            render: (_, record) => record.mobile,
          },
          {
            title: '거래처 상품명',
            render: (_, record) => record.vendor_product,
          },
          {
            title: '옵션',
            render: (_, record) => record.product_option,
          },
          {
            title: '분류',
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
                value={record.type}
                onChange={(value: string) => {
                  //보여지는 실패케이스 테이블 데이터
                  setFailList([
                    ...failList.map((item) => ({
                      ...item,
                      type: record.id === item.id ? value : item.type,
                    })),
                  ]);

                  //실제로 보내는 데이터
                  setCart({
                    successList: cart.successList,
                    failList: cart.failList.map((item) => ({
                      ...item,
                      orders:
                        item.rt_store_id === record.store_id
                          ? item.orders.map((order) => ({
                              ...order,
                              order_type:
                                order.vendor_name === record.vendor_name
                                  ? value
                                  : order.order_type,
                            }))
                          : item.orders,
                    })),
                  });
                }}
              />
            ),
          },
          {
            title: '요청 수량',
            render: (_, record) => (
              <TurtleNumberInput
                step={1}
                value={record.count}
                onChange={(value) => {
                  setFailList([
                    ...failList.map((item) => ({
                      ...item,
                      count:
                        record.id === item.id && value !== null
                          ? value.toString()
                          : item.count,
                    })),
                  ]);
                }}
              />
            ),
          },
          {
            title: '가격',
            render: (_, record) => record.price,
          },
          {
            title: '메모',
            render: (_, record) => record.memo,
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default FailTab;
