import adjustmentAPI from '@apis/adjustmentAPI';
import { TurtleContentModal } from '@components/combine';
import {
  PrimaryButton,
  TurtlePanelTitle,
  TurtleText,
} from '@components/element';
import { css } from '@emotion/react';
import useAdjustmentCart from '@hooks/useAdjustmentCart';
import useStore from '@hooks/useStore';

import { Col, Collapse, message, Row } from 'antd';
import { t } from 'i18next';

import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

import ExchangeRefundPanel from '../panel/ExchangeRefundPanel';
import WarehousingPanel from '../panel/WarehousingPanel';
import { QueryClient } from 'react-query';
interface Props {
  onClose: () => void;
  visible: boolean;
}

function ExchangeRefundModal({ onClose, visible }: Props) {
  const [activeKey, setActiveKey] = useState('1');
  const { cart, setCart } = useAdjustmentCart();
  const { store } = useStore();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  const handleModalClose = () => {
    onClose();
  };

  // 교환반품 생성 요성
  const createExchageRefundMutation = useMutation(adjustmentAPI.create, {
    onSuccess: () => {
      queryClient.refetchQueries(['getAdjustmentList'], { active: true });
      // resetStates();
      message.success('교환/반품이 성공적으로 등록되었습니다.');

      handleModalClose();
      // navigate('/adjustment/list');
    },
  });

  // 수량, 종류, 가격 입력되었는지 확인
  const handleValidationCheck = () => {
    let isVaild = true;

    cart.adjustmentItemList.forEach((item) => {
      if (
        item.type === '' ||
        item.product_count === 0 ||
        item.product_price === 0
      ) {
        isVaild = false;
        console.log('123123213');
      }
    });
    return isVaild;
  };

  const handleExchangeRefundCreate = () => {
    if (!handleValidationCheck()) {
      message.warn('교환/반품 가격,수량,종류를 확인해주세요.');
      return;
    }

    createExchageRefundMutation.mutate({
      item_list: cart.adjustmentItemList.map((item) => ({
        rt_store_id: store.selected?.id as number,
        vendor_id: item.vendor_id,
        product_id: item.product_id,
        warehousing_item_id: item.warehousing_item_id,
        count: item.product_count,
        price: item.product_price,
        type: item.type,
        memo: item.memo,
      })),
    });
  };

  useEffect(() => {
    if (visible) return;
    setCart((cart) => ({
      selectedList: [],
      adjustmentItemList: [],
    }));
    setActiveKey('1');
  }, [visible, setCart]);

  return (
    <TurtleContentModal
      visible={visible}
      onClose={handleModalClose}
      title="교환/반품 추가"
      size="large"
    >
      <Collapse
        onChange={(key) => {
          if (!key) return;

          setActiveKey(key[0]);
        }}
        activeKey={activeKey}
        css={collapse}
        accordion
        bordered={false}
      >
        <WarehousingPanel
          activeKey={activeKey}
          key="1"
          style={{ border: '1px solid red' }}
          header={
            <TurtlePanelTitle
              count={1}
              activeKey={activeKey}
              title="입고상품 불러오기"
            />
          }
        />

        <ExchangeRefundPanel
          key="2"
          header={
            <TurtlePanelTitle
              count={2}
              activeKey={activeKey}
              title="결제금액 미리보기"
            />
          }
          activeKey={activeKey}
        />
      </Collapse>

      <Row style={{ marginTop: 32 }} justify="end" align="middle">
        <Col style={{ marginRight: 24 }}>
          <TurtleText css={{ color: ' #6B6D73', marginRight: 8, fontSize: 15 }}>
            금액 합계
          </TurtleText>
          <TurtleText css={{ fontWeight: 700 }}>
            {cart.adjustmentItemList
              .map((item) => item.product_count * item.product_price)
              .reduce((totalPrice, price) => totalPrice + price, 0)
              .toLocaleString()}
            원
          </TurtleText>
        </Col>

        <Col>
          <PrimaryButton
            disabled={
              !handleValidationCheck() || cart.adjustmentItemList.length === 0
            }
            onClick={() => {
              handleExchangeRefundCreate();
            }}
          >
            매입조정 등록하기
          </PrimaryButton>
        </Col>
      </Row>
    </TurtleContentModal>
  );
}

const collapse = css`
  background-color: #fff;

  .ant-collapse-item {
    margin-bottom: 12px;
    background-color: #f3f5f8;
    border: none;
    border-radius: 10px;
  }

  .ant-collapse-content-box {
    height: 580px;
    background-color: #fff;
    padding: 24px 24px 28px 24px !important;
  }
`;

export default ExchangeRefundModal;
