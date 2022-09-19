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
  TurtleDivider,
  TurtleDropdown,
  TurtleIcon,
  TurtlePrimaryRangePicker,
  TurtleSearchSelect,
  TurtleTableTitle,
} from '@components/element';
import TurtleTag from '@components/element/TurtleTag';
import { css } from '@emotion/react';

import useModal from '@hooks/useModal';
import useStore from '@hooks/useStore';
import { PageContent, PageHeader, PageTitle } from '@layout/page';
import { Button, Col, message, Pagination, Popconfirm, Row, Table } from 'antd';
import { t } from 'i18next';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import ExchangeRefundModal from './modal/ExchangeRefundModal';

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
    rt_store_id: null,

    is_cleared: '',

    start_date: moment().subtract(1, 'weeks').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),

    type: 'vendor_name',
    search_string: '',

    page: 1,
  });

  // 매입조정 검색 요청
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

  useEffect(() => {
    setSearchQuery((searchQuery) => ({
      ...searchQuery,
      rt_store_id: store.selected?.id as number,
    }));
  }, [store.selected?.id]);

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

      <ExchangeRefundModal
        visible={addExchangeRefundModalVisible}
        onClose={addExchangeRefundModalClose}
      />

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
        <div css={cardsMargin}>
          <TurtleCard
            value={[
              {
                color: '#DD7A32',
                title: t('warehousing.adjustment.pending'),
                count:
                  getAdjustmentListQuery.data?.data.adjustment_summary
                    ?.not_cleared.count ?? 0,
                price:
                  getAdjustmentListQuery.data?.data.adjustment_summary
                    ?.not_cleared.price ?? 0,
              },
              {
                color: '#00AAB5',
                title: t('warehousing.adjustment.confirmed'),
                count:
                  getAdjustmentListQuery.data?.data.adjustment_summary?.cleared
                    .count ?? 0,
                price:
                  getAdjustmentListQuery.data?.data.adjustment_summary?.cleared
                    .price ?? 0,
              },
            ]}
          />
        </div>

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
                <Row>
                  <Col>
                    <TurtleSearchSelect
                      value={''}
                      onChange={(search_type) => {
                        setSearchQuery((searchQuery) => ({
                          ...searchQuery,
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
              title: t('table.progressStatus'),
              render: (_, record) => {
                const { is_cleared } = record;
                return is_cleared ? (
                  <TurtleTag color="#00AAB5">마감</TurtleTag>
                ) : (
                  <TurtleTag color="#DD7A32">대기</TurtleTag>
                );
              },
            },
            {
              ellipsis: true,
              width: 150,
              title: t('table.createdDate'),
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

const cardsMargin = css`
  margin-bottom: 60px;
`;

export default PageBody;
