import { adjustmentCartState } from './../store/adjustmentCartState';
import { useRecoilState } from 'recoil';
import { useState } from 'react';

const useAdjustmentCart = () => {
  const [cart, setCart] = useRecoilState(adjustmentCartState);

  const [exchangeRefundList, setExchangeRefundList] = useState([]);
  const passingToExchangeRefundPanel = () => {}; // 입고판넬 -> 교환/환불 판넬로 이동

  return {
    cart,
    setCart,
    passingToExchangeRefundPanel,
  };
};

export default useAdjustmentCart;
