import warehousingAPI, { WarehousingItem } from '@apis/warehousingAPI';
import {
  ArrowRightIcon,
  TurtleFormSearchInput,
  TurtleIcon,
  TurtlePrimaryRangePicker,
  TurtleTableTitle,
  TurtleText,
} from '@components/element';
import { css } from '@emotion/react';
import { useAdjustmentCart, useStore } from '@hooks/index';
import { Col, Collapse, CollapsePanelProps, Row, Table } from 'antd';
import { t } from 'i18next';
import moment from 'moment';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

interface Props extends CollapsePanelProps {
  activeKey: string;
}

function WarehousingPanel({ activeKey, ...props }: Props) {
  const { store } = useStore();
  const { selectWarehousingItem, selectAllWarehousingItem } =
    useAdjustmentCart();

  const [warehousingItemList, setWarehousingItemList] =
    useState<WarehousingItem[]>();

  const [searchString, setSearchString] = useState('');
  const [searchQuery, setSearchQuery] = useState({
    rt_store_id: store.selected?.id as number,
    start_date: moment().subtract(1, 'weeks').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
  });

  const getWarehousingItemQuery = useQuery(
    ['getWarehousingItem', searchQuery],
    () => warehousingAPI.getItem(searchQuery),
    {
      onSuccess: (data) => {
        setWarehousingItemList(data.data.item_list);
      },
    },
  );

  const filteredItemList = warehousingItemList?.filter(
    (item) =>
      item.product_info.vendor_product_name.includes(searchString) ||
      item.product_info.name.includes(searchString),
  );
  const totalCount = filteredItemList?.length ?? 0;

  return (
    <Collapse.Panel
      {...props}
      style={{
        border: activeKey === '1' ? '1px solid rgba(227, 230, 234, 1)' : 'none',
      }}
      showArrow={false}
      extra={
        <TurtleText css={{ color: '#242934' }}>
          {activeKey === '1' ? (
            <TurtleIcon name="arrowDown" />
          ) : (
            <ArrowRightIcon />
          )}
        </TurtleText>
      }
    >
      <div
        css={css`
          max-width: 320px;
          margin-bottom: 20px;
        `}
      >
        <TurtleFormSearchInput
          onSearch={(value) => {
            setSearchString(value);
          }}
          placeholder="상품명 or 거래처 상품명을 입력해주세요."
        />
      </div>

      <Table
        size="small"
        loading={getWarehousingItemQuery.isLoading}
        dataSource={filteredItemList}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={{ x: 1400, y: 410 }}
        // onRow={() => {}}

        rowSelection={{
          onSelect: selectWarehousingItem,
          onSelectAll: (_, records: WarehousingItem[]) => {
            selectAllWarehousingItem(records, totalCount);
          },
        }}
        title={() => (
          <TurtleTableTitle
            totalCount={totalCount}
            rightContent={
              <TurtlePrimaryRangePicker
                value={[
                  moment(searchQuery.start_date),
                  moment(searchQuery.end_date),
                ]}
                onChange={(_, dateStrings) => {
                  const start_date = dateStrings[0];
                  const end_date = dateStrings[1];

                  setSearchQuery((searchQuery) => ({
                    ...searchQuery,
                    start_date,
                    end_date,
                  }));
                }}
              />
            }
          />
        )}
        columns={[
          {
            ellipsis: true,
            width: 100,
            title: t('table.warehousingDate'),
            render: (_, record) =>
              moment(record.created_date).format('YYYY-MM-DD'),
          },
          {
            ellipsis: true,
            width: 150,
            title: t('table.vendorName'),
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
            title: t('table.option'),
            render: (_, record) => record.product_info.option,
          },
          {
            ellipsis: true,
            width: 120,
            align: 'right',
            title: t('table.price'),
            render: (_, record) => record.price.toLocaleString(),
          },
          {
            width: 120,
            align: 'right',
            title: t('table.warehousingCount'),
            render: (_, record) => record.count,
          },
        ]}
      />
    </Collapse.Panel>
  );
}

export default WarehousingPanel;
