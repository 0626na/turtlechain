import React from 'react';

import { Table } from 'antd';

import useVendorCart from '@hooks/useVendorCart';
import { css } from '@emotion/react';

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
        scroll={{ y: 'auto', x: 1400 }}
        columns={[
          {
            ellipsis: true,
            width: 85,
            title: '거래처 코드',
            render: (_, record) =>
              record.vendor_code ?? <span css={fail}>(정보없음)</span>,
          },
          {
            ellipsis: true,
            width: 200,
            title: '쇼핑몰 입력 값',
            render: (_, record) => {
              if (!!record.name || !!record.address) {
                return <span css={fail}>(정보없음)</span>;
              }
              return `${record.name}  ${record.address}`;
            },
          },
          {
            ellipsis: true,
            width: 150,
            title: '거래처 주소',
            render: (_) => <span css={fail}>(정보없음)</span>,
          },
          {
            ellipsis: true,
            width: 130,
            title: '휴대번호',
            render: (_) => <span css={fail}>(정보없음)</span>,
          },
          {
            ellipsis: true,
            width: 300,
            title: '계좌정보',
            render: (_) => <span css={fail}>(정보없음)</span>,
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
