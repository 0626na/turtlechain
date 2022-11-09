import React from 'react';
import orderAPI, { CreatingOrdersItem, OrderItemList } from '@apis/orderAPI';
import { TurtleContentModal } from '@components/combine';
import { AnswerButton } from '@components/element';
import useOrderCart from '@hooks/useOrderCart';
import { Col, message, Row, Space, Typography } from 'antd';
import moment from 'moment';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

interface Props {
  visible: boolean;
  close: () => void;
}

function ConfirmOrderModal({ visible, close }: Props) {
  const { cart, date, reset } = useOrderCart();
  const navigate = useNavigate();

  //발주서 등록
  const createOrderItemMutation = useMutation(orderAPI.createOrderItem, {
    onSuccess: (data) => {
      if (data.msg === 'success') {
        message.success('발주서 등록이 완료되었습니다.', 4);
        close();
        reset();
        navigate('/order/history');
      }
    },
  });

  return (
    <>
      <TurtleContentModal
        size="small"
        title="정말 발주할까요?"
        visible={visible}
        onClose={close}
      >
        <Space direction="vertical">
          <Typography.Paragraph>
            실패에 남아있는 건은 발주에서 제외됩니다. <br />
            발주 정보를 다시 한번 확인해주세요.
          </Typography.Paragraph>

          <Typography.Text style={{ fontSize: 16, fontWeight: 500 }}>
            {`발주일자: ${moment().format('YYYY-MM-DD')}   `}
          </Typography.Text>
          <Typography.Text
            style={{ fontSize: 16, fontWeight: 500 }}
          >{`총 발주수량:  ${cart.successList.length}개  `}</Typography.Text>
          <Typography.Text
            style={{ fontSize: 16, fontWeight: 500 }}
          >{`총 발주금액: ${cart.successList
            .reduce(
              (acc, store) =>
                acc +
                store.orders.reduce(
                  (acc, order) => acc + Number(order.product_price),
                  0,
                ),
              0,
            )
            .toLocaleString()}원`}</Typography.Text>
        </Space>

        <Row justify="end">
          <Col style={{ marginRight: 10 }}>
            <AnswerButton type="NO" text="취소" onClick={close} />
          </Col>
          <Col>
            <AnswerButton
              type="YES"
              text="요청"
              onClick={() =>
                createOrderItemMutation.mutate({
                  rt_stores: cart.successList.map<OrderItemList>((store) => ({
                    rt_store_id: store.rt_store_id,
                    request_date: date.date.format('YYYY-MM-DD'),
                    orders: store.orders.map<CreatingOrdersItem>((order) => ({
                      vendor_name: order.vendor_name,
                      vendor_address: order.vendor_address,
                      vendor_mobile: order.vendor_mobile,
                      mobile: order.vendor_mobile,
                      product_name: order.product_name,
                      product_option: order.product_option,
                      product_count: Number(order.product_count),
                      product_price: Number(order.product_price),
                      order_type: order.order_type,
                      creation_type: order.creation_type,
                      memo: order.memo,
                      ws_store_id: order.ws_store_info[0].id,
                    })),
                  })),
                })
              }
            />
          </Col>
        </Row>
      </TurtleContentModal>
    </>
  );
}

export default ConfirmOrderModal;
