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
  Tooltip,
  Typography,
} from 'antd';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import {
  TurtleButton,
  TurtleButtonSub,
  TurtleTableTitle,
} from '@components/common';
import clearingAPI from '@apis/clearingAPI';
import { pricePattern } from '@utils/pattern';
import { storeState } from '@store/storeState';
import useClearingCart from '@hooks/useClearingCart';
import {
  DownOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from '@ant-design/icons';

interface Props extends CollapsePanelProps {
  activeKey: string | string[];
  clickNext: () => void;
  clearingRequestDate: string;
}

function AdjustmentPanel({
  activeKey,
  clickNext,
  clearingRequestDate,
  ...props
}: Props) {
  const store = useRecoilValue(storeState);

  const {
    cart,
    reservePaymentAmountTotal,
    subtractAmountTotal,
    separate,
    handleAdjustmentSubtract,
    fillAllAdjustmentSubtract,
  } = useClearingCart();

  const getStoreClearingQuery = useQuery(
    ['getStoreClearingQuery', store.id!, clearingRequestDate],
    () =>
      clearingAPI.getClearing({
        rt_store_id: store.id!,
        balance_type: 'clearing',
        clearing_request_date: clearingRequestDate,
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
        loading={getStoreClearingQuery.isLoading}
        dataSource={[
          ...cart.adjustmentSubtractList,
          ...cart.reserveSubtractList,
        ]}
        rowKey={(record) => record.id!}
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
                fillAllAdjustmentSubtract();
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
            render: (_, record) =>
              // i18
              record.type === 'adjustment_subtract' ? '매입 차감' : '미송 차감',
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
                  사용할 금액
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

      <Table
        size="small"
        pagination={false}
        loading={getStoreClearingQuery.isLoading}
        dataSource={[...cart.reservePaymentList]}
        rowKey={(record) => record.id!}
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
