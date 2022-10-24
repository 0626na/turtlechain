import clearingAPI from '@apis/clearingAPI';
import { CreateModal } from '@components/combine';
import useClearingCart from '@hooks/useClearingCart';
import useStore from '@hooks/useStore';
import React from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

interface Props {
  clickCreate(): void;
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string[];
  items: { title: string; content: string }[];
}

function ConfirmModal({ clickCreate, ...props }: Props) {
  const navigate = useNavigate();
  const { store } = useStore();
  const { cart } = useClearingCart();

  // 정산서 생성 및 정산 상품추가
  const createClearingMutation = useMutation(clearingAPI.create, {
    onSuccess: () => {
      // message.success(t('message.success create clearing'));
      clickCreate();
      navigate('/clearing/history');
    },
  });

  return (
    <div>
      <CreateModal
        {...props}
        loading={createClearingMutation.isLoading}
        onOk={() => {
          createClearingMutation.mutate({
            sheet: {
              store_id: store.selected?.id,
              credit_type: 'general',
              store_name: store.selected?.name,
              request_date: cart.clearingRequestDate,
            },
            item: {
              rt_store_id: store.selected?.id,
              rt_store_name: store.selected?.name,
              // 당일 결제 합계
              clearing_amount_list: cart.resultList
                .filter((item) => (item.clearing_payment_amount as number) > 0)
                .map((item) => ({
                  vendor_id: item.vendor_info.id,
                  clearing_amount: item.clearing_payment_amount as number,
                })),
              // 매입 차감
              subtract_amount_list: cart.adjustmentSubtractList
                .filter((item) => (item.overpaid_payment_amount as number) > 0)
                .map((item) => ({
                  vendor_id: item.vendor_info.id,
                  subtract_amount: item.overpaid_payment_amount as number,
                })),
            },
          });
        }}
      />
    </div>
  );
}

export default ConfirmModal;
