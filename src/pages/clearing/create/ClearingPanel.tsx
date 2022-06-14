import moment from 'moment';
import styled from 'styled-components';
import { t } from 'i18next';
import {
  Card,
  Col,
  Collapse,
  CollapsePanelProps,
  message,
  Popconfirm,
  Row,
} from 'antd';
import { useMutation, useQuery } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import { clearingCartState } from '@store/clearingCartState';
import { useClearingCart } from '@hooks/index';
import { TurtleButton } from '@components/common';
import { storeState } from '@store/storeState';
import adjustmentAPI from '@apis/adjustmentAPI';
import clearingAPI from '@apis/clearingAPI';

interface Props extends CollapsePanelProps {
  activeKey: string | string[];
  clickCreate: () => void;
}

function ClearingPanel({ activeKey, clickCreate, ...props }: Props) {
  const store = useRecoilValue(storeState);
  const [cart, setCart] = useRecoilState(clearingCartState);
  const [
    totalDepositPrice,
    totalVatPrice,
    totalReserveSubtractPrice,
    totalSubtractPrice,
    totalReservePrice,
    totalPrice,
  ] = useClearingCart();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getTodayReserveListQuery = useQuery(
    ['getTodayReserveList'],
    () =>
      adjustmentAPI.getList({
        rt_store_id: store.id,
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
        type: 'reserve',
        original_id: 0,
      }),
    {
      enabled: activeKey === '3',
      onSuccess: (data) => {
        setCart({
          ...cart,
          reserve_item_list: data.data.adjustment_list.map((item) => ({
            adjustment_item_id: item.id,
            ws_store_id: item.ws_store_id,
            vendor_id: item.vendor_info.id,
            price: item.price * item.count,
            is_vat_included: item.is_vat_included,
          })),
        });
      },
    },
  );

  const createClearingQuery = useMutation(
    ['createClearing'],
    clearingAPI.create,
    {
      onSuccess: () => {
        message.success(t('message.success create clearing'));
        clickCreate();
      },
    },
  );

  return (
    <Collapse.Panel {...props} style={{ border: '1px solid #e3e6ea' }}>
      <StyledCard>
        <Row>
          <Col span={3}>입고</Col>
          <Col>
            + {(totalDepositPrice ?? 0).toLocaleString()} 원 (부가세{' '}
            {(totalVatPrice ?? 0).toLocaleString()}원 포함)
          </Col>
        </Row>
      </StyledCard>
      <StyledCard>
        <Row>
          <Col span={3}>당일 미송</Col>
          <Col>+ {(totalReservePrice ?? 0).toLocaleString()} 원</Col>
        </Row>
      </StyledCard>
      <StyledCard>
        <Row>
          <Col span={3}>매입 차감</Col>
          <Col>- {(totalSubtractPrice ?? 0).toLocaleString()} 원</Col>
        </Row>
      </StyledCard>
      <StyledCard>
        <Row>
          <Col span={3}>미송입고 차감</Col>
          <Col>- {(totalReserveSubtractPrice ?? 0).toLocaleString()} 원</Col>
        </Row>
      </StyledCard>

      <Row
        justify="space-between"
        align="middle"
        style={{
          marginTop: 16,
          paddingLeft: 16,
          paddingTop: 16,
          color: '#5b5d63',
          borderTop: '1px solid #e3e6ea',
        }}
      >
        <Col span={1}>
          <b>합계</b>
        </Col>
        <Col span={17}>
          <b>
            {(totalPrice ?? 0).toLocaleString()} 원 (부가세{' '}
            {(totalVatPrice ?? 0).toLocaleString()}원 포함)
          </b>
        </Col>
        <Col>
          <Popconfirm
            title={t('description.really register')}
            okText={t('yes')}
            cancelText={t('no')}
            onConfirm={() => {
              createClearingQuery.mutate({
                sheet: {
                  store_id: store.id,
                  credit_type: 'general',
                  store_name: store.name,
                  total_clearing_amount: totalPrice!,
                },
                item: {
                  rt_store_id: store.id,
                  rt_store_name: store.name,
                  warehousing_item_list: cart.warehousing_item_list,
                  subtract_item_list: cart.subtract_item_list,
                  reserve_item_list: cart.reserve_item_list,
                },
              });
            }}
          >
            <TurtleButton
              disabled={totalPrice === 0}
              loading={createClearingQuery.isLoading}
            >
              {t('button.request clearing')}
            </TurtleButton>
          </Popconfirm>
        </Col>
      </Row>
    </Collapse.Panel>
  );
}

const StyledCard = styled(Card)`
  border: none;
  .ant-card-body {
    padding: 6px 16px;
    color: #5b5d63;
    background-color: #fbfcfe;
  }
`;

export default ClearingPanel;
