import { Table, TabPaneProps, Tabs } from 'antd';

interface Props extends TabPaneProps {
  loading: boolean;
}

function FailTab({ loading, ...props }: Props) {
  return (
    <Tabs.TabPane {...props}>
      <Table
        loading={loading}
        size="small"
        columns={[
          {
            title: '쇼핑몰',
          },
          {
            title: '거래처',
          },
          {
            title: '상품',
          },
          {
            title: '수량 합계',
          },
          {
            title: '공급가 합계',
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default FailTab;
