import React, { useEffect, useState } from 'react';

import {
  SecondaryButton,
  TurtleSearchInput,
  TurtleTableTitle,
} from '@components/element';
import useModal from '@hooks/useModal';
import useStore from '@hooks/useStore';
import { PageContent, PageHeader, PageTitle } from '@layout/page';
import { Pagination, Row, Table } from 'antd';
import { t } from 'i18next';
import { useQuery } from 'react-query';

import clearingAPI, {
  ClearingInfo,
  RequestGetOverpaidBalanceList,
} from '@apis/clearingAPI';
import DetailModal from './modals/DetailModal';
import moment from 'moment';
import AddModal from './modals/AddModal';

function PageBody() {
  const [selectedRow, setSelectedRow] = useState<ClearingInfo>();
  const { store } = useStore();
  const [searchQuery, setSearchQuery] = useState<RequestGetOverpaidBalanceList>(
    {
      rt_store_id: undefined,
      balance_type: 'balance',
      search_string: '',
      page: 1,
    },
  );

  const [addModalVisible, addModalOpen, addModalClose] = useModal();
  const [detailModalVisible, detailModalOpen, detailModalClose] = useModal();

  // 장부 리스트 불러오기 요청
  const getOverpaidBalanceListQuery = useQuery(
    ['getOverpaidBalanceList', searchQuery],
    () => clearingAPI.getOverpaidBalanceList(searchQuery),
    {
      enabled: !!searchQuery.rt_store_id,
    },
  );

  const loading = getOverpaidBalanceListQuery.isLoading;

  // 쇼핑몰 바뀔때 상품 리스트 재검색
  useEffect(() => {
    setSearchQuery((searchQuery) => ({
      ...searchQuery,
      rt_store_id: store.selected?.id as number,
    }));
  }, [store.selected?.id]);

  return (
    <>
      {/*
       * 과거매입 모달
       */}
      <AddModal visible={addModalVisible} closeModal={addModalClose} />
      {/*
       * 상세보기 모달
       */}
      <DetailModal
        selectedRow={selectedRow as ClearingInfo}
        visible={detailModalVisible}
        onClose={detailModalClose}
      />

      <PageHeader title="장부" />

      <PageTitle
        title="장부 리스트"
        subTitle="거래처를 선택하고 잔금 및 여러 금액 정보를 확인해보세요."
        buttons={[
          <SecondaryButton
            onClick={() => {
              addModalOpen();
            }}
          >
            과거매입 추가
          </SecondaryButton>,
        ]}
      />
      <PageContent>
        <Table
          size="small"
          loading={loading}
          dataSource={getOverpaidBalanceListQuery.data?.item_list}
          rowKey={(record) => String(record.vendor_info.id)}
          onRow={(record) => ({
            onClick: () => {
              setSelectedRow(record);
              detailModalOpen();
            },
          })}
          pagination={false}
          scroll={{ y: 'auto', x: 1400 }}
          title={() => (
            <TurtleTableTitle
              totalCount={
                getOverpaidBalanceListQuery.data?.item_list.length ?? 0
              }
              rightContent={
                <TurtleSearchInput
                  placeholder="거래처명을 입력하세요"
                  onChange={(e) => {
                    console.log(e.currentTarget.value);
                    setSearchQuery((searchQuery) => ({
                      ...searchQuery,
                      search_string: e.currentTarget?.value,
                    }));
                  }}
                />
              }
            />
          )}
          footer={() => (
            <Row justify="center">
              <Pagination
                size="small"
                total={getOverpaidBalanceListQuery.data?.item_list.length ?? 0}
                showSizeChanger={false}
                current={searchQuery.page}
                onChange={(page) => {
                  setSearchQuery({ ...searchQuery, page });
                }}
              />
            </Row>
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
              title: '사용가능 금액',
              render: (_, record) => record.overpaid_amount?.toLocaleString(),
            },

            // {
            //   ellipsis: true,
            //   title: '결제요청 금액',
            //   render: (_, record) => record.overpaid_amount?.toLocaleString(),
            // },
            {
              ellipsis: true,
              title: '환불예정 금액',
              render: (_, record) => record.refund_amount.toLocaleString(),
            },
          ]}
        />
      </PageContent>
    </>
  );
}

export default PageBody;
