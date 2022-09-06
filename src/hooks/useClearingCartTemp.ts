import { useRecoilState } from 'recoil';
import { clearingCartTempState } from '@store/clearingCartTempState';
import { ClearingInfo } from '@apis/clearingAPI';

function useClearingCartTemp() {
  const [cart, setCart] = useRecoilState(clearingCartTempState);

  // 당일 미송 여부
  const isReservePayment = (balance: ClearingInfo) =>
    balance.reserve_payment_amount > 0;

  // balance중 차감, 추가를 구분한다
  const separateAdjustment = (balanceList: ClearingInfo[]) => {
    let index = 0;
    setCart({
      additionalList: balanceList
        .filter(isReservePayment) //
        .map((item) => ({
          ...item,
          id: index++,
          type: 'reserve_payment',
        })),
      subtractList: [],
      resultList: [],
    });
  };

  // 미송 결제 합계
  //   const reservePaymentAmountTotal = useMemo(
  //     () =>
  //       cart.reservePaymentList.reduce(
  //         (acc, cur) => acc + (cur.reserve_payment_amount ?? 0),
  //         0,
  //       ),
  //     [cart.reservePaymentList],
  //   );

  //총 차감 합계(미송차감 + 매입차감)
  //   const subtractAmountTotal = useMemo(
  //     () =>
  //       cart.reserveSubtractList.reduce(
  //         (acc, cur) => acc + cur.reserve_subtract_amount,
  //         0,
  //       ) +
  //       cart.adjustmentSubtractList.reduce(
  //         (acc, cur) => acc + (cur.overpaid_payment_amount! ?? 0),
  //         0,
  //       ),
  //     [cart.reserveSubtractList, cart.adjustmentSubtractList],
  //   );

  //총 당일 결제 합계
  //   const clearingPaymentTotal = useMemo(
  //     () =>
  //       cart.warehousingBalanceList.reduce(
  //         (acc, cur) => acc + (cur.clearing_payment_amount! ?? 0),
  //         0,
  //       ),
  //     [cart.warehousingBalanceList],
  //   );

  return {
    // reservePaymentAmountTotal,
    // subtractAmountTotal,
    // clearingPaymentTotal,
  };
}

export default useClearingCartTemp;
