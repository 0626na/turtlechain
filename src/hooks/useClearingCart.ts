import { useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { clearingCartState } from '@store/clearingCartState';
import { ClearingInfo } from '@apis/clearingAPI';

function useClearingCart() {
  const [cart, setCart] = useRecoilState(clearingCartState);

  // 결제요청일을 선택한다.
  const selectDate = (date: string) => {
    setCart({
      clearingRequestDate: date,
      reservePaymentList: [],
      reserveSubtractList: [],
      adjustmentSubtractList: [],
      resultList: [],
    });
  };

  // 당일 미송인 거래처를 filter
  const filterReservePayment = (balanceList: ClearingInfo[]) => {
    let index = 10000;
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
  const filterReserveSubtract = (balanceList: ClearingInfo[]) => {
    let index = 20000;
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
  const filterAdjustmentSubtract = (balanceList: ClearingInfo[]) => {
    let index = 30000;
    const existSubtract = (balance: ClearingInfo) =>
      balance.overpaid_amount > 0;
    const existWarehousing = (balance: ClearingInfo) =>
      balance.warehousing_amount + balance.unpaid_amount > 0;
    const existReserve = (balance: ClearingInfo) =>
      !!balance.reserve_payment_amount;

    const isAdjustmentSubtract = (balance: ClearingInfo) =>
      existSubtract(balance) &&
      (existWarehousing(balance) || existReserve(balance));

    const totalPaymentAmount = (balance: ClearingInfo) =>
      balance.warehousing_amount +
      balance.unpaid_amount +
      balance.reserve_payment_amount;

    return balanceList.filter(isAdjustmentSubtract).map((item) => ({
      ...item,
      id: index++,
      type: 'adjustment_subtract' as 'adjustment_subtract',
      overpaid_amount:
        item.overpaid_amount > totalPaymentAmount(item)
          ? totalPaymentAmount(item)
          : item.overpaid_amount,
    }));
  };

  // 결제금액 미리보기 filter
  const filterPayment = (balanceList: ClearingInfo[]) => {
    let index = 40000;

    const existPayment = (balance: ClearingInfo) =>
      balance.warehousing_amount +
        balance.unpaid_amount +
        balance.reserve_payment_amount +
        balance.reserve_subtract_amount >
      0;

    return balanceList.filter(existPayment).map((item) => ({
      ...item,
      id: index++,
      type: 'warehousing' as 'warehousing',
    }));
  };

  // balance중 차감, 추가를 구분한다
  const separate = (balanceList: ClearingInfo[]) => {
    setCart((cart) => ({
      ...cart,
      reservePaymentList: filterReservePayment(balanceList),
      reserveSubtractList: filterReserveSubtract(balanceList),
      adjustmentSubtractList: filterAdjustmentSubtract(balanceList),
      resultList: filterPayment(balanceList),
    }));
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
    // 매입차감 항목들의 입력금액을 같은 거래처를 찾아서 최종 결제 금액에 매입차감으로 넣어준다.
    const fillSubtractPayment = () => {
      cart.adjustmentSubtractList.forEach((subtractItem) => {
        setCart((cart) => ({
          ...cart,
          resultList: cart.resultList.map((resultItem) =>
            resultItem.vendor_info.id === subtractItem.vendor_info.id
              ? {
                  ...resultItem,
                  overpaid_payment_amount: subtractItem.overpaid_payment_amount,
                }
              : resultItem,
          ),
        }));
      });
    };

    // 당일 결제요청금액을 계산한다. 2. 당일 결제예정 금액 최소조건을 조건에 만족하면 넣어준다.
    const calculateTotal = () => {
      const getClearingAmount = (balance: ClearingInfo) =>
        balance.warehousing_amount +
        balance.unpaid_amount +
        balance.reserve_payment_amount -
        (balance.overpaid_payment_amount ?? 0);

      const getClearingPaymentAmount = (balance: ClearingInfo) =>
        balance.reserve_payment_amount &&
        balance.reserve_payment_amount -
          (balance.overpaid_payment_amount ?? 0) -
          balance.reserve_subtract_amount;

      setCart((cart) => ({
        ...cart,
        resultList: cart.resultList.map((item) => ({
          // 입고 + 미결제 + 미송 결제 - 매입 차감
          ...item,
          clearing_amount: getClearingAmount(item),
          // 당일 결제예정 금액 최소금액은 미송결제금액 - 매입차감 - 미송입고.
          clearing_payment_amount: getClearingPaymentAmount(item),
        })),
      }));
    };

    fillSubtractPayment();
    calculateTotal();
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
      resultList: cart.resultList.map((item) => ({
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
    selectDate,
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
