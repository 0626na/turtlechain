import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { clearingCartState } from "store/clearingCartState";

function useClearingCart() {
  const cart = useRecoilValue(clearingCartState);

  const totalDepositPrice = useMemo(
    () =>
      cart.warehousing_item_list
        .map((item) => item.deposit_price)
        .reduce((acc, cur) => acc + cur, 0),
    [cart.warehousing_item_list],
  );

  const totalVatPrice = useMemo(
    () =>
      cart.warehousing_item_list.map((item) => item.vat_price).reduce((acc, cur) => acc + cur, 0),
    [cart.warehousing_item_list],
  );

  const totalReserveSubtractPrice = useMemo(
    () =>
      cart.warehousing_item_list
        .filter((item) => item.is_reserved)
        .map((item) => item.deposit_price)
        .reduce((acc, cur) => acc + cur, 0),
    [cart.warehousing_item_list],
  );

  const totalSubtractPrice = useMemo(
    () => cart.subtract_item_list.map((item) => item.price).reduce((cur, acc) => cur + acc, 0),
    [cart.subtract_item_list],
  );

  const totalReservePrice = useMemo(
    () => cart.reserve_item_list.map((item) => item.price).reduce((cur, acc) => cur + acc, 0),
    [cart.reserve_item_list],
  );

  const totalPrice = useMemo(
    () => totalDepositPrice - totalReserveSubtractPrice - totalSubtractPrice + totalReservePrice,
    [totalDepositPrice, totalReserveSubtractPrice, totalSubtractPrice, totalReservePrice],
  );

  return [
    totalDepositPrice,
    totalVatPrice,
    totalReserveSubtractPrice,
    totalSubtractPrice,
    totalReservePrice,
    totalPrice,
  ];
}

export default useClearingCart;
