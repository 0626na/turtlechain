import { OrderHistoryItem } from '@apis/orderAPI';
import { TurtleTableTitle } from '@components/element';
import { Table, TabPaneProps, Tabs } from 'antd';

interface Props extends TabPaneProps {
  data: OrderHistoryItem[];
  loading: boolean;
}

function SuccessTab({ data, loading, ...props }: Props) {
  return (
    <Tabs.TabPane {...props}>
      <Table
        loading={loading}
        dataSource={data}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
        title={() => <TurtleTableTitle totalCount={data.length ?? 0} />}
        columns={[
          {
            title: '거래처명',
            render: (_, record) => record.vendor_name,
          },
          {
            title: '거래처 주소',
            render: (_, record) => record.address,
          },
          {
            title: '휴대전화 번호',
            render: (_, record) => record.mobile,
          },
          {
            title: '거래처 상품명',
            render: (_, record) => record.name,
          },
          {
            title: '옵션',
            render: (_, record) => record.option,
          },
          {
            title: '분류',
            render: (_, record) => record.type,
          },
          {
            title: '요청 수량',
            render: (_, record) => record.count.toLocaleString(),
          },
          {
            title: '공급가',
            render: (_, record) => record.price.toLocaleString(),
          },
          {
            title: '메모',
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default SuccessTab;
