import { ResponseCreateOrderItemExcelParsing } from './../apis/orderAPI';
import { useCallback } from 'react';
import { orderCartState } from '@store/orderCartState';
import { useRecoilState } from 'recoil';

const useOrderCart = () => {
  const [cart, setCart] = useRecoilState(orderCartState);

  const ready = useCallback(
    (data: ResponseCreateOrderItemExcelParsing) => {
      setCart({
        successList: data.data.successes,
      });
    },
    [setCart],
  );

  const reset = useCallback(() => {
    setCart({
      successList: [],
    });
  }, [setCart]);

  return {
    cart,
    ready,
    reset,
  };
};

export default useOrderCart;
