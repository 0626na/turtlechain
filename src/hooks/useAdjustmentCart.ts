import { adjustmentCartState } from './../store/adjustmentCartState';
import { useRecoilState } from 'recoil';

const useAdjustmentCart = () => {
  const [cart, setCart] = useRecoilState(adjustmentCartState);

  return {
    cart,
    setCart,
  };
};

export default useAdjustmentCart;
