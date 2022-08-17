import { t } from 'i18next';
import {
  Col,
  Collapse,
  CollapsePanelProps,
  InputNumber,
  message,
  Row,
  Table,
  Typography,
  Tooltip,
  Divider,
  Space,
  Tag,
} from 'antd';

import { DownOutlined, RightOutlined } from '@ant-design/icons';

import { useEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';

import { storeState } from '@store/storeState';
import { clearingCartState } from '@store/clearingCartState';
import { useClearingCart } from '@hooks/index';

import {
  TurtleButton,
  TurtleButtonSub,
  TurtleTableTitle,
} from '@components/common';
import { NewSearchFilter } from '@components/combine';

import clearingAPI from '@apis/clearingAPI';
import { pricePattern } from '@utils/pattern';

interface Props extends CollapsePanelProps {
  activeKey: string | string[];
  clickCreate: () => void;
  clearingRequestDate: string;
}

function ClearingPanel({
  activeKey,
  clickCreate,
  clearingRequestDate,
  ...props
}: Props) {
  const navigate = useNavigate();
  const store = useRecoilValue(storeState);
  const [cart, setCart] = useRecoilState(clearingCartState);
  const { clearingPaymentTotal } = useClearingCart();
  const [tooltipVisibleId, setTooltipVisibleId] = useState(-1);

  const [searchQuery, setSearchQuery] = useState({
    search_string: '',
  });

  // 거래처 검색(default : 전체)
  const filteredList = useMemo(
    () =>
      cart.warehousingBalanceList.filter((item) =>
        item.vendor_info.vendor_name.includes(searchQuery.search_string),
      ),
    [cart.warehousingBalanceList, searchQuery],
  );

  // 정산서 생성 및 정산 상품추가
  const createClearingQuery = useMutation(
    ['createClearing'],
    clearingAPI.create,
    {
      onSuccess: () => {
        message.success(t('message.success create clearing'));
        clickCreate();
        navigate('/clearing/list');
      },
    },
  );

  // 전액 체우기
  const handlePaymentInputFiilIn = () => {
    setCart((cart) => ({
      ...cart,
      warehousingBalanceList: cart.warehousingBalanceList.map((item) => {
        return {
          ...item,
          clearing_payment_amount: item.clearing_amount,
        };
      }),
    }));
  };

  useEffect(() => {
    // 당일 결제요청 금액 계산
    setCart((cart) => ({
      ...cart,
      warehousingBalanceList: cart.warehousingBalanceList
        .map((warehousingBalanceItem) => {
          const newWarehousingBalanceItem = {
            ...warehousingBalanceItem,
          };
          // 매입 차감을 warehousing으로 넘겨준다.
          cart.adjustmentSubtractList.forEach((adjustmentSubtractItem) => {
            if (
              adjustmentSubtractItem.vendor_info.id ===
              newWarehousingBalanceItem.vendor_info.id
            ) {
              newWarehousingBalanceItem.overpaid_payment_amount =
                adjustmentSubtractItem.overpaid_payment_amount! ?? 0;
            }
          });

          return newWarehousingBalanceItem;
        })
        .map((warehousingBalanceItem) => ({
          // 입고 + 미결제 + 미송 결제 - 매입 차감
          ...warehousingBalanceItem,
          clearing_amount:
            warehousingBalanceItem.warehousing_amount +
            warehousingBalanceItem.unpaid_amount +
            warehousingBalanceItem.reserve_payment_amount -
            (warehousingBalanceItem.overpaid_payment_amount! ?? 0),
          // 당일 결제예정 금액 최소금액은 미송결제금액.
          clearing_payment_amount:
            warehousingBalanceItem.reserve_payment_amount,
        })),
    }));
  }, [activeKey, setCart]);
  return (
    <>
      <Collapse.Panel
        {...props}
        style={{
          border: `${
            activeKey === '2' ? '1px solid rgba(227, 230, 234, 1)' : 'none'
          }`,
        }} // #E3E6EA
        showArrow={false}
        extra={
          <Typography.Text style={{ color: '#242934' }}>
            {activeKey === '2' ? <DownOutlined /> : <RightOutlined />}
          </Typography.Text>
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
              <TurtleTableTitle count={cart.warehousingBalanceList.length}>
                <Row>
                  <Col style={{ marginRight: 10 }}>
                    <TurtleButtonSub
                      size="small"
                      type="primary"
                      onClick={handlePaymentInputFiilIn}
                    >
                      전액 입력하기
                    </TurtleButtonSub>
                  </Col>
                  <Col>
                    <NewSearchFilter
                      select={false}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                    />
                  </Col>
                </Row>
              </TurtleTableTitle>
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
              align: 'right',
              title: '당일 결제요청 금액',
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
              align: 'right',
              ellipsis: true,
              title: '부가세 입금 여부',
              render: (_, record) => (
                <Tag
                  color={!record.vendor_info.is_vat_included ? 'green' : 'red'}
                >
                  {!record.vendor_info.is_vat_included ? '포함' : '미 포함'}
                </Tag>
              ),
            },
            {
              width: '48%',
              ellipsis: true,
              align: 'center',
              title: '당일 결제예정 금액',
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
                  max={record.clearing_amount}
                  min={record.reserve_payment_amount}
                  onChange={(value) => {
                    setCart((cart) => ({
                      ...cart,
                      warehousingBalanceList: cart.warehousingBalanceList.map(
                        (item) =>
                          item.vendor_info.id === record.vendor_info.id
                            ? {
                                ...item,
                                clearing_payment_amount: value,
                              }
                            : item,
                      ),
                    }));
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
            <TurtleButton
              disabled={clearingPaymentTotal === 0}
              children={t('button.request clearing')}
              loading={createClearingQuery.isLoading}
              onClick={() => {
                createClearingQuery.mutate({
                  sheet: {
                    store_id: store.id,
                    credit_type: 'general',
                    store_name: store.name,
                    request_date: clearingRequestDate,
                  },
                  item: {
                    rt_store_id: store.id,
                    rt_store_name: store.name,
                    // 당일 결제 합계
                    clearing_amount_list: cart.warehousingBalanceList
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
            />
          </Col>
        </Row>
      </Collapse.Panel>
    </>
  );
}

export default ClearingPanel;
