import { ClearingInfo } from '@apis/clearingAPI';
import { SearchFilter } from '@components/combine';
import {
  PrimaryButton,
  TurtleIcon,
  TurtleTableNumberInput,
  TurtleTableTitle,
  TurtleTag,
  TurtleText,
} from '@components/element';
import ArrowRightIcon from '@components/element/icon/ArrowRightIcon';
import useClearingCart from '@hooks/useClearingCart';
import useModal from '@hooks/useModal';

import {
  Col,
  Collapse,
  CollapsePanelProps,
  Row,
  Table,
  Typography,
} from 'antd';

import React, { useEffect, useMemo, useState } from 'react';

import ConfirmModal from '../modals/ConfirmModal';

import DetailModal from '../modals/DetailModal';
import FullUseButton from './FullUseButton';

interface Props extends CollapsePanelProps {
  activeKey: string;
  clickCreate(): void;
}

function ClearingPanel({ activeKey, clickCreate, ...props }: Props) {
  const {
    cart,
    calculateClearingAmount,
    handleClearingAmount,
    fillAllClearingAmount,
    clearingPaymentTotal,
  } = useClearingCart();

  const [detailModalVisible, detailModalOpen, detailModalClose] = useModal();
  const [createModalVisible, createModalOpen, createModalClose] = useModal();
  const [selectedRow, setSelectedRow] = useState<ClearingInfo>();
  const [searchQuery, setSearchQuery] = useState({
    search_string: '',
  });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      {/*
       * 결제요청 모달
       */}
      <ConfirmModal
        visible={createModalVisible}
        onClose={createModalClose}
        clickCreate={clickCreate}
        title="정말 요청을 보낼까요?"
        description={[
          '등록 후에는 이전으로 되돌릴 수 없어요.',
          '결제 정보를 다시한번 확인해주세요.',
        ]}
        items={[
          { title: '결제요청 일자', content: cart.clearingRequestDate },
          {
            title: '결제요청 금액',
            content: `${(
              Math.round((clearingPaymentTotal * 1.1) / 10) * 10
            ).toLocaleString()}
            원(부가세
          ${(
            Math.round((clearingPaymentTotal * 1.1) / 10) * 10 -
            clearingPaymentTotal
          ).toLocaleString()}
          원 포함)`,
          },
          { title: '총 거래처수', content: `${cart.resultList.length}개` },
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
                    <Col style={{ marginRight: 10 }}>
                      <FullUseButton onClick={fillAllClearingAmount}>
                        전액사용
                      </FullUseButton>
                    </Col>
                    <Col>
                      <SearchFilter
                        select={false}
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
              title: '거래처 명',
              render: (_, record) => record.vendor_info.vendor_name,
            },
            {
              ellipsis: true,
              title: '부가세 바로전달',
              render: (_, record) => (
                <TurtleTag
                  color={record.vendor_info.is_vat_included ? 'orange' : 'gray'}
                >
                  {record.vendor_info.is_vat_included ? '바로전달' : '일반'}
                </TurtleTag>
              ),
            },
            {
              ellipsis: true,
              align: 'right',
              title: '결제요청 금액',
              render: (_, record) =>
                record.clearing_amount?.toLocaleString() ?? 0,
            },
            {
              ellipsis: true,
              align: 'right',
              title: '결제할 금액',
              render: (_, record) => (
                <TurtleTableNumberInput
                  placeholder="금액 입력"
                  step={1000}
                  value={
                    record.clearing_payment_amount! > 0
                      ? record.clearing_payment_amount!
                      : undefined
                  }
                  max={record.clearing_amount!}
                  min={Math.max(
                    record.reserve_payment_amount -
                      (record.overpaid_payment_amount! ?? 0) -
                      record.reserve_subtract_amount,
                    0,
                  )}
                  onChange={(value) => {
                    handleClearingAmount(record, value as number);
                  }}
                />
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
              총 당일 결제 합계
            </Typography.Text>
            <Typography.Text style={{ fontWeight: 700, fontSize: 20 }}>
              {clearingPaymentTotal > 0 && (
                <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>
                  (부가세{' '}
                  {(
                    Math.round((clearingPaymentTotal * 1.1) / 10) * 10 -
                    clearingPaymentTotal
                  ).toLocaleString()}
                  원 포함){' '}
                </Typography.Text>
              )}
              {(
                Math.round((clearingPaymentTotal * 1.1) / 10) * 10
              ).toLocaleString()}
              원
            </Typography.Text>
          </Col>

          <Col>
            <PrimaryButton
              disabled={clearingPaymentTotal === 0}
              onClick={() => {
                createModalOpen();
              }}
              icon={<TurtleIcon name="rightTriangle" />}
            >
              결제요청 보내기
            </PrimaryButton>
          </Col>
        </Row>
      </Collapse.Panel>
    </>
  );
}

export default ClearingPanel;
