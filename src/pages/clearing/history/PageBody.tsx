import clearingAPI, {
  ClearingSheetShow,
  RequestGetSheet,
} from '@apis/clearingAPI';
import { RangeDateModal } from '@components/combine';
import {
  SelectButton,
  TertiaryButton,
  TurtleCard,
  TurtleConfirmModal,
  TurtleIcon,
  TurtlePrimaryRangePicker,
  TurtleSearchSelect,
  TurtleTableTitle,
  TurtleTag,
} from '@components/element';
import useModal from '@hooks/useModal';
import useStore from '@hooks/useStore';
import { PageContent, PageTitle } from '@layout/page';
import { Divider, Pagination, Row, Table } from 'antd';
import { message } from '@utils/message';
import { AxiosError } from 'axios';
import { t } from 'i18next';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import DetailModal from './modals/DetailModal';

function PageBody() {
  const { store } = useStore();
  const [searchQuery, setSearchQuery] = useState<RequestGetSheet>({
    store_id: store.selected?.id,
    credit_type: 'general',
    start_date: moment().subtract(1, 'months').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
    page: 1,
    page_size: 10,
    status: 'all',
  });
  const [selectedRow, selectRow] = useState<ClearingSheetShow>();
  const [detailModalVisible, openDetailModal, closeDetailModal] = useModal();
  const [downloadModalVisible, openDownloadModal, closeDownloadModal] =
    useModal();
  const [removeModalVisible, openRemoveModal, closeRemoveModal] = useModal();

  const getClearingSheetQuery = useQuery(
    ['getClearingSheetQuery', searchQuery],
    () => clearingAPI.getSheet(searchQuery),
    {
      enabled: !!searchQuery.store_id,
    },
  );

  const removeSheetMutation = useMutation(clearingAPI.removeSheet, {
    onSuccess: () => {
      getClearingSheetQuery.refetch();
      closeRemoveModal();
      message.success('결제요청을 취소했습니다.');
    },
  });

  const downloadExcelMutation = useMutation(clearingAPI.download, {
    onError: (error: AxiosError) => {
      message.error(
        new TextDecoder().decode(error.response?.data).split('"')[3],
      );
    },
    onSuccess: () => {
      closeDownloadModal();
    },
  });

  // 쇼핑몰 바뀔때 마다 정산 리스트 재요청
  useEffect(() => {
    setSearchQuery((searchQuery) => ({
      ...searchQuery,
      store_id: store.selected?.id,
    }));
  }, [store.selected]);

  const loading =
    getClearingSheetQuery.isLoading ||
    removeSheetMutation.isLoading ||
    downloadExcelMutation.isLoading;

  return (
    <>
      {/* 상세내역 모달 */}
      <DetailModal
        visible={detailModalVisible}
        onClose={closeDetailModal}
        selectedRow={selectedRow}
      />
      <PageTitle
        title="결제현황"
        buttons={[
          <TertiaryButton
            text="결제내역 다운"
            icon={<TurtleIcon name="download" />}
            onClick={() => {
              openDownloadModal();
            }}
          />,
        ]}
      />
      {/**요청 취소 모달 */}
      <TurtleConfirmModal
        visible={removeModalVisible}
        title="정말 취소할까요?"
        description={['취소 후에는 다시 결제요청을 보내야해요.']}
        onCancel={closeRemoveModal}
        onOk={() => {
          removeSheetMutation.mutate({
            id: selectedRow?.id as number,
            is_inactive: 1,
          });
        }}
        cancelText="아니요"
        okText="요청취소"
        loading={loading}
      />
      {/** 결제내역 다운로드 모달 */}
      <RangeDateModal
        visible={downloadModalVisible}
        onCancel={closeDownloadModal}
        onOk={({ start_date, end_date }) => {
          downloadExcelMutation.mutate({
            rt_store_id: store.selected?.id,
            start_date,
            end_date,
          });
        }}
        title="결제내역 다운"
        description={[
          '선택한 기간의 결제내역을 다운로드합니다.',
          '정보의 양에 따라 최대 1분 정도 걸릴 수 있어요.',
        ]}
        loading={loading}
      />
      <PageContent>
        {/*
         *  매입조정 현황
         */}
        <TurtleCard
          value={[
            {
              color: 'green',
              title: '요청',
              count:
                getClearingSheetQuery.data?.data.clearing_summary.request
                  .count ?? 0,
              price:
                getClearingSheetQuery.data?.data.clearing_summary.request
                  .amount ?? 0,
            },
            {
              color: 'orange',
              title: '대기',
              count:
                getClearingSheetQuery.data?.data.clearing_summary.pending
                  .count ?? 0,
              price:
                getClearingSheetQuery.data?.data.clearing_summary.pending
                  .amount ?? 0,
            },
            {
              color: 'cyan',
              title: '완료',
              count:
                getClearingSheetQuery.data?.data.clearing_summary.complete
                  .count ?? 0,
              price:
                getClearingSheetQuery.data?.data.clearing_summary.complete
                  .amount ?? 0,
            },
          ]}
        />
        <Table
          size="small"
          dataSource={getClearingSheetQuery.data?.data.sheet_list}
          loading={loading}
          pagination={false}
          rowKey={(record) => record.id}
          scroll={{ y: 'auto' }}
          onRow={(record) => ({
            onClick: () => {
              selectRow(record);
              openDetailModal();
            },
          })}
          title={() => (
            <TurtleTableTitle
              totalCount={getClearingSheetQuery.data?.data.total_count ?? 0}
              rightContent={
                <>
                  <TurtleSearchSelect
                    value={searchQuery.status}
                    onChange={(value) => {
                      setSearchQuery({ ...searchQuery, status: value });
                    }}
                    items={[
                      {
                        value: 'all',
                        name: t('clearing.status.all'),
                      },
                      {
                        value: 'request',
                        name: t('clearing.status.request'),
                      },
                      {
                        value: 'pending',
                        name: t('clearing.status.pending'),
                      },
                      {
                        value: 'complete',
                        name: t('clearing.status.complete'),
                      },
                    ]}
                  />

                  <Divider type="vertical" style={{ margin: 10 }} />

                  <TurtlePrimaryRangePicker
                    allowClear={false}
                    value={[
                      moment(searchQuery.start_date),
                      moment(searchQuery.end_date),
                    ]}
                    onChange={(_, dateStrings) => {
                      const start_date = dateStrings[0];
                      const end_date = dateStrings[1];
                      setSearchQuery({ ...searchQuery, start_date, end_date });
                    }}
                  />
                </>
              }
            ></TurtleTableTitle>
          )}
          footer={() => (
            <Row justify="center">
              <Pagination
                size="small"
                total={getClearingSheetQuery.data?.data.total_count}
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
              title: t('table.paymentStatus'),
              render: (_, record) => {
                const { status } = record;
                const color =
                  status === 'request'
                    ? 'green'
                    : status === 'pending'
                    ? 'orange'
                    : 'cyan';
                const text = t(`clearing.status.${status}`);
                return <TurtleTag color={color}>{text}</TurtleTag>;
              },
            },
            {
              ellipsis: true,
              title: t('table.paymentRequestDate'),
              render: (_, record) => record.request_date,
            },
            {
              ellipsis: true,
              title: t('table.paymentCompleteDate'),
              render: (_, record) => record.complete_date,
            },
            {
              ellipsis: true,
              align: 'right',
              title: t('table.paymentPrice'),
              render: (_, record) =>
                record.total_deposit_amount.toLocaleString(),
            },
            {
              ellipsis: true,
              align: 'center',
              render: (_, record) => (
                <>
                  {record.status === 'request' && (
                    <SelectButton
                      onClick={(e) => {
                        e.stopPropagation();
                        selectRow(record);
                        openRemoveModal();
                      }}
                    >
                      요청취소
                    </SelectButton>
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
