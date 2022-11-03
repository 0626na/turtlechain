import { useRecoilState } from 'recoil';
import { exelClearingCartState } from '@store/exelClearingCartState';

import { ClearingItemParse } from '@apis/clearingAPI';

function useExelClearingCart() {
  const [cart, setCart] = useRecoilState(exelClearingCartState);

  // 결제요청일을 선택한다.
  const selectDate = (date: string) => {
    setCart((cart) => ({
      ...cart,
      clearingRequestDate: date,
    }));
  };

  const ready = (
    successList: ClearingItemParse[],
    failList: ClearingItemParse[],
  ) => {
    setCart((cart) => ({
      ...cart,
      successList,
      failList,
    }));
  };

  return {
    cart,
    ready,
    selectDate,
  };
}

export default useExelClearingCart;
