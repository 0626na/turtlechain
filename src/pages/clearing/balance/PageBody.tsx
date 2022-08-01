import moment from 'moment';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { Table } from 'antd';
import { TurtleTableTitle } from '@components/common';
import { MainContent, MenuBar } from '@layout/page';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { storeState } from '@store/storeState';
import clearingAPI, {
  ClearingInfo,
  RequestGetOverpaidBalanceList,
} from '@apis/clearingAPI';
import DetailModal from './DetailModal';

function PageBody() {
  const store = useRecoilValue(storeState);
  const [searchQuery, setSearchQuery] = useState<RequestGetOverpaidBalanceList>(
    {
      rt_store_id: store.id!,
      balance_type: 'balance',
    },
  );

  const [selectedRow, selectRow] = useState<ClearingInfo>();
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const getRetailerStoreOverpaidBalanceListQuery = useQuery(
    ['getRetailerStoreOverpaidBalanceListQuery', searchQuery],
    () => clearingAPI.getOverpaidBalanceList(searchQuery),
    {
      enabled: !!searchQuery.rt_store_id,
    },
  );

  const openDetailModal = useCallback((record) => {
    selectRow(record);
    setDetailModalVisible(true);
  }, []);

  useEffect(() => {
    setSearchQuery({
      rt_store_id: store.id!,
      balance_type: 'balance',
    });
  }, [store.id]);

  return (
    <>
      <MenuBar />

      <MainContent title={t('clearing.balance lists')}>
        <Table
          size="small"
          dataSource={getRetailerStoreOverpaidBalanceListQuery.data?.item_list}
          loading={getRetailerStoreOverpaidBalanceListQuery.isLoading}
          pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
          rowKey={(record) => record.vendor_info.id}
          scroll={{ y: 'auto' }}
          onRow={(record) => ({
            onClick: () => {
              openDetailModal(record);
            },
          })}
          title={() => (
            <TurtleTableTitle
              count={
                getRetailerStoreOverpaidBalanceListQuery.data?.item_list
                  .length ?? 0
              }
            ></TurtleTableTitle>
          )}
          columns={[
            {
              ellipsis: true,
              width: 150,
              align: 'center',
              title: t('clearing.recent date'),
              render: (_, record) =>
                moment(record.created_date).format('YYYY-MM-DD'),
            },
            {
              ellipsis: true,
              title: t('vendor.name'),
              render: (_, record) => record.vendor_info.vendor_name,
            },
            {
              ellipsis: true,
              title: t('vendor.address'),
              render: (_, record) => record.vendor_info.vendor_address,
            },
            {
              ellipsis: true,
              title: '환불 받을 금액',
              render: (_, record) => record.refund_amount.toLocaleString(),
            },
            {
              ellipsis: true,
              title: '사용 가능 금액',
              render: (_, record) => record.overpaid_amount?.toLocaleString(),
            },
            {
              ellipsis: true,
              width: 500,
              title: '처리 내용',
              render: (_, record) => record.memo,
            },
          ]}
        />
      </MainContent>

      <DetailModal
        visible={detailModalVisible}
        closeModal={() => {
          setDetailModalVisible(false);
        }}
        selectedRow={selectedRow}
      />
    </>
  );
}

export default PageBody;
