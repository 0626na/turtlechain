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
  TurtleTableTitle,
} from '@components/common';
import { clearingCartState } from '@store/clearingCartState';
import clearingAPI from '@apis/clearingAPI';
import { pricePattern } from '@utils/pattern';
import { storeState } from '@store/storeState';
import useClearingCart from '@hooks/useClearingCart';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

interface Props extends CollapsePanelProps {
  activeKey: string | string[];
  clickNext: () => void;
}

function AdjustmentPanel({ activeKey, clickNext, ...props }: Props) {
  const store = useRecoilValue(storeState);
  const [cart, setCart] = useRecoilState(clearingCartState);

  const { reservePaymentAmountTotal, subtractAmountTotal } = useClearingCart();

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
        let index = 0;
        setCart({
          warehousingBalanceList: data.item_list
            .filter(
              (item) =>
                item.warehousing_amount +
                  item.unpaid_amount +
                  item.reserve_payment_amount >
                0,
            )
            .map((item) => ({
              ...item,
              id: index++,
              type: 'warehousing',
            })),

          adjustmentSubtractList: data.item_list
            .filter(
              (item) =>
                item.warehousing_amount + item.unpaid_amount > 0 &&
                item.overpaid_amount > 0,
            )
            .map((item) => ({
              ...item,
              id: index++,
              type: 'adjustment_subtract',
            })),

          reserveSubtractList: data.item_list
            .filter((item) => item.reserve_subtract_amount > 0)
            .map((item) => ({
              ...item,
              id: index++,
              type: 'reserve_subtract',
            })),

          reservePaymentList: data.item_list
            .filter((item) => item.reserve_payment_amount > 0)
            .map((item) => ({
              ...item,
              id: index++,
              type: 'reserve_payment',
            })),
        });
      },
    },
  );

  const handlePaymentInputFiilIn = () => {
    setCart((cart) => ({
      ...cart,
      adjustmentSubtractList: cart.adjustmentSubtractList.map((item) => ({
        ...item,
        // 사용 가능 금액이 입고 금액보다 크면, 입고금액을 넣어준다.
        overpaid_payment_amount:
          item.overpaid_amount > item.warehousing_amount
            ? item.warehousing_amount
            : item.overpaid_amount,
      })),
    }));

    return;
  };

  return (
    <Collapse.Panel
      {...props}
      style={{
        border: `${
          activeKey === '1' ? '1px solid rgba(227, 230, 234, 1)' : 'none'
        }`,
      }} // #E3E6EA
      showArrow={false}
      extra={
        <Typography.Text style={{ color: '#242934' }}>
          {activeKey === '1' ? <DownOutlined /> : <RightOutlined />}
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
        rowKey={(record) => record.id}
        title={() => (
          <TurtleTableTitle
            label="차감"
            count={
              cart.adjustmentSubtractList.length +
              cart.reserveSubtractList.length
            }
          >
            <TurtleButtonSub
              size="small"
              type="primary"
              onClick={() => {
                handlePaymentInputFiilIn();
              }}
            >
              전액 입력하기
            </TurtleButtonSub>
          </TurtleTableTitle>
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
                // 사용 가능 금액이 입고 금액보다 크면, 입고금액을 보여준다.
                return record.overpaid_amount > record.warehousing_amount
                  ? record.warehousing_amount.toLocaleString()
                  : record.overpaid_amount.toLocaleString();
              }

              if (record.type === 'reserve_subtract') {
                return record.reserve_subtract_amount.toLocaleString();
              }
            },
          },
          {
            ellipsis: true,
            align: 'right',
            title: '사용할 금액',
            render: (_, record) => (
              <Space>
                {record.type === 'reserve_subtract' ? (
                  <InputNumber
                    size="small"
                    value={record.reserve_subtract_amount}
                    disabled={true}
                  />
                ) : (
                  <InputNumber
                    size="small"
                    formatter={(value) => `${value}`.replace(pricePattern, ',')}
                    placeholder="금액 입력"
                    value={record.overpaid_payment_amount}
                    step={1000}
                    //입력금액중 최고 금액은 입고 금액.
                    max={record.warehousing_amount}
                    min={0}
                    onChange={(value) => {
                      setCart((cart) => ({
                        ...cart,
                        adjustmentSubtractList: cart.adjustmentSubtractList.map(
                          (item) =>
                            item.id === record.id
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
        rowKey={(record) => record.id}
        title={() => (
          <TurtleTableTitle
            label="미송"
            count={cart.reservePaymentList.length}
          ></TurtleTableTitle>
        )}
        columns={[
          {
            width: '40%',
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
          <TurtleButton
            children={t('button.next step')}
            onClick={() => {
              clickNext();
            }}
          />
        </Col>
      </Row>
    </Collapse.Panel>
  );
}

export default AdjustmentPanel;
