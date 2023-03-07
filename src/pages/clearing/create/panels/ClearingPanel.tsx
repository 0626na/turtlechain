import clearingAPI, { ClearingInfo } from '@apis/clearingAPI';
import userAPI from '@apis/userAPI';
import {
  CreateModal,
  SearchFilter,
  TextWithTooltip,
} from '@components/combine';
import {
  PrimaryButton,
  TurtleIcon,
  TurtleTableNumberInput,
  TurtleTableTitle,
  TurtleTag,
  TurtleText,
} from '@components/element';
import ArrowRightIcon from '@components/element/icon/ArrowRightIcon';
import { css } from '@emotion/react';
import useClearingCart from '@hooks/useClearingCart';
import useModal from '@hooks/useModal';
import useStore from '@hooks/useStore';
import useUser from '@hooks/useUser';
import { message } from '@utils/message';

import {
  Col,
  Collapse,
  CollapsePanelProps,
  Row,
  Table,
  Typography,
} from 'antd';
import { t } from 'i18next';

import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import DetailModal from '../modals/DetailModal';
import PayMentModal from '../modals/PayMentModal';
import FullUseButton from './FullUseButton';

interface Props extends CollapsePanelProps {
  activeKey: string;
}

function ClearingPanel({ activeKey, ...props }: Props) {
  const navigate = useNavigate();
  const [isSubscription, setIsSubscription] = useState(false);
  const { store } = useStore();
  const { user } = useUser();
  const {
    cart,
    calculateClearingAmount,
    handleClearingAmount,
    fillAllClearingAmount,
    clearingPaymentTotal,
  } = useClearingCart();

  const [detailModalVisible, detailModalOpen, detailModalClose] = useModal();
  const [createModalVisible, createModalOpen, createModalClose] = useModal();
  const [paymentModalVisible, paymentModalOpen, paymentModalClose] = useModal();
  const [selectedRow, setSelectedRow] = useState<ClearingInfo>();
  const [searchQuery, setSearchQuery] = useState({
    search_string: '',
  });

  /**
   * 유저의 구독여부 찾기
   */
  const getSubscriptionCheckQuery = useQuery(
    'getSubscriptionCheckQuery',
    () =>
      userAPI.getSubscriptionCheck({ company_id: Number(user?.company_id) }),
    {
      enabled: !!user?.company_id,
      onSuccess: (data) => setIsSubscription(data.data.is_expired),
    },
  );

  // 정산서 생성 및 정산 상품추가
  const createClearingMutation = useMutation(clearingAPI.create, {
    onSuccess: () => {
      message.success(t('message.success create clearing'));
      navigate('/clearing/history');
    },
  });

  const handleCreate = () => {
    createClearingMutation.mutate({
      sheet: {
        store_id: store.selected?.id,
        credit_type: 'general',
        store_name: store.selected?.name,
        request_date: cart.clearingRequestDate,
      },
      item: {
        rt_store_id: store.selected?.id,
        rt_store_name: store.selected?.name,
        // 당일 결제 합계
        clearing_amount_list: cart.resultList
          .filter((item) => (item.clearing_payment_amount as number) > 0)
          .map((item) => ({
            vendor_id: item.vendor_info.id,
            clearing_amount: item.clearing_payment_amount as number,
          })),
        // 매입 차감
        subtract_amount_list: cart.adjustmentSubtractList
          .filter((item) => (item.overpaid_payment_amount as number) > 0)
          .map((item) => ({
            vendor_id: item.vendor_info.id,
            subtract_amount: item.overpaid_payment_amount as number,
          })),
      },
    });
  };

  // 거래처 검색(default : 전체)
  const filteredList = useMemo(
    () =>
      cart.resultList.filter((item) =>
        item.vendor_info.vendor_name.includes(searchQuery.search_string),
      ),
    [cart.resultList, searchQuery],
  );

  useEffect(() => {
    if (activeKey !== '2') return;
    calculateClearingAmount();
  }, [activeKey]);

  return (
    <>
      {/*
       * 결제 상세정보 모달
       */}
      <DetailModal
        visible={detailModalVisible}
        onClose={detailModalClose}
        selectedRow={selectedRow as ClearingInfo}
      />

      <PayMentModal
        visible={paymentModalVisible}
        closeModal={paymentModalClose}
      />

      {/*
       * 결제요청 모달
       */}
      <CreateModal
        onOk={() => {
          handleCreate();
        }}
        loading={createClearingMutation.isLoading}
        visible={createModalVisible}
        onClose={createModalClose}
        title={t('title.really register')}
        description={[
          t('description.cannot reset after register'),
          t('description.confirm payment info'),
        ]}
        items={[
          { title: t('table.payment date'), content: cart.clearingRequestDate },
          {
            title: t('table.unpaidAmount'),
            content: t('description.price include vat', {
              price: (
                Math.round((clearingPaymentTotal * 1.1) / 10) * 10
              ).toLocaleString(),
              vat: (
                Math.round((clearingPaymentTotal * 1.1) / 10) * 10 -
                clearingPaymentTotal
              ).toLocaleString(),
            }),
          },
          {
            title: t('table.totalVendorCount'),
            content: t('description.count', { count: cart.resultList.length }),
          },
        ]}
      />

      <Collapse.Panel
        {...props}
        style={{
          border:
            activeKey === '2' ? '1px solid rgba(227, 230, 234, 1)' : 'none',
        }}
        showArrow={false}
        extra={
          <TurtleText css={{ color: '#242934' }}>
            {activeKey === '2' ? (
              <TurtleIcon name="arrowDown" />
            ) : (
              <ArrowRightIcon />
            )}
          </TurtleText>
        }
      >
        <Table
          size="small"
          css={{
            '&& tbody > tr:hover > td': {
              background: '#E2F6F7',
            },
          }}
          scroll={{ y: 300 }}
          pagination={false}
          loading={activeKey !== '2'}
          dataSource={filteredList}
          rowKey={(record) => record.vendor_info.id}
          title={() => (
            <>
              <TurtleTableTitle
                totalCount={cart.resultList.length}
                rightContent={
                  <Row>
                    <Col css={marginRight}>
                      <FullUseButton onClick={fillAllClearingAmount}>
                        {t('button.full payment')}
                      </FullUseButton>
                    </Col>
                    <Col>
                      <SearchFilter
                        placeholder={t('placeholder.vendor search')}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                      />
                    </Col>
                  </Row>
                }
              />
            </>
          )}
          onRow={(record) => ({
            onClick: () => {
              setSelectedRow(record);
              detailModalOpen();
            },
          })}
          columns={[
            {
              ellipsis: true,
              title: t('table.vendorName'),
              render: (_, record) => {
                const isMark =
                  record.reserve_subtract_amount +
                    (record.overpaid_payment_amount ?? 0) +
                    record.reserve_payment_amount +
                    +record.unpaid_amount >
                  0;

                return (
                  <div css={{ display: 'flex', alignItems: 'center' }}>
                    <span css={{ marginRight: 5 }}>
                      {record.vendor_info.vendor_name}
                    </span>

                    {isMark && <TurtleIcon name="mark" />}
                  </div>
                );
              },
            },
            {
              ellipsis: true,
              title: (
                <TextWithTooltip
                  tooltipContent={[
                    t('description.payment today'),
                    t('description.check vendor'),
                  ]}
                >
                  {t('table.vatIncluded')}
                </TextWithTooltip>
              ),
              render: (_, record) => (
                <TurtleTag
                  color={record.vendor_info.is_vat_included ? 'orange' : 'gray'}
                >
                  {record.vendor_info.is_vat_included
                    ? t('table.right delivery')
                    : t('table.general')}
                </TurtleTag>
              ),
            },
            {
              ellipsis: true,
              align: 'right',
              title: t('table.unpaidAmount'),
              render: (_, record) =>
                record.clearing_amount?.toLocaleString() ?? 0,
            },
            {
              ellipsis: true,
              align: 'right',
              title: t('table.amount to be paid'),
              width: 250,
              onCell: () => ({
                onClick: (e) => {
                  e.stopPropagation();
                },
              }),
              render: (_, record) => (
                <div css={{ width: '50%', display: 'inline-block' }}>
                  <TurtleTableNumberInput
                    placeholder={t('placeholder.amount input')}
                    value={
                      (record.clearing_payment_amount as number) > 0
                        ? (record.clearing_payment_amount as number)
                        : undefined
                    }
                    max={record.clearing_amount}
                    min={Math.max(
                      record.reserve_payment_amount -
                        ((record.overpaid_payment_amount as number) ?? 0) -
                        record.reserve_subtract_amount,
                      0,
                    )}
                    onChange={(value) => {
                      handleClearingAmount(record, value as number);
                    }}
                  />
                </div>
              ),
            },
          ]}
        />

        {/*
         *
         * 결제요청
         *
         */}

        <Row
          style={{ marginTop: 40, marginBottom: 8, height: 40 }}
          justify="end"
          align="middle"
        >
          <Col
            style={{
              height: '100%',
              lineHeight: 1,
              marginRight: 24,

              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'end',
            }}
          >
            <Typography.Text style={{ color: ' #6B6D73', fontSize: 13 }}>
              {t('table.total today payment')}
            </Typography.Text>
            <Typography.Text style={{ fontWeight: 700, fontSize: 20 }}>
              {clearingPaymentTotal > 0 && (
                <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>
                  {t('description.include vat', {
                    vat: (
                      Math.round((clearingPaymentTotal * 1.1) / 10) * 10 -
                      clearingPaymentTotal
                    ).toLocaleString(),
                  })}
                </Typography.Text>
              )}
              {(
                Math.round((clearingPaymentTotal * 1.1) / 10) * 10
              ).toLocaleString()}
              {t('description.won')}
            </Typography.Text>
          </Col>

          <Col>
            <PrimaryButton
              disabled={clearingPaymentTotal === 0}
              onClick={() => {
                isSubscription ? createModalOpen() : paymentModalOpen();
              }}
              icon={<TurtleIcon name="rightTriangle" />}
            >
              {t('button.send payment')}
            </PrimaryButton>
          </Col>
        </Row>
      </Collapse.Panel>
    </>
  );
}

const marginRight = css({
  marginRight: 8,
});

export default ClearingPanel;
