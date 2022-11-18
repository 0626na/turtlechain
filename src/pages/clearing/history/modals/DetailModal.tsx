import clearingAPI, { ClearingSheetShow } from '@apis/clearingAPI';
import { SearchFilter, TurtleContentModal } from '@components/combine';
import { TurtleTableTitle } from '@components/element';
import TurtleStatistics from '@components/element/TurtleStatistics';
import { Table } from 'antd';
import { t } from 'i18next';
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';

interface Props {
  visible: boolean;
  onClose(): void;
  selectedRow?: ClearingSheetShow;
}

function DetailModal({ visible, onClose, selectedRow }: Props) {
  const [searchQuery, setSearchQuery] = useState({
    search_string: '',
  });

  const getClearingItemQuery = useQuery(
    ['getClearingItemQuery'], //
    () =>
      clearingAPI.getItem({
        sheet_id: selectedRow?.id as number,
        page_size: 10000,
      }),
    {
      enabled: visible && !!selectedRow?.id,
    },
  );

  const filteredList = useMemo(
    () =>
      getClearingItemQuery.data?.data.item_list.filter((item) =>
        item.vendor_name.includes(searchQuery.search_string),
      ),
    [getClearingItemQuery.data, searchQuery],
  );

  useEffect(() => {
    setSearchQuery({ search_string: '' });
  }, [visible]);

  return (
    <TurtleContentModal
      size="large"
      visible={visible}
      title="결제내역 상세보기"
      onClose={onClose}
    >
      <TurtleStatistics
        value={[
          {
            title: t('table.paymentStatus'),
            value: t(`clearing.status.${selectedRow?.status}`).toString(),
          },
          {
            title: t('table.paymentRequestDate'),
            value: `${selectedRow?.request_date}`,
          },
          {
            title: t('table.paymentCompleteDate'),
            value: `${selectedRow?.complete_date ?? '-'}`,
          },
          {
            title: t('table.paymentPrice'),
            value: `${selectedRow?.total_deposit_amount}`,
          },
          {
            title: t('table.totalVendorCount'),
            value: `${getClearingItemQuery.data?.data.total_count}개`,
          },
        ]}
      />
      <Table
        size="small"
        loading={getClearingItemQuery.isLoading}
        dataSource={filteredList}
        rowKey={(record) => record.id}
        scroll={{ x: 950, y: 'auto' }}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
        title={() => (
          <TurtleTableTitle
            totalCount={getClearingItemQuery.data?.data.total_count ?? 0}
            searchCount={filteredList?.length ?? 0}
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
            title: t('table.vendorName'),
            render: (_, record) => record.vendor_name,
          },
          {
            ellipsis: true,
            title: t('table.vendorAddress'),
            render: (_, record) => record.vendor_address,
          },
          {
            ellipsis: true,
            title: t('table.accountInfo'),
            render: (_, record) =>
              `${record.bank} ${record.account_number} ${record.account_holder}`,
          },
          {
            ellipsis: true,
            align: 'right',
            title: t('table.paymentPrice'),
            render: (_, record) =>
              `(부가세 ${(
                record.total_amount - record.supply_amount
              ).toLocaleString()}원 포함) ${record.total_amount.toLocaleString()}`,
          },
        ]}
      />
    </TurtleContentModal>
  );
}

export default DetailModal;
