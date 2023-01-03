import warehousingAPI, { WarehousingItem } from '@apis/warehousingAPI';
import {
  ArrowRightIcon,
  PrimaryButton,
  TurtleFormSearchInput,
  TurtleIcon,
  TurtlePrimaryRangePicker,
  TurtleTableTitle,
  TurtleText,
} from '@components/element';
import { css } from '@emotion/react';
import { useAdjustmentCart, useStore } from '@hooks/index';
import { Collapse, CollapsePanelProps, Table } from 'antd';
import { t } from 'i18next';
import moment from 'moment';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

interface Props extends CollapsePanelProps {
  activeKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setActiveKey: any;
}

function WarehousingPanel({ activeKey, setActiveKey, ...props }: Props) {
  const { store } = useStore();
  const { cart, setCart } = useAdjustmentCart();
  const { selectWarehousingItem, selectAllWarehousingItem } =
    useAdjustmentCart();

  const [warehousingItemList, setWarehousingItemList] =
    useState<WarehousingItem[]>();

  const [searchString, setSearchString] = useState('');
  const [searchQuery, setSearchQuery] = useState({
    rt_store_id: store.selected?.id as number,
    start_date: moment().subtract(1, 'weeks').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
    product_name: '',
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

  const fillExchangeTakeBack = () => {
    setCart((cart) => ({
      ...cart,
      adjustmentItemList: cart.selectedWarehousingItemList.map(
        (item, index) => ({
          index,
          vendor_id: item.vendor_info.id,
          vendor_name: item.vendor_info.vendor_name,
          vendor_address: item.vendor_info.vendor_address,
          warehousing_item_id: item.id,
          product_id: item.product_info.id,
          product_name: item.product_info.name,
          vendor_product_name: item.product_info.vendor_product_name,
          product_option: item.product_info.option,
          product_price: item.product_info.price,
          product_count: 0,
          product_count_max: item.count,
          product_code: item.product_info.product_code,
          is_vat_included: item.is_vat_included,
          type: undefined,
          memo: '',
        }),
      ),
    }));

    setActiveKey('2'); //  판넬 이동
  };

  const isEmpty = cart.selectedWarehousingItemList.length === 0;
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
          placeholder={t('placeholder.search product name and reference')}
        />
      </div>

      <Table
        size="small"
        loading={getWarehousingItemQuery.isLoading}
        dataSource={filteredItemList}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={{ x: 950, y: 320 }}
        rowSelection={{
          selectedRowKeys: cart.selectedWarehousingItemList.map(
            (item) => item.id,
          ),
          onSelect: selectWarehousingItem,
          onSelectAll: (_, records: WarehousingItem[]) => {
            selectAllWarehousingItem(records, totalCount);
          },
        }}
        onRow={(record) => ({
          onClick: () => {
            selectWarehousingItem(record);
          },
        })}
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
              moment(record.created_time).format('YYYY-MM-DD'),
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
      <div css={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
        <PrimaryButton
          disabled={isEmpty}
          onClick={() => {
            fillExchangeTakeBack();
          }}
        >
          {t('button.next')}
        </PrimaryButton>
      </div>
    </Collapse.Panel>
  );
}

export default WarehousingPanel;
