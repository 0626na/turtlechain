import { QuestionCircleOutlined } from '@ant-design/icons';
import clearingAPI from '@apis/clearingAPI';
import {
  ArrowRightIcon,
  PrimaryButton,
  TurtleIcon,
  TurtleTableTitle,
  TurtleText,
} from '@components/element';
import { css } from '@emotion/react';
import useClearingCart from '@hooks/useClearingCart';
import useStore from '@hooks/useStore';
import { pricePattern } from '@utils/pattern';
import {
  Button,
  Col,
  Collapse,
  CollapsePanelProps,
  InputNumber,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import { t } from 'i18next';
import moment from 'moment';
import React from 'react';
import { useQuery } from 'react-query';

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
        // clearing_request_date: cart.clearingRequestDate,
        clearing_request_date: '2022-09-21',
      }),
    {
      enabled: activeKey === '1',
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
        // height: '100%',
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
      <div>
        <h3>이번 결제에서 제외해요</h3>
      </div>
      <Table
        size="small"
        pagination={false}
        loading={getStoreClearingQuery.isLoading}
        dataSource={[
          ...cart.adjustmentSubtractList,
          ...cart.reserveSubtractList,
        ]}
        rowKey={(record) => record.id!}
        title={() => (
          <TurtleTableTitle
            totalCount={
              cart.adjustmentSubtractList.length +
              cart.reserveSubtractList.length
            }
            rightContent={
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  fillAllAdjustmentSubtract();
                }}
              >
                전액 입력하기
              </Button>
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
              record.type === 'adjustment_subtract' ? '매입 차감' : '미송 차감',
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
            title: () => (
              <>
                <Tooltip
                  title={
                    <div style={{ width: 187 }}>
                      사용할 금액은 당일 입고 금액을 초과할 수 없습니다.
                    </div>
                  }
                >
                  <QuestionCircleOutlined />
                </Tooltip>
                <Typography.Text style={{ marginLeft: 4 }}>
                  사용금액
                </Typography.Text>
              </>
            ),
            render: (_, record) => (
              <Space>
                {record.type === 'adjustment_subtract' ? (
                  <InputNumber
                    size="small"
                    formatter={(value) => `${value}`.replace(pricePattern, ',')}
                    placeholder="금액 입력"
                    value={record.overpaid_payment_amount}
                    step={1000}
                    max={record.overpaid_amount}
                    min={0}
                    onChange={(value) => {
                      handleAdjustmentSubtract(record, value);
                    }}
                  />
                ) : (
                  <InputNumber
                    size="small"
                    formatter={(value) => `${value}`.replace(pricePattern, ',')}
                    value={record.reserve_subtract_amount}
                    disabled={true}
                  />
                )}
              </Space>
            ),
          },
        ]}
      />

      {/*
       *  미송
       */}

      <span
        css={css`
          /* margin-top: 40px; */
          display: inline-block;
          font-weight: 700;
          font-size: 18px;
          color: #242934;
        `}
      >
        이번 결제에 포함해요
      </span>
      <Table
        size="small"
        pagination={false}
        loading={getStoreClearingQuery.isLoading}
        dataSource={[...cart.reservePaymentList]}
        rowKey={(record) => record.id!}
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
            title: t('vendor.name'),
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

export default WarehousingPanel;
