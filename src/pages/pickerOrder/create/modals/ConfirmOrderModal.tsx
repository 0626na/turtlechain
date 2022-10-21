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
  const { cart, reset, calculateTotalPrice, integrationOrderList } =
    useOrderCart();
  const navigate = useNavigate();

  //발주서 등록
  const createOrderItemMutation = useMutation(orderAPI.createOrderItem, {
    onSuccess: (data) => {
      if (data.msg === 'success') {
        message.success('발주서 등록이 완료되었습니다.', 4);
        close();
        reset();
        navigate('/picker/order/history');
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
          >{`총 발주금액: ${calculateTotalPrice().toLocaleString()}원`}</Typography.Text>
        </Space>
        <Row justify="end">
          <Col style={{ marginRight: 10 }}>
            <AnswerButton type="NO" text="취소" onClick={close} />
          </Col>
          <Col>
            <AnswerButton
              type="YES"
              text="요청"
              onClick={() => {
                createOrderItemMutation.mutate({
                  rt_stores: [
                    ...integrationOrderList().map<OrderItemList>((order) => ({
                      rt_store_id: order.rt_store_id,
                      orders: order.orders.map<CreatingOrdersItem>((item) => ({
                        vendor_name: item.vendor_name,
                        vendor_address: item.vendor_address,
                        vendor_mobile: item.vendor_mobile,
                        mobile: item.mobile,
                        product_name: item.product_name,
                        product_option: item.product_option,
                        product_count: Number(item.product_count),
                        product_price: Number(item.product_price),
                        order_type: item.order_type,
                        memo: item.memo,
                        ws_store_id:
                          item.ws_store_info.length !== 0
                            ? item.ws_store_info[0].id
                            : null,
                      })),
                    })),
                  ],
                });
              }}
            />
          </Col>
        </Row>
      </TurtleContentModal>
    </>
  );
}

export default ConfirmOrderModal;
