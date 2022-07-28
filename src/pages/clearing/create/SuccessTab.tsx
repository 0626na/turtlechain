import { ClearingItemParse } from '@apis/clearingAPI';
import { TurtleTableTitle } from '@components/common';
import { Table, TabPaneProps, Tabs } from 'antd';

interface Props extends TabPaneProps {
  loading: boolean;
  successList: ClearingItemParse[];
}

function SuccessTab({ loading, successList, ...props }: Props) {
  return (
    <Tabs.TabPane {...props}>
      <Table
        scroll={{ y: 450, scrollToFirstRowOnChange: true }}
        size="small"
        loading={loading}
        dataSource={successList}
        rowKey={(record) => record.account_number}
        pagination={false}
        title={() => (
          <TurtleTableTitle
            count={successList.length}
            totalPrice={successList.reduce(
              (acc, cur) => acc + cur.credit_amount,
              0,
            )}
          />
        )}
        columns={[
          {
            ellipsis: true,
            title: '거래처명',
            render: (_, record) => record.ws_store_name,
          },
          {
            ellipsis: true,
            title: '거래처 주소',
            render: (_, record) => record.vendor_address,
          },
          {
            ellipsis: true,
            title: '은행명',
            render: (_, record) => record.bank,
          },
          {
            ellipsis: true,
            title: '계좌번호',
            render: (_, record) => record.account_number,
          },
          {
            ellipsis: true,
            title: '예금주',
            render: (_, record) => record.account_holder,
          },
          {
            ellipsis: true,
            align: 'right',
            title: '금액',
            render: (_, record) => record.credit_amount.toLocaleString(),
          },
          {
            ellipsis: true,
            title: '받는분통장인쇄내용',
            render: (_, record) => record.recipient_print,
          },
          {
            ellipsis: true,
            title: '부가세 포함여부',
            render: (_, record) => (record.is_vat_included ? '포함' : '미포함'),
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default SuccessTab;
