import { adjustmentCartState } from './../store/adjustmentCartState';
import { useRecoilState } from 'recoil';

const useExchageRefundCart = () => {
  const [cart, setCart] = useRecoilState(adjustmentCartState);

  return {
    cart,
    setCart,
  };
};

export default useExchageRefundCart;
