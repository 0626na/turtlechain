import { TextWithTooltip } from '@components/combine';
import { TurtleTableTitle, TurtleTag } from '@components/element';
import useExelClearingCart from '@hooks/useExelClearingCart';
import { Table } from 'antd';
import { t } from 'i18next';

function FailTab() {
  const { cart } = useExelClearingCart();
  const totalCount = cart.failList.length;

  return (
    <Table
      scroll={{ y: 450, scrollToFirstRowOnChange: true }}
      size="small"
      dataSource={cart.failList}
      rowKey={(record) => record.account_number}
      title={() => <TurtleTableTitle totalCount={totalCount} />}
      pagination={{
        position: ['bottomCenter'],
        showSizeChanger: false,
      }}
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
                t('description.payment today'),
                t('description.check vendor'),
              ]}
            >
              {t('table.vatIncluded')}
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

export default FailTab;
