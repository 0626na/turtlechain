import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { clearingCartState } from '@store/clearingCartState';

function useClearingCart() {
  const cart = useRecoilValue(clearingCartState);

  const warehousingSupplyAmount = useMemo(
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

  const adjustmentSupplyAmount = useMemo(
    () =>
      cart.adjustmentBalanceList
        .filter((item) => item.clearing_amount)
        .map((item) => item.clearing_amount)
        .reduce((acc, cur) => acc + cur, 0),
    [cart.adjustmentBalanceList],
  );

  const reserveSupplyAmount = useMemo(
    () =>
      cart.reserveBalanceList.reduce(
        (acc, cur) => acc + cur.price * cur.count,
        0,
      ),
    [cart.reserveBalanceList],
  );

  // const totalVatPrice = useMemo(
  //   () =>
  //     cart.warehousing_item_list
  //       .map((item) => item.vat_price)
  //       .reduce((acc, cur) => acc + cur, 0),
  //   [cart.warehousing_item_list],
  // );

  // const totalReserveSubtractPrice = useMemo(
  //   () =>
  //     cart.warehousing_item_list
  //       .filter((item) => item.is_reserved)
  //       .map((item) => item.deposit_price)
  //       .reduce((acc, cur) => acc + cur, 0),
  //   [cart.warehousing_item_list],
  // );

  // const totalSubtractPrice = useMemo(
  //   () =>
  //     cart.subtract_item_list
  //       .map((item) => item.price)
  //       .reduce((cur, acc) => cur + acc, 0),
  //   [cart.subtract_item_list],
  // );

  // const totalReservePrice = useMemo(
  //   () =>
  //     cart.reserve_item_list
  //       .map((item) => item.price)
  //       .reduce((cur, acc) => cur + acc, 0),
  //   [cart.reserve_item_list],
  // );

  // const totalPrice = useMemo(
  //   () =>
  //     totalDepositPrice -
  //     totalReserveSubtractPrice -
  //     totalSubtractPrice +
  //     totalReservePrice,
  //   [
  //     totalDepositPrice,
  //     totalReserveSubtractPrice,
  //     totalSubtractPrice,
  //     totalReservePrice,
  //   ],
  // );

  return {
    warehousingSupplyAmount,
    reserveSubtractAmount,
    adjustmentSupplyAmount,
    reserveSupplyAmount,
  };
}

export default useClearingCart;
