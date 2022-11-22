import React from 'react';
import { t } from 'i18next';
import { css } from '@emotion/react';

import { Table } from 'antd';
import useVendorCart from '@hooks/useVendorCart';

interface Props {
  isLoading: boolean;
}

function FailTab({ isLoading }: Props) {
  const { cart } = useVendorCart();

  return (
    <>
      <Table
        size="small"
        loading={isLoading}
        dataSource={cart.failList}
        rowKey={(record) => record.vendor_code}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
        scroll={{ y: 'auto', x: 1000 }}
        columns={[
          {
            ellipsis: true,
            width: 50,
            title: t('table.vendorCode'),
            render: (_, record) =>
              record.vendor_code ?? <span css={fail}>(정보없음)</span>,
          },
          {
            ellipsis: true,
            width: 300,
            title: t('table.retailerStoreInput'),
            render: (_, record) => {
              if (!!record.name || !!record.address) {
                return `${record.name}  ${record.address}`;
              }
              return <span css={fail}>(정보없음)</span>;
            },
          },
        ]}
      />
    </>
  );
}

const fail = css`
  color: #cbccd1;
`;
export default FailTab;
