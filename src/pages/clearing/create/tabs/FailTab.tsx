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
          title: t('table.vendorName'),
          render: (_, record) => record.ws_store_name,
        },
        {
          ellipsis: true,
          title: t('table.vendorAddress'),
          render: (_, record) => record.vendor_address,
        },
        {
          ellipsis: true,
          title: t('table.bankName'),
          render: (_, record) => record.bank,
        },
        {
          ellipsis: true,
          title: t('table.account number'),
          render: (_, record) => record.account_number,
        },
        {
          ellipsis: true,
          title: t('table.account holder'),
          render: (_, record) => record.account_holder,
        },
        {
          ellipsis: true,
          align: 'right',
          title: t('table.amount'),
          render: (_, record) => record.credit_amount.toLocaleString(),
        },
        {
          ellipsis: true,
          align: 'right',
          title: t('table.mistransfer recipient print content'),
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
              {t('table.vatIncluded')}
            </TextWithTooltip>
          ),
          render: (_, record) => (
            <TurtleTag color={record.is_vat_included ? 'orange' : 'gray'}>
              {record.is_vat_included
                ? t('table.right delivery')
                : t('table.general')}
            </TurtleTag>
          ),
        },
      ]}
    />
  );
}

export default FailTab;
