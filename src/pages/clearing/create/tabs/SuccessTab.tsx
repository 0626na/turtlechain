import { TextWithTooltip } from '@components/combine';
import { TurtleTableTitle, TurtleTag } from '@components/element';
import useExelClearingCart from '@hooks/useExelClearingCart';
import { Table } from 'antd';

function SuccessTab() {
  const { cart } = useExelClearingCart();
  const totalCount = cart.successList.length;

  return (
    <Table
      scroll={{ y: 700, scrollToFirstRowOnChange: true }}
      size="small"
      dataSource={cart.successList}
      rowKey={(record) => record.account_number}
      pagination={{
        position: ['bottomCenter'],
        showSizeChanger: false,
      }}
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
          align: 'center',
          title: (
            <TextWithTooltip
              tooltipContent={[
                '당일결제 시, 부가세도 그 날에 함께',
                '전달되어야 하는 거래처',
              ]}
            >
              부가세 바로전달
            </TextWithTooltip>
          ),
          render: (_, record) => (
            <TurtleTag color={record.is_vat_included ? 'orange' : 'gray'}>
              {record.is_vat_included ? '바로전달' : '일반'}
            </TurtleTag>
          ),
        },
      ]}
    />
  );
}

export default SuccessTab;
