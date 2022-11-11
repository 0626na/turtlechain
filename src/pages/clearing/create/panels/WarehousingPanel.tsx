import clearingAPI from '@apis/clearingAPI';
import { TextWithTooltip } from '@components/combine';
import {
  ArrowRightIcon,
  PrimaryButton,
  TurtleDivider,
  TurtleIcon,
  TurtleTableTitle,
  TurtleText,
  TurtleTableNumberInput,
} from '@components/element';

import { css } from '@emotion/react';
import useClearingCart from '@hooks/useClearingCart';
import useStore from '@hooks/useStore';

import {
  Col,
  Collapse,
  CollapsePanelProps,
  Row,
  Table,
  Typography,
} from 'antd';
import { t } from 'i18next';
import moment from 'moment';
import React from 'react';
import { useQuery } from 'react-query';
import FullUseButton from './FullUseButton';

interface Props extends CollapsePanelProps {
  activeKey: string;
  clickNext(): void;
}

function WarehousingPanel({ activeKey, clickNext, ...props }: Props) {
  const { store } = useStore();
  const {
    cart,
    separate,
    fillAllAdjustmentSubtract,
    handleAdjustmentSubtract,
    subtractAmountTotal,
    reservePaymentAmountTotal,
  } = useClearingCart();

  const getStoreClearingQuery = useQuery(
    ['getStoreClearingQuery', store.selected?.id, cart.clearingRequestDate],
    () =>
      clearingAPI.getClearing({
        rt_store_id: store.selected?.id as number,
        balance_type: 'clearing',
        clearing_request_date: cart.clearingRequestDate,
      }),
    {
      enabled: activeKey === '1' && !!store.selected?.id,
      onSuccess: (data) => {
        separate(data.item_list);
      },
    },
  );

  return (
    <Collapse.Panel
      {...props}
      style={{
        border: activeKey === '1' ? '1px solid rgba(227, 230, 234, 1)' : 'none',
      }}
      showArrow={false}
      extra={
        <TurtleText css={{ color: '#242934' }}>
          {activeKey === '1' ? (
            <TurtleIcon name="arrowDown" />
          ) : (
            <ArrowRightIcon />
          )}
        </TurtleText>
      }
    >
      {/*
       *  차감
       */}
      <TurtleDivider marginBottom={36} />

      <div css={panelContentCSS.self}>
        <div css={panelContentCSS.titleContainer}>
          <TurtleIcon name="excludeWon" />
          <span css={panelContentCSS.titleText}>이번 결제에서 제외해요</span>
        </div>

        <Table
          css={{
            '&& tbody > tr:hover > td': {
              background: '#E2F6F7',
            },
          }}
          scroll={{ y: 80 }}
          size="small"
          pagination={false}
          loading={getStoreClearingQuery.isLoading}
          dataSource={[
            ...cart.adjustmentSubtractList,
            ...cart.reserveSubtractList,
          ]}
          rowKey={(record) => record.id as number}
          title={() => (
            <TurtleTableTitle
              totalCount={
                cart.adjustmentSubtractList.length +
                cart.reserveSubtractList.length
              }
              rightContent={
                <FullUseButton
                  onClick={() => {
                    fillAllAdjustmentSubtract();
                  }}
                >
                  전액사용
                </FullUseButton>
              }
            />
          )}
          columns={[
            {
              ellipsis: true,
              title: '등록 일자',
              render: (_, record) =>
                moment(record.created_date).format('YYYY-MM-DD'),
            },
            {
              ellipsis: true,
              title: '분류',
              render: (_, record) =>
                // i18
                record.type === 'adjustment_subtract'
                  ? '매입 차감'
                  : '미송 차감',
            },
            {
              ellipsis: true,
              title: t('table.vendorName'),
              render: (_, record) => record.vendor_info.vendor_name,
            },

            {
              ellipsis: true,
              align: 'right',
              title: '사용가능 금액',
              render: (_, record) =>
                record.type === 'adjustment_subtract'
                  ? record.overpaid_amount.toLocaleString()
                  : record.reserve_subtract_amount.toLocaleString(),
            },

            {
              ellipsis: true,
              align: 'right',
              width: 200,
              title: () => (
                <TextWithTooltip
                  iconPlacement="left"
                  tooltipContent={[
                    '사용할 금액은 당일 입고 금액을 초과할 수 없습니다.',
                  ]}
                >
                  사용금액
                </TextWithTooltip>
              ),
              render: (_, record) => (
                <div css={{ display: 'inline-block', width: '60%' }}>
                  {record.type === 'adjustment_subtract' ? (
                    <TurtleTableNumberInput
                      step={1000}
                      placeholder="금액 입력"
                      value={record.overpaid_payment_amount as number}
                      max={record.overpaid_amount}
                      onChange={(value) => {
                        handleAdjustmentSubtract(record, value as number);
                      }}
                    />
                  ) : (
                    <TurtleTableNumberInput
                      step={1000}
                      value={record.reserve_subtract_amount}
                      disabled={true}
                    />
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
      {/*
       *  미송
       */}

      <div css={panelContentCSS.titleContainer}>
        <TurtleIcon name="includeWon" />
        <span css={panelContentCSS.titleText}>이번 결제에서 포함해요</span>
      </div>
      <Table
        css={{
          '&& tbody > tr:hover > td': {
            background: '#E2F6F7',
          },
        }}
        scroll={{ y: 80 }}
        size="small"
        pagination={false}
        loading={getStoreClearingQuery.isLoading}
        dataSource={[...cart.reservePaymentList]}
        rowKey={(record) => record.id as number}
        title={() => (
          <TurtleTableTitle totalCount={cart.reservePaymentList.length} />
        )}
        columns={[
          {
            ellipsis: true,
            title: '등록 날짜',
            render: (_, record) =>
              moment(record.created_date).format('YYYY-MM-DD'),
          },
          {
            ellipsis: true,
            title: '거래처명',
            render: (_, record) => record.vendor_info.vendor_name,
          },
          {
            ellipsis: true,
            title: '당일 미송 금액',
            align: 'right',
            render: (_, record) =>
              record.reserve_payment_amount.toLocaleString(),
          },
          {
            title: '',
          },
        ]}
      />

      <Row justify="end" align="middle" style={{ marginTop: 40 }}>
        <Col>
          <Typography.Text style={{ color: ' #6B6D73', marginRight: 8 }}>
            총 차감 합계
          </Typography.Text>
          <Typography.Text style={{ fontWeight: 700 }}>
            {subtractAmountTotal.toLocaleString()}원
          </Typography.Text>
        </Col>
        <Col style={{ marginLeft: 8, marginRight: 8 }}>/</Col>
        <Col style={{ marginRight: 24 }}>
          <Typography.Text style={{ color: ' #6B6D73', marginRight: 8 }}>
            총 미송 합계
          </Typography.Text>
          <Typography.Text style={{ fontWeight: 700 }}>
            {reservePaymentAmountTotal.toLocaleString()}원
          </Typography.Text>
        </Col>
        <Col>
          <PrimaryButton
            children={'모두 확인했어요'}
            onClick={() => {
              clickNext();
            }}
          />
        </Col>
      </Row>
    </Collapse.Panel>
  );
}

const panelContentCSS = {
  self: css({ marginBottom: 40 }),

  titleContainer: css({
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8,
  }),

  titleText: css({
    marginLeft: 8,
    fontWeight: 700,
    fontSize: 18,
    color: '#242934',
  }),
};

export default WarehousingPanel;
