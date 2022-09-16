import { SearchFilter } from '@components/combine';
import { TurtleIcon, TurtleTableTitle } from '@components/element';
import useWarehousingCart from '@hooks/useWarehousingCart';
import { pricePattern } from '@utils/pattern';
import { Checkbox, InputNumber, Table, TabPaneProps, Tabs } from 'antd';
import { t } from 'i18next';
import React, { useMemo, useState } from 'react';

interface Props extends TabPaneProps {
  loading: boolean;
}

function SuccessTab({ loading, ...props }: Props) {
  const { cart, updatePrice, updateCount, updateIsReserved, remove } =
    useWarehousingCart();
  const [searchQuery, setSearchQuery] = useState({
    type: 'name',
    search_string: '',
  });

  const reservedStyle = (needUpdate: boolean) => ({
    style: {
      backgroundColor: needUpdate ? '#F2F2F3' : 'transparent',
    },
  });

  const filteredList = useMemo(
    () =>
      cart.successList.filter((item) => {
        const { type, search_string } = searchQuery;
        if (type === 'name') {
          return item.product_name.toLowerCase().includes(search_string);
        }
        if (type === 'vendor_product_name') {
          return item.vendor_product_name.toLowerCase().includes(search_string);
        }
        if (type === 'vendor_name') {
          return item.vendor_name.toLowerCase().includes(search_string);
        }
        return true;
      }),
    [cart.successList, searchQuery],
  );

  return (
    <Tabs.TabPane {...props}>
      <Table
        size="small"
        loading={loading}
        dataSource={filteredList}
        rowKey={(record) => record.index as number}
        pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
        scroll={{ x: 1400, y: 'auto' }}
        title={() => (
          <TurtleTableTitle
            totalCount={cart.successList.length}
            vendorCount={1}
            searchCount={filteredList.length}
            searchAmount={filteredList.reduce(
              (acc, cur) => acc + cur.price * cur.count,
              0,
            )}
            rightContent={
              <SearchFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            }
          />
        )}
        columns={[
          {
            ellipsis: true,
            width: 150,
            title: t('table.vendorName'),
            onCell: (record) => reservedStyle(record.maybe_reserved),
            render: (_, record) => record.vendor_name,
          },
          {
            ellipsis: true,
            width: 150,
            title: t('table.vendorAddress'),
            onCell: (record) => reservedStyle(record.maybe_reserved),
            render: (_, record) => record.vendor_address,
          },
          {
            ellipsis: true,
            width: 250,
            title:
              // <Tooltip
              //   title={
              //     <Typography.Text
              //       style={{ color: 'white' }}
              //       onClick={() => setMessageVisible(false)}
              //     >
              //       {reservedMessage}
              //     </Typography.Text>
              //   }
              //   visible={messageVisible}
              // >
              t('table.productName'),
            // </Tooltip>
            onCell: (record) => reservedStyle(record.maybe_reserved),
            render: (_, record) => record.product_name,
          },
          {
            ellipsis: true,
            width: 200,
            title: t('table.vendorProductName'),
            onCell: (record) => reservedStyle(record.maybe_reserved),
            render: (_, record) => record.vendor_product_name,
          },
          {
            ellipsis: true,
            width: 150,
            title: t('table.productCode'),
            onCell: (record) => reservedStyle(record.maybe_reserved),
            render: (_, record) => record.product_code,
          },
          {
            ellipsis: true,
            width: 150,
            title: t('table.option'),
            onCell: (record) => reservedStyle(record.maybe_reserved),
            render: (_, record) => record.product_option,
          },
          {
            ellipsis: true,
            width: 100,
            title: t('table.warehouseName'),
            onCell: (record) => reservedStyle(record.maybe_reserved),
            render: (_, record) => record.store_house,
          },
          {
            ellipsis: true,
            width: 120,
            align: 'right',
            title: t('table.price'),
            onCell: (record) => reservedStyle(record.maybe_reserved),
            render: (_, record) => (
              <InputNumber
                size="small"
                step={1000}
                value={record.price}
                formatter={(value) => `${value}`.replace(pricePattern, ',')}
                min={0}
                onChange={(value) => {
                  updatePrice(record, value);
                }}
              />
            ),
          },
          {
            ellipsis: true,
            align: 'right',
            width: 120,
            title: t('table.warehousingCount'),
            onCell: (record) => reservedStyle(record.maybe_reserved),
            render: (_, record) => (
              <InputNumber
                size="small"
                min={1}
                value={record.count}
                onChange={(value) => {
                  updateCount(record, value);
                }}
              />
            ),
          },
          {
            ellipsis: true,
            width: 100,
            align: 'right',
            title: t('table.isReserveWarehousing'),
            onCell: (record) => reservedStyle(record.maybe_reserved),
            render: (_, record) => (
              <Checkbox
                checked={record.is_reserved}
                onChange={() => {
                  updateIsReserved(record);
                }}
              />
            ),
          },
          {
            ellipsis: true,
            width: 50,
            onCell: (record) => reservedStyle(record.maybe_reserved),
            render: (_, record) => (
              <TurtleIcon
                name="delete"
                onClick={() => {
                  remove(record);
                }}
              />
            ),
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default SuccessTab;
