import React from 'react';
import orderAPI, { CreatingOrdersItem, OrderItemList } from '@apis/orderAPI';
import { CreateModal } from '@components/combine';
import useOrderCart from '@hooks/useOrderCart';
import { message } from '@utils/message';
import moment from 'moment';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import useUser from '@hooks/useUser';
import { PICKER } from '@constant/index';

interface Props {
  visible: boolean;
  title: string;
  highlight?: boolean;
  description: string[];
  close: () => void;
  items: { title: string; content: string }[];
}

/**
 * 발주등록 최종 확인 모달
 * @param visible 모달 표시 유무
 * @param close 모달 닫을때 이벤트 함수
 * @param title 모달 제목
 * @param description 모달 설명 파라미터
 */
function ConfirmOrderModal({
  visible,
  close,
  title,
  description,
  highlight,
  ...props
}: Props) {
  const { cart, reset, integrationOrderList } = useOrderCart();
  const navigate = useNavigate();
  const { user } = useUser();

  /**
   * 발주서 등록 react-query 함수
   */
  const createOrderItemMutation = useMutation(orderAPI.createOrderItem, {
    onSuccess: (data) => {
      if (data.msg === 'success') {
        message.success(t('message.complete order'), 4);
        close();
        reset();
        user?.type === PICKER
          ? navigate('/picker/order/history')
          : navigate('/order/history');
      }
    },
  });

  return (
    <>
      <CreateModal
        {...props}
        highlight={highlight}
        visible={visible}
        loading={createOrderItemMutation.isLoading}
        onClose={close}
        title={title}
        okText={t('button.order')}
        description={description}
        onOk={() => {
          createOrderItemMutation.mutate({
            rt_stores: [
              ...integrationOrderList().map<OrderItemList>((order) => ({
                rt_store_id: order.rt_store_id,
                request_date: moment(cart.selectedDate).format('YYYY-MM-DD'),
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
    </>
  );
}

export default ConfirmOrderModal;
