import { TurtleTableTitle } from '@components/element';
import useExelClearingCart from '@hooks/useExelClearingCart';
import { Table, Tag } from 'antd';

function SuccessTab() {
  const { cart } = useExelClearingCart();
  const totalCount = cart.successList.length;

  return (
    <Table
      scroll={{ y: 450, scrollToFirstRowOnChange: true }}
      size="small"
      dataSource={cart.successList}
      rowKey={(record) => record.account_number}
      pagination={false}
      title={() => <TurtleTableTitle totalCount={totalCount} />}
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
          align: 'right',
          title: '받는분통장인쇄내용',
          render: (_, record) => record.recipient_print,
        },
        {
          ellipsis: true,
          align: 'right',
          title: '부가세 입금 여부',
          render: (_, record) => (
            <Tag color={record.is_vat_included ? 'green' : 'red'}>
              {record.is_vat_included ? '포함' : '미포함'}
            </Tag>
          ),
        },
      ]}
    />
  );
}

export default SuccessTab;
