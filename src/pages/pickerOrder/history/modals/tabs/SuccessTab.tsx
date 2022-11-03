import React from 'react';
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
        size="small"
        loading={loading}
        rowKey={(record) => String(record.id)}
        dataSource={data}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
        title={() => <TurtleTableTitle totalCount={data.length ?? 0} />}
        columns={[
          {
            title: '거래처명',
            width: 188,
            render: (_, record) => record.vendor_name,
          },
          {
            title: '거래처 주소',
            width: 196,
            render: (_, record) => record.address,
          },
          {
            title: '휴대전화 번호',
            width: 176,
            render: (_, record) => record.mobile,
          },
          {
            title: '거래처 상품명',
            width: 196,
            render: (_, record) => record.name,
          },
          {
            title: '옵션',
            width: 136,
            render: (_, record) => record.option,
          },
          {
            title: '분류',
            width: 116,
            render: (_, record) => record.type,
          },
          {
            title: '요청 수량',
            align: 'right',
            width: 116,
            render: (_, record) => record.count.toLocaleString(),
          },
          {
            title: '공급가',
            align: 'right',
            width: 116,
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
