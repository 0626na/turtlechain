import React from 'react';
import orderAPI, { CreatingOrdersItem, OrderItemList } from '@apis/orderAPI';
import { TurtleContentModal } from '@components/combine';
import { AnswerButton } from '@components/element';
import useOrderCart from '@hooks/useOrderCart';
import { Col, Row, Space, Typography } from 'antd';
import { message } from '@utils/message';
import moment from 'moment';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';

interface Props {
  visible: boolean;

  close: () => void;
}

function ConfirmOrderModal({ visible, close }: Props) {
  const {
    cart,
    reset,
    calculateTotalPrice,
    integrationOrderList,
    countSuccessList,
  } = useOrderCart();
  const navigate = useNavigate();

  //발주서 등록
  const createOrderItemMutation = useMutation(orderAPI.createOrderItem, {
    onSuccess: (data) => {
      if (data.msg === 'success') {
        message.success(t('message.complete create order'), 4);
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
        title={t('orderConfirm')}
        visible={visible}
        onClose={close}
      >
        <Space direction="vertical">
          <Typography.Paragraph>
            {t('failed orders are except')} <br />
            {t('please check order info again')}
          </Typography.Paragraph>

          <Typography.Text style={{ fontSize: 16, fontWeight: 500 }}>
            {`${t('orderDate')}: ${moment(cart.selectedDate).format(
              'YYYY-MM-DD',
            )}   `}
          </Typography.Text>
          <Typography.Text style={{ fontSize: 16, fontWeight: 500 }}>
            {t('totalOrderCountInConfirm', {
              count: countSuccessList(),
            })}
          </Typography.Text>
          <Typography.Text style={{ fontSize: 16, fontWeight: 500 }}>
            {t('totalOrderPriceInComfirm', {
              price: calculateTotalPrice().toLocaleString(),
            })}
          </Typography.Text>
        </Space>
        <Row justify="end">
          <Col style={{ marginRight: 10 }}>
            <AnswerButton
              type="NO"
              text={t('button.cancel')}
              onClick={createOrderItemMutation.isLoading ? () => {} : close}
            />
          </Col>
          <Col>
            <AnswerButton
              type="YES"
              text={t('button.request')}
              loading={createOrderItemMutation.isLoading}
              onClick={() => {
                t;
                createOrderItemMutation.mutate({
                  rt_stores: [
                    ...integrationOrderList().map<OrderItemList>((order) => ({
                      rt_store_id: order.rt_store_id,
                      request_date: moment(cart.selectedDate).format(
                        'YYYY-MM-DD',
                      ),
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
                        creation_type: item.creation_type,
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
