import React, { useState } from 'react';

import {
  SecondaryIconButton,
  TurtleSearchInput,
  TurtleTableTitle,
} from '@components/element';
import useModal from '@hooks/useModal';
import useStore from '@hooks/useStore';
import { PageContent, PageHeader, PageTitle } from '@layout/page';
import { Table } from 'antd';
import { t } from 'i18next';
import { useQuery } from 'react-query';

import transactionAPI, { TransactionItem } from '@apis/transactionAPI';

import DetailModal from './modals/DetailModal';
import AddModal from './modals/AddModal';

// 장부 페이지에서의 데이터는 많아봐야300개로 판단되어서 검색어를 입력할때마다
// api를 요청해서 데이터를 가져오지않고 프론트에서 filterVendor함수를 통해 검색결과를 보여준다.
function PageBody() {
  const { store } = useStore();
  const [itemList, setItemList] = useState<TransactionItem[]>([]);
  const [selectedRow, setSelectedRow] = useState<TransactionItem>();

  const [addModalVisible, addModalOpen, addModalClose] = useModal();
  const [detailModalVisible, detailModalOpen, detailModalClose] = useModal();

  // 장부 리스트 불러오기 요청
  const getTransactionListQuery = useQuery(
    ['getTransactionList', store.selected?.id],
    () => transactionAPI.getList({ rt_store_id: store.selected?.id }),
    {
      enabled: !!store.selected?.id,
      onSuccess: (data) => {
        setItemList([...data.data]);
      },
    },
  );

  // 거래처 검색(default : 전체)
  const filterVendor = (searchString: string) => {
    setItemList(() =>
      (getTransactionListQuery?.data?.data as TransactionItem[]).filter(
        (item) => item.vendor_name.includes(searchString),
      ),
    );
  };

  const loading = getTransactionListQuery.isLoading;

  return (
    <>
      {/*
       * 과거매입 추가 모달
       */}
      <AddModal visible={addModalVisible} closeModal={addModalClose} />

      {/*
       * 상세보기 모달
       */}
      <DetailModal
        vendor_id={selectedRow?.vendor_id}
        vendor_name={selectedRow?.vendor_name}
        visible={detailModalVisible}
        onClose={detailModalClose}
      />

      <PageHeader title={t('clearing.transaction.')} />

      <PageTitle
        title="장부 리스트"
        subTitle="거래처별 잔금 및 여러 금액 정보를 확인해보세요. 과거매입은 우측 과거매입 추가에서 자유롭게 추가 할 수 있어요!"
        buttons={[
          <SecondaryIconButton
            onClick={() => {
              addModalOpen();
            }}
          >
            과거금액 추가
          </SecondaryIconButton>,
        ]}
      />
      <PageContent>
        <Table
          size="small"
          loading={loading}
          dataSource={itemList}
          rowKey={(record) => String(record.vendor_id)}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
          }}
          onRow={(record) => ({
            onClick: () => {
              setSelectedRow({ ...record });
              detailModalOpen();
            },
          })}
          scroll={{ y: 'auto', x: 950 }}
          title={() => (
            <TurtleTableTitle
              totalCount={itemList.length ?? 0}
              rightContent={
                <TurtleSearchInput
                  placeholder={t('placeholder.input vendor name')}
                  onChange={(e) => {
                    filterVendor(e.currentTarget?.value);
                  }}
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
              align: 'right',
              title: t('table.refundAmount'),
              render: (_, record) => record.refund_amount?.toLocaleString(),
            },
            {
              ellipsis: true,
              align: 'right',
              title: t('table.overpaidAmount'),
              render: (_, record) => record.overpaid_amount?.toLocaleString(),
            },
            {
              ellipsis: true,
              align: 'right',
              title: t('table.unpaidAmount'),
              render: (_, record) => record.unpaid_amount?.toLocaleString(),
            },
          ]}
        />
      </PageContent>
    </>
  );
}

export default PageBody;
