import React, { useEffect, useState } from 'react';
import warehousingAPI, {
  RequestGetSheet,
  WarehousingSheet,
} from '@apis/warehousingAPI';
import {
  TurtleConfirmModal,
  TurtleIcon,
  TurtlePrimaryRangePicker,
  TurtleSearchSelect,
  TurtleTableTitle,
} from '@components/element';
import useStore from '@hooks/useStore';
import { PageContent, PageTitle } from '@layout/page';
import { Button, message, Space, Table, Tag } from 'antd';
import { t } from 'i18next';
import moment from 'moment';
import { useMutation, useQuery } from 'react-query';
import useModal from '@hooks/useModal';
import DetailModal from './modals/DetailModal';

function PageBody() {
  const { store } = useStore();
  const [searchQuery, setSearchQuery] = useState<RequestGetSheet>({
    rt_store_id: -1,
    is_confirmed: '',
    start_date: moment().subtract(1, 'months').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
    page: 1,
  });

  const [selectedRow, selectRow] = useState<WarehousingSheet>();
  const [detailModalVisible, openDetailModal, closeDetailModal] = useModal();
  const [removeModalVisible, openRemoveModal, closeRemoveModal] = useModal();
  const [confirmModalVisible, openConfirmModal, closeConfirmModal] = useModal();
  const [cancelModalVisible, openCancelModal, closeCancelModal] = useModal();

  // 입고장 리스트 요청
  const getWarehousingSheetQuery = useQuery(
    ['getWarehousingSheetQuery', searchQuery],
    () => warehousingAPI.getSheet(searchQuery),
    {
      enabled: searchQuery.rt_store_id !== -1,
    },
  );

  // 입고장 수정 요청
  const updateSheetMutation = useMutation(warehousingAPI.updateSheet, {
    onSuccess: () => {
      message.success('입고서를 수정되었습니다.');
      closeConfirmModal();
      closeCancelModal();
      getWarehousingSheetQuery.refetch();
    },
  });

  // 입고장 삭제 요청
  const removeSheetMutation = useMutation(warehousingAPI.removeSheet, {
    onSuccess: () => {
      message.success('입고서를 삭제했습니다.');
      closeRemoveModal();
      getWarehousingSheetQuery.refetch();
    },
  });

  // 쇼핑몰 바뀔때 마다 입고서 리스트 재요청
  useEffect(() => {
    setSearchQuery((searchQuery) => ({
      ...searchQuery,
      rt_store_id: store.selected?.id ?? -1,
    }));
  }, [store.selected]);

  const loading =
    getWarehousingSheetQuery.isLoading ||
    updateSheetMutation.isLoading ||
    removeSheetMutation.isLoading;

  return (
    <>
      {/**
       * 상세보기 모달
       */}
      <DetailModal
        visible={detailModalVisible}
        onClose={closeDetailModal}
        selectedRow={selectedRow}
      />
      {/**
       * 삭제 확인 모달
       */}
      <TurtleConfirmModal
        visible={removeModalVisible}
        title="정말 삭제할까요?"
        description={['삭제 후에는 이전으로 되돌릴 수 없어요.']}
        onCancel={closeRemoveModal}
        onOk={() => {
          removeSheetMutation.mutate({
            id: selectedRow?.id as number,
            is_inactive: true,
          });
        }}
        cancelText="아니요"
        okText="네"
        loading={loading}
      />
      {/**
       * 마감 확인 모달
       */}
      <TurtleConfirmModal
        visible={confirmModalVisible}
        title="정말 마감할까요?"
        description={['해당 입고서를 마감합니다.']}
        onCancel={closeConfirmModal}
        onOk={() => {
          updateSheetMutation.mutate({
            id: selectedRow?.id as number,
            is_confirmed: true,
          });
        }}
        cancelText="아니요"
        okText="네"
        loading={loading}
      />
      {/**
       * 마감 취소 확인 모달
       */}
      <TurtleConfirmModal
        visible={cancelModalVisible}
        title="정말 취소할까요?"
        description={['해당 입고서의 마감을 취소합니다.']}
        onCancel={closeConfirmModal}
        onOk={() => {
          updateSheetMutation.mutate({
            id: selectedRow?.id as number,
            is_confirmed: false,
          });
        }}
        cancelText="아니요"
        okText="네"
        loading={loading}
      />
      {/**
       * 페이지
       */}
      <PageTitle title="입고서 리스트" />
      <PageContent>
        <Table
          size="small"
          loading={getWarehousingSheetQuery.isLoading}
          dataSource={getWarehousingSheetQuery.data?.sheet_list}
          rowKey={(record) => record.id}
          pagination={false}
          scroll={{ x: 1400, y: 'auto' }}
          onRow={(record) => ({
            onClick: () => {
              selectRow(record);
              openDetailModal();
            },
          })}
          title={() => (
            <TurtleTableTitle
              totalCount={getWarehousingSheetQuery.data?.total_count ?? 0}
              rightContent={
                <Space>
                  <TurtleSearchSelect
                    value={String(searchQuery.is_confirmed)}
                    onChange={(is_confirmed) => {
                      setSearchQuery({
                        ...searchQuery,
                        is_confirmed:
                          is_confirmed === '' ? '' : Number(is_confirmed),
                      });
                    }}
                    items={[
                      {
                        value: '',
                        name: t('warehousing.confirm.all'),
                      },
                      {
                        value: '0',
                        name: t('warehousing.confirm.false'),
                      },
                      {
                        value: '1',
                        name: t('warehousing.confirm.true'),
                      },
                    ]}
                  />

                  <TurtlePrimaryRangePicker
                    value={[
                      moment(searchQuery.start_date),
                      moment(searchQuery.end_date),
                    ]}
                    onChange={(_, [start_date, end_date]) => {
                      setSearchQuery({ ...searchQuery, start_date, end_date });
                    }}
                  />
                </Space>
              }
            />
          )}
          columns={[
            {
              ellipsis: true,
              width: 100,
              align: 'center',
              title: t('table.progressStatus'),
              render: (_, { is_confirmed }) => (
                <Tag color={is_confirmed ? 'cyan' : 'orange'}>
                  {t(`warehousing.confirm.${is_confirmed}`)}
                </Tag>
              ),
            },
            {
              ellipsis: true,
              width: 200,
              align: 'center',
              title: t('table.createdDate'),
              render: (_, record) => record.created_date,
            },
            {
              ellipsis: true,
              width: 200,
              align: 'right',
              title: t('table.totalWarehousingCount'),
              render: (_, record) => record.total_item_count.toLocaleString(),
            },
            {
              ellipsis: true,
              width: 200,
              align: 'right',
              title: t('table.totalAmount'),
              render: (_, record) => record.total_amount.toLocaleString(),
            },
            {
              ellipsis: true,
              align: 'center',
              width: 200,
              render: (_, record) => (
                <Space size="large">
                  {record.is_confirmed ? (
                    // 16일 이전은 x
                    moment(record.created_time) > moment('2022-08-17') && (
                      /*
                       * 진행상태 : 마감
                       */
                      <Button
                        size="small"
                        type="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectRow(record);
                          openCancelModal();
                        }}
                      >
                        마감취소
                      </Button>
                    )
                  ) : (
                    /*
                     * 진행상태 : 대기
                     */
                    <>
                      <Button
                        size="small"
                        type="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectRow(record);
                          openConfirmModal();
                        }}
                      >
                        마감하기
                      </Button>
                      <TurtleIcon
                        name="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectRow(record);
                          openRemoveModal();
                        }}
                      />
                    </>
                  )}
                </Space>
              ),
            },
          ]}
        />
      </PageContent>
    </>
  );
}

export default PageBody;
