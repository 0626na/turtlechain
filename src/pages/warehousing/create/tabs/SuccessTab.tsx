import { SearchFilter } from '@components/combine';
import {
  TurtleConfirmModal,
  TurtleIcon,
  TurtleTableNumberInput,
  TurtleTableTitle,
} from '@components/element';
import useWarehousingCart from '@hooks/useWarehousingCart';
import { pricePattern } from '@utils/pattern';
import {
  Checkbox,
  InputNumber,
  Table,
  TabPaneProps,
  Tabs,
  Tooltip,
} from 'antd';
import { t } from 'i18next';
import React, { useEffect, useMemo, useState } from 'react';
import useModal from '@hooks/useModal';
import { WarehousingItemConnect } from '@apis/warehousingAPI';

interface Props extends TabPaneProps {
  loading: boolean;
}

function SuccessTab({ loading, ...props }: Props) {
  const {
    cart,
    updatePrice,
    updateCount,
    updateIsReserved,
    remove,
    existMaybeReserve,
    vendorCount,
  } = useWarehousingCart();
  const [searchQuery, setSearchQuery] = useState({
    search_string: '',
  });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [removeModalVisible, openRemoveModal, closeRemoveModal] = useModal();
  const [selectedRow, setSelectedRow] = useState<WarehousingItemConnect>();

  const filteredList = useMemo(
    () =>
      cart.successList.filter(
        (item) =>
          item.product_name.toLowerCase().includes(searchQuery.search_string) ||
          item.vendor_product_name
            .toLowerCase()
            .includes(searchQuery.search_string) ||
          item.vendor_name.toLowerCase().includes(searchQuery.search_string),
      ),
    [cart.successList, searchQuery],
  );

  const handleRemove = (target: WarehousingItemConnect) => {
    remove(target);
    closeRemoveModal();
  };

  useEffect(() => {
    if (existMaybeReserve) {
      setTooltipVisible(true);
    }
  }, [existMaybeReserve]);

  return (
    <>
      {/*
       * 삭제 확인 모달
       */}
      <TurtleConfirmModal
        title="정말 삭제할까요?"
        description={['삭제 후에는 이전으로 되돌릴 수 없어요.']}
        okText="삭제"
        visible={removeModalVisible}
        onCancel={closeRemoveModal}
        onOk={() => {
          handleRemove(selectedRow as WarehousingItemConnect);
        }}
      />
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
              vendorCount={vendorCount}
              searchCount={filteredList.length}
              searchAmount={filteredList.reduce(
                (acc, cur) => acc + cur.price * cur.count,
                0,
              )}
              rightContent={
                <SearchFilter
                  placeholder="거래처명, 상품명, 거래처 상품명 검색"
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
              onCell: (record) => ({
                style: {
                  backgroundColor: record.maybe_reserved
                    ? '#F2F2F3'
                    : 'transparent',
                },
              }),
              render: (_, record) => record.vendor_name,
            },
            {
              ellipsis: true,
              width: 150,
              title: t('table.vendorAddress'),
              onCell: (record) => ({
                style: {
                  backgroundColor: record.maybe_reserved
                    ? '#F2F2F3'
                    : 'transparent',
                },
              }),
              render: (_, record) => record.vendor_address,
            },
            {
              ellipsis: true,
              width: 250,
              title: (
                <div onClick={() => setTooltipVisible(false)}>
                  <Tooltip
                    visible={tooltipVisible}
                    title={
                      <span>
                        당일 입고에 미송상품이 있네요!
                        <br />
                        누락되지 않도록 다시 한번 확인해주세요.
                      </span>
                    }
                    zIndex={1}
                  >
                    {t('table.productName')}
                  </Tooltip>
                </div>
              ),
              onCell: (record) => ({
                style: {
                  backgroundColor: record.maybe_reserved
                    ? '#F2F2F3'
                    : 'transparent',
                },
              }),
              render: (_, record) => record.product_name,
            },
            {
              ellipsis: true,
              width: 200,
              title: t('table.vendorProductName'),
              onCell: (record) => ({
                style: {
                  backgroundColor: record.maybe_reserved
                    ? '#F2F2F3'
                    : 'transparent',
                },
              }),
              render: (_, record) => record.vendor_product_name,
            },
            {
              ellipsis: true,
              width: 150,
              title: t('table.productCode'),
              onCell: (record) => ({
                style: {
                  backgroundColor: record.maybe_reserved
                    ? '#F2F2F3'
                    : 'transparent',
                },
              }),
              render: (_, record) => record.product_code,
            },
            {
              ellipsis: true,
              width: 150,
              title: t('table.option'),
              onCell: (record) => ({
                style: {
                  backgroundColor: record.maybe_reserved
                    ? '#F2F2F3'
                    : 'transparent',
                },
              }),
              render: (_, record) => record.product_option,
            },
            {
              ellipsis: true,
              width: 100,
              title: t('table.warehouseName'),
              onCell: (record) => ({
                style: {
                  backgroundColor: record.maybe_reserved
                    ? '#F2F2F3'
                    : 'transparent',
                },
              }),
              render: (_, record) => record.store_house,
            },
            {
              ellipsis: true,
              width: 120,
              align: 'right',
              title: t('table.price'),
              onCell: (record) => ({
                style: {
                  backgroundColor: record.maybe_reserved
                    ? '#F2F2F3'
                    : 'transparent',
                },
              }),
              render: (_, record) => (
                <TurtleTableNumberInput
                  value={record.price}
                  formatter={(value) => `${value}`.replace(pricePattern, ',')}
                  min={0}
                  onChange={(value) => {
                    updatePrice(record, Number(value));
                  }}
                />
              ),
            },
            {
              ellipsis: true,
              align: 'right',
              width: 120,
              title: t('table.warehousingCount'),
              onCell: (record) => ({
                style: {
                  backgroundColor: record.maybe_reserved
                    ? '#F2F2F3'
                    : 'transparent',
                },
              }),
              render: (_, record) => (
                <TurtleTableNumberInput
                  min={1}
                  value={record.count}
                  onChange={(value) => {
                    updateCount(record, Number(value));
                  }}
                />
              ),
            },
            {
              ellipsis: true,
              width: 100,
              align: 'center',
              title: t('table.isReserveWarehousing'),
              onCell: (record) => ({
                style: {
                  backgroundColor: record.maybe_reserved
                    ? '#F2F2F3'
                    : 'transparent',
                },
              }),
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
              onCell: (record) => ({
                style: {
                  backgroundColor: record.maybe_reserved
                    ? '#F2F2F3'
                    : 'transparent',
                },
                onClick: () => {
                  setSelectedRow(record);
                  openRemoveModal();
                },
              }),
              render: (_) => <TurtleIcon name="delete" />,
            },
          ]}
        />
      </Tabs.TabPane>
    </>
  );
}

export default SuccessTab;
