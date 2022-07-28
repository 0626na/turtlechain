import moment from 'moment';
import { t } from 'i18next';
import {
  Col,
  Collapse,
  CollapsePanelProps,
  InputNumber,
  Row,
  Space,
  Table,
  Typography,
} from 'antd';
import { useQuery } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  TurtleButton,
  TurtleButtonSub,
  TurtleQuestionTooltip,
  TurtleTableTitle,
} from '@components/common';
import { clearingCartState } from '@store/clearingCartState';
import clearingAPI from '@apis/clearingAPI';
import { pricePattern } from '@utils/pattern';
import { storeState } from '@store/storeState';
import useClearingCart from '@hooks/useClearingCart';

interface Props extends CollapsePanelProps {
  activeKey: string | string[];
  clickNext: () => void;
}

function AdjustmentPanel({ activeKey, clickNext, ...props }: Props) {
  const store = useRecoilValue(storeState);
  const [cart, setCart] = useRecoilState(clearingCartState);
  const { handleReservePaymentAmountTotal, handleSubtractAmountTotal } =
    useClearingCart();

  const getRetailerStoreClearingQuery = useQuery(
    ['getRetailerStoreClearing', store.id!],
    () =>
      clearingAPI.getClearing({
        rt_store_id: store.id!,
        balance_type: 'clearing',
      }),
    {
      enabled: activeKey === '1',
      onSuccess: (data) => {
        setCart({
          warehousingBalanceList: data.item_list
            .filter((item) => item.warehousing_amount > 0)
            .map((item) => ({ ...item, type: 'warehousing' })),

          adjustmentSubtractList: data.item_list
            .filter(
              (item) =>
                item.warehousing_amount +
                  item.unpaid_amount -
                  item.reserve_subtract_amount >
                  0 && item.overpaid_amount > 0,
            )
            .map((item) => ({
              ...item,
              type: 'adjustment_subtract',
            })),

          reserveSubtractList: data.item_list
            .filter((item) => item.reserve_subtract_amount > 0)
            .map((item) => ({ ...item, type: 'reserve_subtract' })),

          reservePaymentList: data.item_list
            .filter((item) => item.reserve_payment_amount > 0)
            .map((item) => ({ ...item, type: 'reserve_payment' })),
        });
      },
    },
  );

  const handlePaymentInputFiilIn = () => {
    setCart((cart) => ({
      ...cart,
      adjustmentSubtractList: cart.adjustmentSubtractList.map((item) => {
        return {
          ...item,
          overpaid_payment_amount: item.overpaid_amount,
        };
      }),
    }));

    return;
  };

  return (
    <Collapse.Panel
      {...props}
      showArrow={false}
      extra={
        <Typography.Text style={{ color: '#242934' }}>
          {activeKey === '1' ? 'v' : '>'}
        </Typography.Text>
      }
    >
      {/*
       *  차감
       */}

      <Table
        size="small"
        pagination={false}
        loading={getRetailerStoreClearingQuery.isLoading}
        dataSource={[
          ...cart.adjustmentSubtractList,
          ...cart.reserveSubtractList,
        ]}
        rowKey="id"
        title={() => (
          <>
            <TurtleTableTitle
              label="차감"
              count={
                cart.adjustmentSubtractList.length +
                cart.reserveSubtractList.length
              }
            >
              <Space size="large">
                <TurtleButtonSub
                  size="small"
                  type="primary"
                  onClick={() => {
                    handlePaymentInputFiilIn();
                  }}
                >
                  전액 입력하기
                </TurtleButtonSub>
              </Space>
            </TurtleTableTitle>
          </>
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
            title: '매입조정 종류',
            render: (_, record) => {
              // i18
              if (record.type === 'adjustment_subtract') return '매입 차감';
              if (record.type === 'reserve_subtract') return '미송 차감';
            },
          },
          {
            ellipsis: true,
            title: t('vendor.name'),
            render: (_, record) => record.vendor_info.vendor_name,
          },
          {
            ellipsis: true,
            align: 'right',
            title: '사용 가능 금액',
            render: (_, record) => {
              if (record.type === 'adjustment_subtract') {
                return record.overpaid_amount.toLocaleString();
              }

              if (record.type === 'reserve_subtract') {
                return record.reserve_subtract_amount.toLocaleString();
              }
            },
          },
          {
            ellipsis: true,
            align: 'right',
            title: (
              <>
                사용할 금액
                <TurtleQuestionTooltip content="사용할 금액은 당일 입고 금액을 초과할 수 없습니다." />
              </>
            ),
            render: (_, record) => (
              <Space>
                {record.type === 'reserve_subtract' ? (
                  <InputNumber
                    value={record.reserve_subtract_amount ?? 0}
                    disabled={true}
                  />
                ) : (
                  <InputNumber
                    size="small"
                    formatter={(value) => `${value}`.replace(pricePattern, ',')}
                    placeholder="금액 입력"
                    value={record.overpaid_payment_amount}
                    step={1000}
                    min={0}
                    max={record.overpaid_amount}
                    onChange={(value) => {
                      setCart((cart) => ({
                        ...cart,
                        adjustmentSubtractList: cart.adjustmentSubtractList.map(
                          (item) =>
                            item.vendor_info.id === record.vendor_info.id
                              ? {
                                  ...item,
                                  overpaid_payment_amount: value,
                                }
                              : item,
                        ),
                      }));
                    }}
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

      <Table
        size="small"
        pagination={false}
        loading={getRetailerStoreClearingQuery.isLoading}
        dataSource={[...cart.reservePaymentList]}
        rowKey="id"
        title={() => (
          <TurtleTableTitle
            label="미송"
            count={cart.reservePaymentList.length}
          ></TurtleTableTitle>
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
            title: '사용 가능 금액',
            align: 'right',
            render: (_, record) => record.reserve_payment_amount,
          },
          {
            ellipsis: true,
            align: 'right',
          },
          {
            ellipsis: true,
            align: 'right',
          },
        ]}
      />

      <Row justify="end" align="middle" style={{ marginTop: 16 }}>
        <Col>
          <Typography.Text style={{ color: ' #6B6D73', marginRight: 8 }}>
            총 차감 합계
          </Typography.Text>
          <Typography.Text style={{ fontWeight: 700 }}>
            {handleSubtractAmountTotal.toLocaleString()}원
          </Typography.Text>
        </Col>
        <Col style={{ marginLeft: 8, marginRight: 8 }}>/</Col>
        <Col style={{ marginRight: 24 }}>
          <Typography.Text style={{ color: ' #6B6D73', marginRight: 8 }}>
            총 미송 합계
          </Typography.Text>
          <Typography.Text style={{ fontWeight: 700 }}>
            {handleReservePaymentAmountTotal.toLocaleString()}원
          </Typography.Text>
        </Col>
        <Col>
          <TurtleButton
            width="180px"
            children={t('button.next step')}
            onClick={() => {
              setCart((cart) => ({
                ...cart,
                warehousingBalanceList: cart.warehousingBalanceList
                  .map((warehousingBalanceItem) => {
                    // 입고 + 미결제 + 미송결제 합계.
                    return {
                      ...warehousingBalanceItem,
                      clearing_amount:
                        warehousingBalanceItem.warehousing_amount +
                        warehousingBalanceItem.unpaid_amount +
                        (warehousingBalanceItem.reserve_payment_amount ?? 0),
                    };
                  })
                  .map((warehousingBalanceItem) => {
                    const newWarehousingBalanceItem = {
                      ...warehousingBalanceItem,
                    };

                    // 미송 차감.
                    newWarehousingBalanceItem.clearing_amount =
                      newWarehousingBalanceItem.clearing_amount -
                      (newWarehousingBalanceItem.reserve_subtract_amount! ?? 0);

                    // 매입 차감.
                    cart.adjustmentSubtractList.forEach(
                      (adjustmentSubtractItem) => {
                        if (
                          adjustmentSubtractItem.vendor_info.id ===
                          newWarehousingBalanceItem.vendor_info.id
                        ) {
                          newWarehousingBalanceItem.clearing_amount =
                            newWarehousingBalanceItem.clearing_amount -
                            (adjustmentSubtractItem.overpaid_payment_amount! ??
                              0);
                        }
                      },
                    );

                    return newWarehousingBalanceItem;
                  }),
              }));
              clickNext();
            }}
          />
        </Col>
      </Row>
    </Collapse.Panel>
  );
}

export default AdjustmentPanel;
