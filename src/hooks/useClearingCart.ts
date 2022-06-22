import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { clearingCartState } from '@store/clearingCartState';
import { storeState } from '@store/storeState';

function useClearingCart() {
  const cart = useRecoilValue(clearingCartState);
  const store = useRecoilValue(storeState);

  const warehousingAmount = useMemo(
    () =>
      cart.warehousingBalanceList
        .filter((item) => item.clearing_amount)
        .map((item) => item.clearing_amount)
        .reduce((acc, cur) => acc + cur, 0),
    [cart.warehousingBalanceList],
  );

  const reserveSubtractAmount = useMemo(
    () =>
      cart.warehousingBalanceList
        .filter((item) => item.clearing_amount && item.reserve_amount > 0)
        .map((item) => item.reserve_amount)
        .reduce((acc, cur) => acc + cur, 0),
    [cart.warehousingBalanceList],
  );

  const adjustmentAmount = useMemo(
    () =>
      cart.adjustmentBalanceList
        .filter((item) => item.clearing_amount)
        .map((item) => item.clearing_amount)
        .reduce((acc, cur) => acc + cur, 0),
    [cart.adjustmentBalanceList],
  );

  const reserveAmount = useMemo(
    () =>
      cart.reserveBalanceList.reduce(
        (acc, cur) => acc + cur.price * cur.count,
        0,
      ),
    [cart.reserveBalanceList],
  );

  const paymentVatAmount = useMemo(
    () =>
      store.inventory_is_vat_included
        ? Math.round((warehousingAmount - adjustmentAmount) / 11)
        : (warehousingAmount - adjustmentAmount) * 0.1,
    [warehousingAmount, adjustmentAmount, store.inventory_is_vat_included],
  );

  const paymentSupplyAmount = useMemo(
    () =>
      store.inventory_is_vat_included
        ? warehousingAmount - adjustmentAmount - paymentVatAmount
        : warehousingAmount - adjustmentAmount,
    [
      warehousingAmount,
      adjustmentAmount,
      paymentVatAmount,
      store.inventory_is_vat_included,
    ],
  );

  return {
    warehousingAmount,
    reserveSubtractAmount,
    adjustmentAmount,
    reserveAmount,
    paymentSupplyAmount,
    paymentVatAmount,
  };
}

export default useClearingCart;
