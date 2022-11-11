import adjustmentAPI, {
  AdjustmentItemShow,
  RequestGetList,
} from '@apis/adjustmentAPI';
import { SearchFilter } from '@components/combine';
import InputModal from '@components/combine/modal/InputModal';
import {
  MemoIcon,
  SecondaryIconButton,
  TurtleCard,
  TurtleConfirmModal,
  TurtleDivider,
  TurtleDropdown,
  TurtleIcon,
  TurtlePrimaryRangePicker,
  TurtleSearchSelect,
  TurtleTableTitle,
} from '@components/element';
import ProcessButton from '@components/element/button/ProcessButton';
import TurtleTag from '@components/element/TurtleTag';
import { css } from '@emotion/react';
import { message } from '@utils/message';
import useModal from '@hooks/useModal';
import useStore from '@hooks/useStore';
import { PageContent, PageHeader, PageTitle } from '@layout/page';
import { Col, Pagination, Row, Table, Tooltip } from 'antd';
import { t } from 'i18next';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import ExchangeRefundModal from './modals/CreateExchangeTakebackModal';
import AddReserveModal from './modals/CreateReserveModal';
import AdjustmentProcessModal from './modals/ProcessModal';
import DetailModal from './modals/DetailModal';

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
  const [adjustmentModalVisible, adjustmentModalOpen, adjustmentModalClose] =
    useModal();
  const [detailModalVisible, detailModalOpen, detailModalClose] = useModal();
  const [removeModalVisible, removeModalOpen, removeModalClose] = useModal();
  const [tooltipVisible, setTooltipVisible] = useState(true);
  // 교환/반품/미송 검색 조건
  const [searchQuery, setSearchQuery] = useState<RequestGetList>({
    rt_store_id: null,
    is_cleared: '',
    start_date: moment().subtract(1, 'weeks').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
    search_string: '',
    page: 1,
  });

  // 교환/반품/미송 검색 요청
  const getAdjustmentListQuery = useQuery(
    ['getAdjustmentListQuery', searchQuery],
    () => adjustmentAPI.getList(searchQuery),
    {
      enabled: !!searchQuery.rt_store_id,
    },
  );

  //메모 등록 요청
  const updateMemoMutation = useMutation(adjustmentAPI.update, {
    onSuccess: () => {
      message.success('성공적으로 업데이트 되었습니다.');
      setSearchQuery({ ...searchQuery, page: 1 });
      getAdjustmentListQuery.refetch();
      memoModalClose();
    },
  });

  // 교환/반품/미송 삭제 요청
  const removeAdjustmentMutation = useMutation(adjustmentAPI.update, {
    onSuccess: () => {
      message.success('성공적으로 삭제되었습니다.');
      setSearchQuery({ ...searchQuery, page: 1 });
      getAdjustmentListQuery.refetch();
      removeModalClose();
    },
  });
  const totalPendingCount =
    getAdjustmentListQuery.data?.data.adjustment_summary?.not_cleared.count ??
    0;

  const totalPendingPrice =
    getAdjustmentListQuery.data?.data.adjustment_summary?.not_cleared.price ??
    0;

  const totalClearingCount =
    getAdjustmentListQuery.data?.data.adjustment_summary?.cleared.count ?? 0;

  const totalClearingPrice =
    getAdjustmentListQuery.data?.data.adjustment_summary?.cleared.price ?? 0;

  const resetSearchQuery = () => {
    setSearchQuery({
      is_cleared: '',
      start_date: moment().subtract(1, 'weeks').format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
      search_string: '',
      page: 1,
      rt_store_id: store.selected?.id as number,
    });
  };

  useEffect(() => {
    resetSearchQuery();
  }, [store.selected?.id]);

  return (
    <>
      {/*
       * 미송상품 추가 모달
       */}
      <AddReserveModal
        visible={addReserveModalVisible}
        closeModal={addReserveModalClose}
      />

      {/*
       * 교환/반품 추가 모달
       */}
      <ExchangeRefundModal
        visible={addExchangeRefundModalVisible}
        onClose={addExchangeRefundModalClose}
      />

      {/*
       * 상세보기 모달
       */}
      <DetailModal
        selectedRow={selectedRow as AdjustmentItemShow}
        visible={detailModalVisible}
        onClose={detailModalClose}
      />

      {/*
       *  교환/반품/미송 처리 모달
       */}
      <AdjustmentProcessModal
        selectedRow={selectedRow as AdjustmentItemShow}
        visible={adjustmentModalVisible}
        onClose={adjustmentModalClose}
      />

      {/**
       * 메모 수정 모달
       */}
      <InputModal
        visible={memoModalVisible}
        loading={updateMemoMutation.isLoading}
        onCancel={updateMemoMutation.isLoading ? () => {} : memoModalClose}
        defaultValue={selectedRow?.memo}
        onOk={(value) => {
          updateMemoMutation.mutate({
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
       * 교환/반품/미송 삭제 모달
       */}
      <TurtleConfirmModal
        title={t('description.really delete')}
        description={[
          t('description.can not go back to the past after the cancellation.'),
        ]}
        okText="삭제"
        visible={removeModalVisible}
        loading={removeAdjustmentMutation.isLoading}
        onCancel={removeModalClose}
        onOk={() => {
          removeAdjustmentMutation.mutate({
            id: selectedRow?.id as number,
            is_inactive: 1,
          });
        }}
      />

      <PageHeader title="교환/반품/미송" />
      <PageTitle
        title="교환/반품/미송 현황"
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
            triggerButton={
              <SecondaryIconButton>교환/반품/미송 추가</SecondaryIconButton>
            }
          />,
        ]}
      />
      <PageContent>
        {/*
         *  교환/반품/미송 현황
         */}

        <TurtleCard
          value={[
            {
              color: 'orange',
              title: t('warehousing.adjustment.pending'),
              count: totalPendingCount,
              price: totalPendingPrice,
            },
            {
              color: 'cyan',
              title: t('warehousing.adjustment.confirmed'),
              count: totalClearingCount,
              price: totalClearingPrice,
            },
          ]}
        />

        <Table
          size="small"
          loading={getAdjustmentListQuery.isLoading}
          dataSource={getAdjustmentListQuery.data?.data.adjustment_list}
          rowKey={(record) => record.id}
          pagination={false}
          onRow={(record) => ({
            onClick: () => {
              setSelectedRow(record);
              detailModalOpen();
            },
          })}
          scroll={{ x: 'auto', y: 'auto' }}
          title={() => (
            <TurtleTableTitle
              totalCount={totalPendingCount + totalClearingCount}
              rightContent={
                <Row>
                  <Col>
                    <TurtleSearchSelect
                      value={searchQuery.is_cleared}
                      onChange={(search_type) => {
                        setSearchQuery((searchQuery) => ({
                          ...searchQuery,
                          page: 1,
                          is_cleared: search_type as '' | 'True' | 'False',
                        }));
                      }}
                      items={[
                        { value: '', name: '전체' },
                        { value: 'False', name: '대기' },
                        { value: 'True', name: '마감' },
                      ]}
                    />
                  </Col>

                  <Col
                    css={css`
                      display: flex;
                      align-items: center;
                    `}
                  >
                    <TurtleDivider type="vertical" />
                  </Col>

                  <Col>
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
                          page: 1,
                          start_date,
                          end_date,
                        }));
                      }}
                    />
                  </Col>

                  <Col
                    css={css`
                      display: flex;
                      align-items: center;
                    `}
                  >
                    <TurtleDivider type="vertical" />
                  </Col>

                  <Col>
                    <SearchFilter
                      placeholder="거래처명, 상품명, 거래처 상품명 검색"
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                    />
                  </Col>
                </Row>
              }
            />
          )}
          footer={() => (
            <Row justify="center">
              <Pagination
                size="small"
                total={totalPendingCount + totalClearingCount}
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
              width: 70,
              title: t('table.progressStatus'),
              render: (_, { is_cleared }) => (
                <div>
                  {is_cleared ? (
                    <TurtleTag color="cyan">마감</TurtleTag>
                  ) : (
                    <TurtleTag color="orange">대기</TurtleTag>
                  )}
                </div>
              ),
            },
            {
              ellipsis: true,
              width: 100,
              title: t('table.createdDate'),
              render: (_, record) => record.created_date,
            },
            {
              ellipsis: true,
              width: 100,
              title: t('table.type'),
              render: (_, record) =>
                t(`adjustment.process type.${record.type}`),
            },
            {
              ellipsis: true,
              width: 100,
              title: (
                <Tooltip
                  visible={true}
                  zIndex={1}
                  title={
                    <span>
                      거래처별 사용가능 금액 확인은 터틀장부에서 확인할 수
                      있어요!
                    </span>
                  }
                >
                  {t('table.vendorName')}
                </Tooltip>
              ),
              render: (_, record) => record.vendor_info.vendor_name,
            },
            {
              ellipsis: true,
              width: 200,
              title: t('table.productName'),
              render: (_, record) => record.product_info.name,
            },
            {
              ellipsis: true,
              width: 200,
              title: t('table.vendorProductName'),
              render: (_, record) => record.product_info.vendor_product_name,
            },
            {
              ellipsis: true,
              width: 100,
              title: t('table.option'),
              render: (_, record) => record.product_info.option,
            },
            {
              width: 70,
              align: 'right',
              title: t('table.price'),
              render: (record) =>
                (record.product_info.price * record.count).toLocaleString(),
            },
            {
              width: 70,
              align: 'right',
              ellipsis: true,
              title: t('table.proccessed totalCount'),
              render: (_, record) =>
                `${record.count - record.count_left} / ${record.count}`,
            },
            {
              ellipsis: true,
              width: 50,
              align: 'center',
              title: t('table.memo'),
              onCell: (record) => ({
                style: { cursor: 'pointer' },
                onClick: (e) => {
                  e.stopPropagation();
                  setSelectedRow(record);
                  memoModalOpen();
                },
              }),
              render: (_, record) => <MemoIcon value={record.memo} />,
            },

            {
              ellipsis: true,
              width: 100,
              align: 'center',
              onCell: () => ({
                onClick: (e) => {
                  e.stopPropagation();
                },
              }),
              render: (_, record) => (
                <>
                  {record.count_left !== 0 &&
                    // 미송항목 일시, 등록날짜 기준 오후 7시 이후에만 활성화
                    ((record.type === 'reserve' &&
                      moment
                        .duration(moment().diff(moment(record.created_date)))
                        .asHours() > 19) ||
                      record.type !== 'reserve') && (
                      <ProcessButton
                        onClick={() => {
                          setSelectedRow(record);
                          adjustmentModalOpen();
                        }}
                      >
                        처리하기
                      </ProcessButton>
                    )}
                </>
              ),
            },
            {
              ellipsis: true,
              width: 30,
              align: 'center',
              onCell: (record) => ({
                style: { cursor: 'pointer' },
                onClick: (e) => {
                  e.stopPropagation();
                  setSelectedRow(record);
                  removeModalOpen();
                },
              }),
              render: (_) => <TurtleIcon name="delete" />,
            },
          ]}
        />
      </PageContent>
    </>
  );
}

export default PageBody;
