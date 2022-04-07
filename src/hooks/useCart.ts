import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { cartState } from "store/cartState";

function useCart() {
  const cart = useRecoilValue(cartState);

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

  const totalSubtractPrice = useMemo(
    () => cart.adjustment_item_list.map((item) => item.balance).reduce((cur, acc) => cur + acc, 0),
    [cart.adjustment_item_list],
  );

  const totalReservePrice = useMemo(() => {}, []);

  const totalPrice = useMemo(
    () => totalDepositPrice - totalSubtractPrice,
    [totalDepositPrice, totalSubtractPrice],
  );

  return [totalDepositPrice, totalVatPrice, totalSubtractPrice, totalReservePrice, totalPrice];
}

export default useCart;
