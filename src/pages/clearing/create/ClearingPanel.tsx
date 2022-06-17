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
import { useHistory } from 'react-router-dom';
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
  const history = useHistory();
  const store = useRecoilValue(storeState);
  const [cart, setCart] = useRecoilState(clearingCartState);
  const {
    warehousingSupplyAmount,
    adjustmentSupplyAmount,
    reserveSupplyAmount,
    reserveSubtractAmount,
  } = useClearingCart();

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
          reserveBalanceList: data.data.adjustment_list,
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
        history.push('/clearing/list');
      },
    },
  );

  return (
    <Collapse.Panel {...props} style={{ border: '1px solid #e3e6ea' }}>
      <StyledCard>
        <Row>
          <Col span={3}>입고</Col>
          <Col>{`+ ${Math.round(
            warehousingSupplyAmount * 1.1,
          ).toLocaleString()}원 (부가세 ${Math.round(
            warehousingSupplyAmount * 0.1,
          ).toLocaleString()}원 포함)`}</Col>
        </Row>
      </StyledCard>
      <StyledCard>
        <Row>
          <Col span={3}>당일 미송 추가</Col>
          <Col>{`+ ${Math.round(
            reserveSupplyAmount * 1.1,
          ).toLocaleString()}원 (부가세 ${Math.round(
            reserveSupplyAmount * 0.1,
          ).toLocaleString()}원 포함)`}</Col>
        </Row>
      </StyledCard>
      <StyledCard>
        <Row>
          <Col span={3}>미송 입고 차감</Col>
          <Col>{`- ${Math.round(
            reserveSubtractAmount * 1.1,
          ).toLocaleString()}원 (부가세 ${Math.round(
            reserveSubtractAmount * 0.1,
          ).toLocaleString()}원 포함)`}</Col>
        </Row>
      </StyledCard>
      <StyledCard>
        <Row>
          <Col span={3}>매입 조정 차감</Col>
          <Col>
            {`- ${Math.round(
              adjustmentSupplyAmount * 1.1,
            ).toLocaleString()}원 (부가세 
            ${Math.round(
              adjustmentSupplyAmount * 0.1,
            ).toLocaleString()}원 포함)`}
          </Col>
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
            {`${Math.round(
              (warehousingSupplyAmount - adjustmentSupplyAmount) * 1.1,
            ).toLocaleString()}
            원 (부가세 ${Math.round(
              Math.round(warehousingSupplyAmount - adjustmentSupplyAmount) *
                0.1,
            ).toLocaleString()}원 포함)`}
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
                },
                item: {
                  rt_store_id: store.id,
                  rt_store_name: store.name,
                  clearing_amount_list: cart.warehousingBalanceList.map(
                    (item) => ({
                      vendor_id: item.vendor_info.id,
                      clearing_amount: item.clearing_amount,
                    }),
                  ),
                  reserve_amount_list: cart.reserveSubtractList.map((item) => ({
                    vendor_id: item.vendor_info.id,
                    reserve_amount: item.reserve_amount,
                  })),
                  subtract_amount_list: cart.adjustmentBalanceList
                    .filter((item) => item.clearing_amount > 0)
                    .map((item) => ({
                      vendor_id: item.vendor_info.id,
                      subtract_amount: item.clearing_amount,
                    })),
                },
              });
            }}
          >
            <TurtleButton
              disabled={warehousingSupplyAmount - adjustmentSupplyAmount === 0}
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
