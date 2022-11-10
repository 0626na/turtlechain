import clearingAPI, {
  ClearingItemShow,
  RequestGetItem,
} from '@apis/clearingAPI';
import { TurtleContentModal } from '@components/combine';
import {
  TurtleFormSearchInput,
  TurtlePrimaryRangePicker,
  TurtleTableTitle,
} from '@components/element';
import { css } from '@emotion/react';
import useStore from '@hooks/useStore';
import { Pagination, Row, Table } from 'antd';
import { t } from 'i18next';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

interface Props {
  visible: boolean;
  closeModal: () => void;
  onClickSelect: (record: ClearingItemShow) => void;
}

function SearchClearingModal({ visible, closeModal, onClickSelect }: Props) {
  const { store } = useStore();
  const [searchQuery, setSearchQuery] = useState<RequestGetItem>({
    rt_store_id: store.selected?.id as number,
    store_name: undefined,
    start_date: moment().subtract(1, 'week').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
    page_size: 1,
  });

  // 정산아이템 불러오기 요청
  const getClearingItemQuery = useQuery(
    ['getClearingItemQuery', searchQuery],
    () => clearingAPI.getItem(searchQuery),
    {
      enabled: visible && !!searchQuery.store_name,
    },
  );

  const selectPage = useCallback(
    (page: number) => {
      setSearchQuery({ ...searchQuery, page_size: page });
    },
    [searchQuery],
  );

  //검색조건 초기화
  const resetSearchQuery = useCallback(() => {
    setSearchQuery({
      rt_store_id: store.selected?.id as number,
      store_name: undefined,
      start_date: moment().subtract(1, 'week').format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
      page_size: 1,
    });
  }, [store.selected?.id]);

  useEffect(() => {
    //모달이 닫힐때 검색조건 초기화
    if (visible) return;
    resetSearchQuery();
  }, [resetSearchQuery, visible]);

  return (
    <div css={{ zIndex: 3, position: 'relative' }}>
      <TurtleContentModal
        size="large"
        visible={visible}
        title="결제내역 선택"
        onClose={closeModal}
      >
        <div css={inputContainer}>
          <TurtleFormSearchInput
            value={searchQuery.store_name}
            onChange={(e) => {
              setSearchQuery((searchQuery) => ({
                ...searchQuery,
                store_name: e.target.value,
              }));
            }}
            placeholder="거래처명을 입력해주세요."
          />
        </div>

        <Table
          size="small"
          scroll={{ y: 800 }}
          pagination={false}
          loading={getClearingItemQuery.isLoading}
          dataSource={getClearingItemQuery.data?.data.item_list}
          rowKey={(record) => record.id}
          onRow={(record) => {
            return {
              onClick: () => {
                onClickSelect(record);
              },
            };
          }}
          title={() => (
            <TurtleTableTitle
              totalCount={getClearingItemQuery.data?.data.total_count ?? 0}
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
          footer={() => (
            <Row justify="center">
              <Pagination
                size="small"
                total={getClearingItemQuery.data?.data.total_count}
                showSizeChanger={false}
                current={searchQuery.page_size}
                onChange={selectPage}
              />
            </Row>
          )}
          columns={[
            {
              ellipsis: true,
              width: '20%',
              title: t('clearing.complete date'),
              render: (_, record) => record.complete_date,
            },
            {
              ellipsis: true,
              width: '20%',
              title: t('table.vendorName'),
              render: (_, record) => record.vendor_name,
            },
            {
              ellipsis: true,
              width: '20%',
              title: t('table.vendorAddress'),
              render: (_, record) => record.vendor_address,
            },
            {
              ellipsis: true,
              title: t('table.accountInfo'),
              render: (_, record) =>
                `${record.ws_store_id.store_account[0].bank} ${record.ws_store_id.store_account[0].account_number} ${record.ws_store_id.store_account[0].account_holder}`,
            },
            {
              ellipsis: true,
              align: 'right',
              title: t('clearing.price'),
              render: (_, record) => (
                <span>
                  <span>
                    {`(부가세 ${(
                      record.clearing_amount * 0.1
                    ).toLocaleString()}원 포함)`}{' '}
                  </span>
                  <span>{record.clearing_amount.toLocaleString()}</span>
                </span>
              ),
            },
          ]}
        />
      </TurtleContentModal>
    </div>
  );
}

const inputContainer = css({
  maxWidth: 320,
  marginBottom: 20,
});

export default SearchClearingModal;
