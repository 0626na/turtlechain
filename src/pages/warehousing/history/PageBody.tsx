import React, { useEffect, useState } from 'react';
import warehousingAPI, {
  RequestGetSheet,
  WarehousingSheet,
} from '@apis/warehousingAPI';
import {
  SelectButton,
  TurtleConfirmModal,
  TurtleIcon,
  TurtlePrimaryRangePicker,
  TurtleSearchSelect,
  TurtleTableTitle,
  TurtleTag,
} from '@components/element';
import useStore from '@hooks/useStore';
import { PageContent, PageTitle } from '@layout/page';
import { Space, Table } from 'antd';
import { t } from 'i18next';
import moment from 'moment';
import { useMutation, useQuery } from 'react-query';
import useModal from '@hooks/useModal';
import DetailModal from './modals/DetailModal';
import ProcessButton from '@components/element/button/ProcessButton';
import { message } from '@utils/message';
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

  // 입고장 마감 요청
  const confirmSheetMutation = useMutation(warehousingAPI.updateSheet, {
    onSuccess: () => {
      message.success('입고서를 마감했어요');
      closeConfirmModal();
      getWarehousingSheetQuery.refetch();
    },
  });

  // 입고장 마감 취소 요청
  const cancelSheetMutation = useMutation(warehousingAPI.updateSheet, {
    onSuccess: () => {
      message.success('입고서 마감을 취소했어요');
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
        cancelText="취소"
        okText="삭제"
        loading={removeSheetMutation.isLoading}
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
          confirmSheetMutation.mutate({
            id: selectedRow?.id as number,
            is_confirmed: true,
          });
        }}
        cancelText="취소"
        okText="마감"
        loading={confirmSheetMutation.isLoading}
      />
      {/**
       * 마감 취소 확인 모달
       */}
      <TurtleConfirmModal
        visible={cancelModalVisible}
        title="정말 취소할까요?"
        description={['해당 입고서의 마감을 취소합니다.']}
        onCancel={closeCancelModal}
        onOk={() => {
          cancelSheetMutation.mutate({
            id: selectedRow?.id as number,
            is_confirmed: false,
          });
        }}
        cancelText="취소"
        okText="마감취소"
        loading={cancelSheetMutation.isLoading}
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
          scroll={{ x: 950, y: 'auto' }}
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
                <TurtleTag color={is_confirmed ? 'cyan' : 'orange'}>
                  {t(`warehousing.confirm.${is_confirmed}`)}
                </TurtleTag>
              ),
            },
            {
              ellipsis: true,
              // width: 200,
              align: 'center',
              title: t('table.createdDate'),
              render: (_, record) => record.created_date,
            },
            {
              ellipsis: true,
              // width: 200,
              align: 'right',
              title: t('table.totalWarehousingCount'),
              render: (_, record) => record.total_item_count.toLocaleString(),
            },
            {
              ellipsis: true,
              // width: 200,
              align: 'right',
              title: t('table.totalVendorCount'),
              render: (_, record) => record.total_store_count,
            },
            {
              ellipsis: true,
              // width: 200,
              align: 'right',
              title: t('table.totalAmount'),
              render: (_, record) => record.total_amount.toLocaleString(),
            },
            {
              ellipsis: true,
              align: 'center',
              width: 130,
              onCell: () => ({
                onClick: (e) => {
                  e.stopPropagation();
                },
              }),
              render: (_, record) => (
                <>
                  {record.is_confirmed ? (
                    // 16일 이전은 x
                    moment(record.created_time) > moment('2022-08-17') && (
                      /*
                       * 진행상태 : 마감
                       */
                      <SelectButton
                        onClick={(e) => {
                          e.stopPropagation();
                          selectRow(record);
                          openCancelModal();
                        }}
                      >
                        마감취소
                      </SelectButton>
                    )
                  ) : (
                    /*
                     * 진행상태 : 대기
                     */
                    <ProcessButton
                      onClick={(e) => {
                        e.stopPropagation();
                        selectRow(record);
                        openConfirmModal();
                      }}
                    >
                      마감하기
                    </ProcessButton>
                  )}
                </>
              ),
            },
            {
              ellipsis: true,
              width: 50,
              onCell: (record) => ({
                style: { cursor: 'pointer' },
                onClick: (e) => {
                  e.stopPropagation();
                  selectRow(record);
                  openRemoveModal();
                },
              }),
              render: (_, record) => (
                <>
                  {!record.is_confirmed && (
                    /*
                     * 진행상태 : 대기
                     */
                    <TurtleIcon name="delete" />
                  )}
                </>
              ),
            },
          ]}
        />
      </PageContent>
    </>
  );
}

export default PageBody;
