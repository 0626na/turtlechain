import adjustmentAPI, {
  AdjustmentItemShow,
  RequestGetList,
} from '@apis/adjustmentAPI';
import { SearchFilter, TurtleContentModal } from '@components/combine';
import InputModal from '@components/combine/modal/InputModal';
import {
  MemoIcon,
  SecondaryButton,
  TurtleCard,
  TurtleDropdown,
  TurtleIcon,
  TurtleTableTitle,
} from '@components/element';
import { css } from '@emotion/react';

import useModal from '@hooks/useModal';
import useStore from '@hooks/useStore';
import { PageContent, PageHeader, PageTitle } from '@layout/page';
import { Button, message, Pagination, Popconfirm, Row, Table } from 'antd';
import { t } from 'i18next';
import moment from 'moment';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';

function PageBody() {
  const { store } = useStore();
  const [selectedRow, setSelectedRow] = useState<AdjustmentItemShow>();
  const [addReserveModalVisible, addReserveModalOpen, addReserveModalClose] =
    useModal();

  const [memoModalVisible, memoModalOpen, memoModalClose] = useModal();

  const [
    addExchangeRefundModalVisible,
    addExchangeRefundModalOpen,
    addExchangeRefundModalClose,
  ] = useModal();

  // 매입조정 검색 조건
  const [searchQuery, setSearchQuery] = useState<RequestGetList>({
    rt_store_id: store.selected?.id,
    is_cleared: '',
    start_date: moment().subtract(1, 'weeks').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
    page: 1,
  });

  // 매입조정 리스트 요청
  const getAdjustmentListQuery = useQuery(
    ['getAdjustmentList', searchQuery],
    () => adjustmentAPI.getList(searchQuery),
    {
      enabled: !!searchQuery.rt_store_id,
    },
  );

  // 매입조정 수정, 삭제 요청
  const updateAdjustmentMutation = useMutation(adjustmentAPI.update, {
    onSuccess: (data) => {
      message.success(
        data.is_inactive
          ? t('message.success delete')
          : t('message.success update'),
      );
      setSearchQuery({ ...searchQuery, page: 1 });
      getAdjustmentListQuery.refetch();
    },
  });

  const loading = getAdjustmentListQuery.isLoading;

  return (
    <>
      {/**
       * 메모 수정 모달
       */}
      <InputModal
        visible={memoModalVisible}
        loading={loading}
        onCancel={loading ? () => {} : memoModalClose}
        defaultValue={selectedRow?.memo}
        onOk={(value) => {
          updateAdjustmentMutation.mutate({
            id: selectedRow?.id as number,
            memo: value,
          });
        }}
        title="메모"
        description={[
          '해당 건과 관련해 중요한 내용을 기록해보세요.',
          '개인 메모로도 자유롭게 활용할 수 있어요👀',
        ]}
        placeholder="ex. 영수증 이중으로 확인 또 확인!"
      />

      {/*
       * 미송상품 추가 모달
       */}
      <TurtleContentModal
        title="미송상품 추가"
        visible={addReserveModalVisible}
        onClose={addReserveModalClose}
      ></TurtleContentModal>

      {/*
       * 교환/반품 추가 모달
       */}
      <TurtleContentModal
        title="교환/반품 추가"
        visible={addExchangeRefundModalVisible}
        onClose={addExchangeRefundModalClose}
      ></TurtleContentModal>

      <PageHeader title="교환/반품/미송" />

      <PageTitle
        title="매입조정 현황"
        buttons={[
          <TurtleDropdown
            items={[
              {
                key: '0',
                label: '교환/반품 추가',
                icon: <TurtleIcon name="exchangeRefund" />,
                onClick() {
                  addExchangeRefundModalOpen();
                },
              },
              {
                key: '1',
                label: '미송상품 추가',
                icon: <TurtleIcon name="reserve" />,
                onClick() {
                  addReserveModalOpen();
                },
              },
            ]}
            triggerButton={<SecondaryButton>매입조정 추가</SecondaryButton>}
          />,
        ]}
      />

      <PageContent>
        {/*
         *  매입조정 현황
         */}
        <TurtleCard
          value={[
            {
              color: 'orange',
              title: t('adjustment.pending'),
              count:
                getAdjustmentListQuery.data?.data.adjustment_summary
                  ?.not_cleared.count ?? 0,
              price:
                getAdjustmentListQuery.data?.data.adjustment_summary
                  ?.not_cleared.price ?? 0,
            },
            {
              color: 'geekblue',
              title: t('adjustment.confirmed'),
              count:
                getAdjustmentListQuery.data?.data.adjustment_summary?.cleared
                  .count ?? 0,
              price:
                getAdjustmentListQuery.data?.data.adjustment_summary?.cleared
                  .price ?? 0,
            },
          ]}
        />

        <Table
          size="small"
          loading={loading}
          dataSource={getAdjustmentListQuery.data?.data.adjustment_list}
          rowKey={(record) => record.id}
          pagination={false}
          scroll={{ x: 1400, y: 'auto' }}
          title={() => (
            <TurtleTableTitle
              totalCount={
                getAdjustmentListQuery.data?.data.adjustment_list?.length ?? 0
              }
              rightContent={
                <SearchFilter
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              }
            />
          )}
          footer={() => (
            <Row justify="center">
              <Pagination
                size="small"
                total={
                  getAdjustmentListQuery.data?.data.adjustment_list.length ?? 0
                }
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
              width: 100,
              title: t('table.progress'),
              render: (_, record) => {
                const { is_cleared } = record;
                return is_cleared ? (
                  <div
                    css={css`
                      background-color: #ddf3f5;
                      color: #00aab5;
                    `}
                  >
                    마감
                  </div>
                ) : (
                  <div
                    css={css`
                      background-color: #fbefe6;
                      color: #dd7a32;
                    `}
                  >
                    대기
                  </div>
                );
              },
            },
            {
              ellipsis: true,
              width: 150,
              title: t('table.createDate'),
              render: (_, record) => record.created_date,
            },
            {
              ellipsis: true,
              width: 150,
              title: t('table.type'),
              render: (_, record) => record.type,
            },
            {
              ellipsis: true,
              width: 200,
              title: t('table.vendorName'),
              render: (_, record) => record.vendor_info.vendor_name,
            },
            {
              ellipsis: true,
              width: 120,
              align: 'center',
              title: t('table.productName'),
              render: (_, record) => record.product_info.name,
            },
            {
              ellipsis: true,
              width: 120,
              align: 'center',
              title: t('table.vendorProductName'),
              render: (_, record) => record.product_info.vendor_product_name,
            },
            {
              width: 70,
              align: 'center',
              title: t('table.option'),
              render: (_, record) => record.product_info.option,
            },
            {
              width: 45,
              title: t('table.price'),
              align: 'center',
              render: (record) =>
                (record.product_info.price * record.count).toLocaleString(),
            },
            {
              ellipsis: true,
              width: 200,
              title: t('table.proccessed totalCount'),
              render: (_, record) =>
                `${record.count - record.count_left} / ${record.count}`,
            },
            {
              ellipsis: true,
              width: 200,
              title: t('table.memo'),
              render: (_, record) => (
                <MemoIcon
                  onClick={() => {
                    setSelectedRow(record);
                    memoModalOpen();
                  }}
                  value={record.memo}
                />
              ),
            },
            {
              ellipsis: true,
              width: 30,
              align: 'center',
              render: (_, record) => <Button>처리하기</Button>,
            },
            {
              ellipsis: true,
              width: 30,
              align: 'center',
              render: (_, record) => (
                <Popconfirm
                  title="정말 삭제하시겠습니까?"
                  okText="네"
                  cancelText="취소"
                  onCancel={(e) => {
                    e?.stopPropagation();
                  }}
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    // updateAdjustmentQuery.mutate({
                    //   id: record.id,
                    //   is_inactive: 1,
                    // });
                    updateAdjustmentMutation.mutate({
                      id: record.id,
                      is_inactive: 1,
                    });
                  }}
                >
                  <TurtleIcon name="delete" />
                </Popconfirm>
              ),
            },
          ]}
        />
      </PageContent>
    </>
  );
}

export default PageBody;
