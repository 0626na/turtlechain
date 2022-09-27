import clearingAPI from '@apis/clearingAPI';
import { SearchFilter } from '@components/combine';
import {
  PrimaryButton,
  TurtleIcon,
  TurtleTableTitle,
  TurtleText,
} from '@components/element';
import ArrowRightIcon from '@components/element/icon/ArrowRightIcon';
import useClearingCart from '@hooks/useClearingCart';
import useStore from '@hooks/useStore';
import { pricePattern } from '@utils/pattern';
import {
  Button,
  Col,
  Collapse,
  CollapsePanelProps,
  Divider,
  InputNumber,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

interface Props extends CollapsePanelProps {
  activeKey: string;
  clickCreate(): void;
}

function ClearingPanel({ activeKey, clickCreate, ...props }: Props) {
  const navigate = useNavigate();
  const { store } = useStore();
  const {
    cart,
    calculateClearingAmount,
    handleClearingAmount,
    fillAllClearingAmount,
    clearingPaymentTotal,
  } = useClearingCart();
  const [tooltipVisibleId, setTooltipVisibleId] = useState(-1);
  const [searchQuery, setSearchQuery] = useState({
    search_string: '',
  });

  // 정산서 생성 및 정산 상품추가
  const createClearingMutation = useMutation(clearingAPI.create, {
    onSuccess: () => {
      // message.success(t('message.success create clearing'));
      clickCreate();
      navigate('/clearing/history');
    },
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
    <Collapse.Panel
      {...props}
      style={{
        border: activeKey === '2' ? '1px solid rgba(227, 230, 234, 1)' : 'none',
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
                    <Button
                      size="small"
                      type="primary"
                      onClick={fillAllClearingAmount}
                    >
                      전액사용
                    </Button>
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
          onMouseEnter: () => {
            setTooltipVisibleId(record.vendor_info.id);
          },
          onMouseOut: () => {
            setTooltipVisibleId(-1);
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
              <Tag color={record.vendor_info.is_vat_included ? 'green' : 'red'}>
                {record.vendor_info.is_vat_included ? '포함' : '미포함'}
              </Tag>
            ),
          },
          {
            ellipsis: true,
            align: 'right',
            title: '결제요청 금액',
            render: (_, record) => {
              return (
                <Tooltip
                  color="#141720"
                  visible={tooltipVisibleId === record.vendor_info.id}
                  title={
                    <Space
                      direction="vertical"
                      size={2}
                      style={{
                        color: '#DCE0E4',
                      }}
                    >
                      <Row justify="space-between">
                        <Col style={{ marginRight: 59 }}>미결제</Col>
                        <Col>{record.unpaid_amount.toLocaleString()}</Col>
                      </Row>
                      <Row justify="space-between">
                        <Col style={{ marginRight: 59 }}>당일 입고</Col>
                        <Col>
                          {(
                            record.warehousing_amount +
                            record.reserve_subtract_amount
                          ).toLocaleString()}
                        </Col>
                      </Row>
                      <Row justify="space-between">
                        <Col style={{ marginRight: 59 }}>당일 미송</Col>
                        <Col>
                          {record.reserve_payment_amount.toLocaleString()}
                        </Col>
                      </Row>
                      <Divider
                        style={{
                          borderTopColor: '#5B5D63',
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      />
                      <Row justify="space-between">
                        <Col style={{ marginRight: 59 }}>매입 차감</Col>
                        <Col>
                          -{' '}
                          {record.overpaid_payment_amount?.toLocaleString() ??
                            0}
                        </Col>
                      </Row>

                      <Row justify="space-between">
                        <Col style={{ marginRight: 59 }}>미송 차감</Col>
                        <Col>
                          - {record.reserve_subtract_amount.toLocaleString()}
                        </Col>
                      </Row>
                    </Space>
                  }
                >
                  {record.clearing_amount?.toLocaleString() ?? 0}
                </Tooltip>
              );
            },
          },
          {
            ellipsis: true,
            align: 'right',
            title: '결제할 금액',
            render: (_, record) => (
              <InputNumber
                size="small"
                formatter={(value) => `${value}`.replace(pricePattern, ',')}
                placeholder="금액 입력"
                value={
                  record.clearing_payment_amount! > 0
                    ? record.clearing_payment_amount!
                    : undefined
                }
                step={1000}
                max={record.clearing_amount!}
                min={Math.max(
                  record.reserve_payment_amount -
                    (record.overpaid_payment_amount! ?? 0) -
                    record.reserve_subtract_amount,
                  0,
                )}
                onChange={(value) => {
                  handleClearingAmount(record, value);
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
            loading={createClearingMutation.isLoading}
            onClick={() => {
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
                    .filter((item) => item.clearing_payment_amount! > 0)
                    .map((item) => ({
                      vendor_id: item.vendor_info.id,
                      clearing_amount: item.clearing_payment_amount!,
                    })),
                  // 매입 차감
                  subtract_amount_list: cart.adjustmentSubtractList
                    .filter((item) => item.overpaid_payment_amount! > 0)
                    .map((item) => ({
                      vendor_id: item.vendor_info.id,
                      subtract_amount: item.overpaid_payment_amount!,
                    })),
                },
              });
            }}
          >
            결제요청 보내기
          </PrimaryButton>
        </Col>
      </Row>
    </Collapse.Panel>
  );
}

export default ClearingPanel;
