import { t } from 'i18next';
import {
  Col,
  Collapse,
  CollapsePanelProps,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Table,
  Typography,
} from 'antd';

import { useMemo, useState } from 'react';
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
import moment from 'moment';

interface Props extends CollapsePanelProps {
  activeKey: string | string[];
  clickCreate: () => void;
}

function ClearingPanel({ activeKey, clickCreate, ...props }: Props) {
  const navigate = useNavigate();

  const store = useRecoilValue(storeState);
  const [cart, setCart] = useRecoilState(clearingCartState);
  const { handleClearingPaymentTotal } = useClearingCart();

  const [searchQuery, setSearchQuery] = useState({
    search_string: '',
  });

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

  // 거래처 검색(default : 전체)
  const searchedClearingList = useMemo(
    () =>
      cart.warehousingBalanceList.filter((item) =>
        item.vendor_info.vendor_name.includes(searchQuery.search_string),
      ),
    [cart.warehousingBalanceList, searchQuery],
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

    return;
  };

  return (
    <Collapse.Panel
      {...props}
      showArrow={false}
      extra={
        <Typography.Text style={{ color: '#242934' }}>
          {activeKey === '2' ? 'v' : '>'}
        </Typography.Text>
      }
    >
      <Table
        size="small"
        pagination={false}
        loading={activeKey !== '2'}
        dataSource={searchedClearingList}
        rowKey="id"
        title={() => (
          <>
            <TurtleTableTitle count={cart.warehousingBalanceList.length}>
              <Row>
                <Col style={{ marginRight: 10 }}>
                  <TurtleButtonSub
                    size="small"
                    type="primary"
                    onClick={() => {
                      handlePaymentInputFiilIn();
                    }}
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
        columns={[
          {
            ellipsis: true,
            title: '거래처 명',
            render: (_, record) => record.vendor_info.vendor_name,
          },
          {
            ellipsis: true,
            title: '미결제 금액',
            render: (_, record) => record.unpaid_amount,
          },
          {
            ellipsis: true,
            align: 'right',
            title: '당일 결제요청 금액',
            render: (_, record) => record.clearing_amount ?? 0,
          },
          {
            ellipsis: true,
            align: 'right',
            title: '당일 결제예정 금액',
            render: (_, record) => (
              <InputNumber
                size="small"
                formatter={(value) => `${value}`.replace(pricePattern, ',')}
                placeholder="금액 입력"
                value={record.clearing_payment_amount!}
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
          {
            title: '',
          },
        ]}
      />

      {/*
       *
       * 결제요청
       *
       */}

      <Row justify="end" align="middle" style={{ marginTop: 16 }}>
        <Col>
          <Typography.Text style={{ color: ' #6B6D73' }}>
            총 당일 결제 합계
          </Typography.Text>

          <Typography.Text style={{ fontWeight: 700 }}>
            {handleClearingPaymentTotal.toLocaleString()}원
          </Typography.Text>
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
                  request_date: moment().format('YYYY-MM-DD'),
                },
                item: {
                  rt_store_id: store.id,
                  rt_store_name: store.name,
                  // 당일 결제 합계
                  clearing_amount_list: cart.warehousingBalanceList.map(
                    (item) => ({
                      vendor_id: item.vendor_info.id,
                      clearing_amount: item.clearing_payment_amount!,
                    }),
                  ),
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
            <TurtleButton
              width="180px"
              children={t('button.request clearing')}
              loading={createClearingQuery.isLoading}
            />
          </Popconfirm>
        </Col>
      </Row>
    </Collapse.Panel>
  );
}

export default ClearingPanel;
