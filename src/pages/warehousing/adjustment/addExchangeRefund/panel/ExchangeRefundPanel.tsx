import { AdjustmentItemShow } from '@apis/adjustmentAPI';

import { WarehousingItem } from '@apis/warehousingAPI';

import {
  MemoIcon,
  TurtleFormInput,
  TurtleIcon,
  TurtleTableInput,
  TurtleTableTitle,
  TurtleText,
} from '@components/element';

import { Collapse, CollapsePanelProps, Input, Table } from 'antd';
import { t } from 'i18next';
import React, { useEffect } from 'react';
import { css } from 'styled-components';

interface Props extends CollapsePanelProps {
  activeKey: string;
  exchangeRefundList: WarehousingItem[];
  // clearingRequestDate?: string;
  clickCreate: () => void;
}

function ExchangeRefundPanel({
  activeKey,
  exchangeRefundList,
  clickCreate,
  // clearingRequestDate,
  ...props
}: Props) {
  useEffect(() => {
    console.log(exchangeRefundList);
  }, [exchangeRefundList]);

  return (
    <Collapse.Panel
      {...props}
      style={{
        border: `${
          activeKey === '2' ? '1px solid rgba(227, 230, 234, 1)' : 'none'
        }`,
      }} // #E3E6EA
      showArrow={false}
      extra={
        <TurtleText css={{ color: '#242934' }}>
          {activeKey === '2' ? (
            <TurtleIcon name="arrowDown" />
          ) : (
            <TurtleIcon name="arrowRight" />
          )}
        </TurtleText>
      }
    >
      <Table
        size="small"
        // loading={getWarehousingItemQuery.isLoading}
        dataSource={exchangeRefundList}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={{ x: 1400, y: 410 }}
        title={() => (
          <TurtleTableTitle totalCount={exchangeRefundList.length ?? 0} />
        )}
        columns={[
          {
            ellipsis: true,
            width: 150,
            title: t('table.vendorName'),
            render: (_, record) => record.vendor_info.vendor_name,
          },
          {
            ellipsis: true,
            width: 150,
            title: t('table.vendorAddress'),
            render: (_, record) => record.vendor_info.vendor_name,
          },
          {
            ellipsis: true,
            width: 150,
            title: t('table.productName'),
            render: (_, record) => record.product_info.name,
          },
          {
            ellipsis: true,
            width: 200,
            title: t('table.vendorProductName'),
            render: (_, record) => record.product_info.vendor_product_name,
          },
          {
            ellipsis: true,
            width: 120,
            title: t('table.productCode'),
            render: (_, record) => record.product_info.option,
          },
          {
            ellipsis: true,
            width: 120,
            title: t('table.option'),
            render: (_, record) => record.product_info.option,
          },
          {
            ellipsis: true,
            width: 120,
            align: 'right',
            title: t('table.price'),
            render: (_, record) => (
              <TurtleTableInput textAlign="right" defaultValue={record.price} />
            ),
          },
          {
            width: 120,
            align: 'right',
            title: t('table.count'),
            render: (_, record) => {
              return <TurtleTableInput textAlign="right" />;
            },
          },
          {
            width: 120,
            title: t('table.type'),
            render: (_, record) => {
              return <TurtleTableInput />;
            },
          },
          {
            ellipsis: true,
            width: 50,
            title: t('table.memo'),
            align: 'center',
            render: (_, record) => (
              <MemoIcon
                onClick={() => {
                  // setSelectedRow(record);
                  // openMemoModal();
                }}
                value={record.memo}
              />
            ),
          },
          {
            ellipsis: true,
            width: 30,
            align: 'center',
            render: (_, record) => (
              <TurtleIcon
                name="delete"
                onClick={() => {
                  // handleVendorRemove(record.vendor_code);
                }}
              />
            ),
          },
        ]}
      />
    </Collapse.Panel>
  );
}

export default ExchangeRefundPanel;
