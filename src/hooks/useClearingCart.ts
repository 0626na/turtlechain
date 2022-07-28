import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { clearingCartState } from '@store/clearingCartState';

function useClearingCart() {
  const cart = useRecoilValue(clearingCartState);

  // 미송 결제 합계
  const handleReservePaymentAmountTotal = useMemo(
    () =>
      cart.reservePaymentList.reduce(
        (acc, cur) => acc + (cur.reserve_payment_amount ?? 0),
        0,
      ),
    [cart.reservePaymentList],
  );

  //총 차감 합계(미송차감 + 매입차감)
  const handleSubtractAmountTotal = useMemo(
    () =>
      cart.reserveSubtractList.reduce(
        (acc, cur) => acc + cur.reserve_subtract_amount,
        0,
      ) +
      cart.adjustmentSubtractList.reduce(
        (acc, cur) => acc + (cur.overpaid_payment_amount! ?? 0),
        0,
      ),
    [cart.reserveSubtractList, cart.adjustmentSubtractList],
  );

  //총 당일 결제 합계
  const handleClearingPaymentTotal = useMemo(
    () =>
      cart.warehousingBalanceList.reduce(
        (acc, cur) => acc + (cur.clearing_payment_amount! ?? 0),
        0,
      ),
    [cart.warehousingBalanceList],
  );

  return {
    handleReservePaymentAmountTotal,
    handleSubtractAmountTotal,
    handleClearingPaymentTotal,
  };
}

export default useClearingCart;
