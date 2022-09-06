import { useMemo, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { clearingCartState } from '@store/clearingCartState';
import { ClearingInfo } from '@apis/clearingAPI';

function useClearingCart() {
  const [cart, setCart] = useRecoilState(clearingCartState);

  // 당일 미송인 거래처를 filter
  const filterReservePayment = (balanceList: ClearingInfo[], index: number) => {
    const isReservePayment = (balance: ClearingInfo) =>
      balance.reserve_payment_amount > 0;

    return balanceList
      .filter(isReservePayment) //
      .map((item) => ({
        ...item,
        id: index++,
        type: 'reserve_payment' as 'reserve_payment',
      }));
  };

  // 미송 차감인 거래처를 filter
  const filterReserveSubtract = (
    balanceList: ClearingInfo[],
    index: number,
  ) => {
    // 미송 차감 여부
    const isReserveSubtract = (balance: ClearingInfo) =>
      balance.reserve_subtract_amount > 0;

    return balanceList.filter(isReserveSubtract).map((item) => ({
      ...item,
      id: index++,
      type: 'reserve_subtract' as 'reserve_subtract',
    }));
  };

  // 매입 차감인 거래처를 filter
  const filterAdjustmentSubtract = (
    balanceList: ClearingInfo[],
    index: number,
  ) => {
    const existSubtract = (balance: ClearingInfo) =>
      balance.overpaid_amount > 0;
    const existWarehousing = (balance: ClearingInfo) =>
      balance.warehousing_amount + balance.unpaid_amount > 0;
    const existReserve = (balance: ClearingInfo) =>
      !!balance.reserve_payment_amount;

    const isAdjustmentSubtract = (balance: ClearingInfo) =>
      existSubtract(balance) &&
      (existWarehousing(balance) || existReserve(balance));

    const totalAmount = (balance: ClearingInfo) =>
      balance.warehousing_amount +
      balance.unpaid_amount +
      balance.reserve_payment_amount;

    return balanceList.filter(isAdjustmentSubtract).map((item) => ({
      ...item,
      id: index++,
      type: 'adjustment_subtract' as 'adjustment_subtract',
      // 사용 가능 금액이 입고 금액 + 미결제 + 미송결제보다 크면, 입고 금액 + 미결제 + 미송결제을 보여준다.
      overpaid_amount:
        item.overpaid_amount > totalAmount(item)
          ? totalAmount(item)
          : item.overpaid_amount,
    }));
  };

  // balance중 차감, 추가를 구분한다
  const separate = (balanceList: ClearingInfo[]) => {
    let index = { index: 0 };
    setCart({
      reservePaymentList: filterReservePayment(balanceList, index.index),
      reserveSubtractList: filterReserveSubtract(balanceList, index.index),
      adjustmentSubtractList: filterAdjustmentSubtract(
        balanceList,
        index.index,
      ),
      resultList: balanceList
        .filter(
          (item) =>
            item.warehousing_amount +
              item.unpaid_amount +
              item.reserve_payment_amount +
              item.reserve_subtract_amount >
            0,
        )
        .map((item) => ({
          ...item,
          id: index.index++,
          type: 'warehousing',
        })),
    });
  };

  const handleAdjustmentSubtract = (record: ClearingInfo, value: number) => {
    setCart((cart) => ({
      ...cart,
      adjustmentSubtractList: cart.adjustmentSubtractList.map((item) =>
        item.id === record.id
          ? {
              ...item,
              overpaid_payment_amount: value,
            }
          : item,
      ),
    }));
  };

  const fillAllAdjustmentSubtract = () => {
    setCart((cart) => ({
      ...cart,
      adjustmentSubtractList: cart.adjustmentSubtractList.map((item) => ({
        ...item,
        overpaid_payment_amount: item.overpaid_amount,
      })),
    }));
  };

  const calculateClearingAmount = () => {
    setCart((cart) => ({
      ...cart,
      resultList: cart.resultList
        .map((item) => {
          const resultItem = item;

          // 매입 차감을 warehousing으로 넘겨준다.
          cart.adjustmentSubtractList.forEach((item) => {
            if (item.vendor_info.id === resultItem.vendor_info.id) {
              resultItem.overpaid_payment_amount =
                item.overpaid_payment_amount! ?? 0;
            }
          });

          return resultItem;
        })
        .map((item) => ({
          // 입고 + 미결제 + 미송 결제 - 매입 차감
          ...item,
          clearing_amount:
            item.warehousing_amount +
            item.unpaid_amount +
            item.reserve_payment_amount -
            (item.overpaid_payment_amount ?? 0),
          // 당일 결제예정 금액 최소금액은 미송결제금액 - 매입차감 - 미송입고.
          clearing_payment_amount:
            item.reserve_payment_amount -
            (item.overpaid_payment_amount ?? 0) -
            item.reserve_subtract_amount,
        })),
    }));
  };

  const handleClearingAmount = (record: ClearingInfo, value: number) => {
    setCart((cart) => ({
      ...cart,
      resultList: cart.resultList.map((item) =>
        item.vendor_info.id === record.vendor_info.id
          ? {
              ...item,
              clearing_payment_amount: value,
            }
          : item,
      ),
    }));
  };

  const fillAllClearingAmount = () => {
    setCart((cart) => ({
      ...cart,
      warehousingBalanceList: cart.resultList.map((item) => ({
        ...item,
        clearing_payment_amount: item.clearing_amount,
      })),
    }));
  };

  // 미송 결제 합계
  const reservePaymentAmountTotal = useMemo(
    () =>
      cart.reservePaymentList.reduce(
        (acc, cur) => acc + (cur.reserve_payment_amount ?? 0),
        0,
      ),
    [cart.reservePaymentList],
  );

  //총 차감 합계(미송차감 + 매입차감)
  const subtractAmountTotal = useMemo(
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
  const clearingPaymentTotal = useMemo(
    () =>
      cart.resultList.reduce(
        (acc, cur) => acc + (cur.clearing_payment_amount! ?? 0),
        0,
      ),
    [cart.resultList],
  );

  return {
    cart,
    separate,
    handleAdjustmentSubtract,
    fillAllAdjustmentSubtract,
    calculateClearingAmount,
    handleClearingAmount,
    fillAllClearingAmount,
    reservePaymentAmountTotal,
    subtractAmountTotal,
    clearingPaymentTotal,
  };
}

export default useClearingCart;
