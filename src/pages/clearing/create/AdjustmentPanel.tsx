import moment from 'moment';
import { t } from 'i18next';
import {
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
  const { adjustmentAmount } = useClearingCart();

  const getAdjustmentBalanceQuery = useQuery(
    ['getAdjustmentBalance'],
    () =>
      clearingAPI.getAdjustmentBalance({
        rt_store_id: store.id!,
        vendor_id_list: cart.warehousingBalanceList
          .filter((item) => item.clearing_amount !== 0)
          .map((item) => item.vendor_info.id),
      }),
    {
      enabled: activeKey === '2',
      onSuccess: (data) => {
        setCart((cart) => ({
          ...cart,
          adjustmentBalanceList: data.item_list.map((adjustmentItem) => ({
            ...adjustmentItem,
            max_clearing_amount: cart.warehousingBalanceList
              .filter(
                (warehousingItem) =>
                  warehousingItem.vendor_info.id ===
                  adjustmentItem.vendor_info.id,
              )
              .map((warehousingItem) => warehousingItem.clearing_amount)
              .reduce((cur, acc) => cur + acc, 0),
          })),
        }));
      },
    },
  );

  return (
    <Collapse.Panel
      {...props}
      extra={
        <Typography.Text style={{ color: '#5B5D63' }}>
          {`총 차감 금액 : ${adjustmentAmount.toLocaleString()}원`}
        </Typography.Text>
      }
    >
      <Table
        size="small"
        pagination={false}
        loading={getAdjustmentBalanceQuery.isLoading}
        dataSource={cart.adjustmentBalanceList}
        rowKey="id"
        title={() => (
          <TurtleTableTitle
            count={getAdjustmentBalanceQuery.data?.total_count ?? 0}
          >
            <Space size="large">
              <TurtleButtonSub
                size="small"
                type="primary"
                onClick={() => {
                  setCart((cart) => ({
                    ...cart,
                    adjustmentBalanceList: cart.adjustmentBalanceList.map(
                      (item) => ({
                        ...item,
                        clearing_amount: Math.min(
                          item.overpaid_amount,
                          item.max_clearing_amount ?? 0,
                        ),
                      }),
                    ),
                  }));
                }}
              >
                전액 입력하기
              </TurtleButtonSub>
            </Space>
          </TurtleTableTitle>
        )}
        columns={[
          {
            ellipsis: true,
            title: '등록 날짜',
            render: (_, record) =>
              moment(record.created_time).format('YYYY-MM-DD'),
          },
          {
            ellipsis: true,
            title: t('vendor.name'),
            render: (_, record) => record.vendor_info.vendor_name,
          },
          {
            ellipsis: true,
            title: '사용 가능 금액',
            render: (_, record) => record.overpaid_amount.toLocaleString(),
          },
          {
            ellipsis: true,
            title: (
              <>
                사용할 금액
                <TurtleQuestionTooltip content="사용할 금액은 당일 입고 금액을 초과할 수 없습니다." />
              </>
            ),
            render: (_, record) => (
              <Space>
                <InputNumber
                  size="small"
                  formatter={(value) => `${value}`.replace(pricePattern, ',')}
                  placeholder="금액 입력"
                  step={1000}
                  min={0}
                  max={Math.min(
                    record.overpaid_amount,
                    record.max_clearing_amount ?? 0,
                  )}
                  value={record.clearing_amount}
                  onChange={(value) => {
                    setCart((cart) => ({
                      ...cart,
                      adjustmentBalanceList: cart.adjustmentBalanceList.map(
                        (item) =>
                          item.id === record.id
                            ? {
                                ...item,
                                clearing_amount: value,
                              }
                            : item,
                      ),
                    }));
                  }}
                />
              </Space>
            ),
          },
        ]}
      />
      <Row justify="end" align="middle" style={{ marginTop: 16 }}>
        <TurtleButton //
          children={t('button.next step')}
          onClick={() => {
            clickNext();
          }}
        />
      </Row>
    </Collapse.Panel>
  );
}

export default AdjustmentPanel;
