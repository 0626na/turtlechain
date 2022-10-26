import { TurtleTableTitle } from '@components/element';
import useOrderCart from '@hooks/useOrderCart';
import { Table, TabPaneProps, Tabs } from 'antd';

interface Props extends TabPaneProps {
  loading: boolean;
}

function FailTab({ loading, ...props }: Props) {
  const { cart, failListOutput } = useOrderCart();

  return (
    <Tabs.TabPane {...props}>
      <Table
        scroll={{ x: 1400, y: 'auto', scrollToFirstRowOnChange: true }}
        loading={loading}
        size="small"
        dataSource={failListOutput()}
        rowKey={(record) => record.id}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
        title={() => (
          <TurtleTableTitle totalCount={cart.failList.length ?? 0} />
        )}
        columns={[
          {
            title: '쇼핑몰',
            width: 180,
            render: (_, record) => record.rt_store_name,
          },
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
            render: (_, record) => record.product_name,
          },
          {
            title: '옵션',
            render: (_, record) => record.product_option,
          },
          {
            title: '분류',
            render: (_, record) => record.order_type,
          },
          {
            title: '요청 수량',
            render: (_, record) => record.product_count,
          },
          {
            title: '가격',
            render: (_, record) => record.product_price,
          },
          {
            title: '메모',
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default FailTab;
