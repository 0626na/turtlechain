import {
  ResponseConnectInventory,
  WarehousingItemConnect,
} from '@apis/warehousingAPI';
import { warehousingCartState } from '@store/warehousingCartState';
import { RcFile } from 'antd/lib/upload';
import moment from 'moment';
import { useCallback, useMemo } from 'react';
import { useRecoilState } from 'recoil';

const useWarehousingCart = () => {
  const [cart, setCart] = useRecoilState(warehousingCartState);

  const ready = useCallback(
    (data: ResponseConnectInventory) => {
      let index = 0; // 강제 pk 주입
      setCart({
        successList: data.data.success.map((item) => ({
          ...item,
          is_reserved: false,
          index: index++,
          warehousing_date:
            item.warehousing_date ?? moment().format('YYYY-MM-DD'),
        })),
        failList: data.data.fail.map((item) => ({
          ...item,
          index: index++,
        })),
        fileList: [],
      });
    },
    [setCart],
  );

  const saveFile = (file: RcFile) => {
    setCart((cart) => ({
      ...cart,
      fileList: [file],
    }));
  };

  const reset = useCallback(() => {
    setCart({
      fileList: [],
      successList: [],
      failList: [],
    });
  }, [setCart]);

  const updatePrice = (record: WarehousingItemConnect, value: number) => {
    setCart((cart) => ({
      ...cart,
      successList: cart.successList.map((item) =>
        item.index === record.index ? { ...item, price: value } : item,
      ),
    }));
  };

  const updateCount = (record: WarehousingItemConnect, value: number) => {
    setCart((cart) => ({
      ...cart,
      successList: cart.successList.map((item) =>
        item.index === record.index ? { ...item, count: value } : item,
      ),
    }));
  };

  const updateIsReserved = (record: WarehousingItemConnect) => {
    setCart((cart) => ({
      ...cart,
      successList: cart.successList.map((item) =>
        item.index === record.index
          ? { ...item, is_reserved: !item.is_reserved }
          : item,
      ),
    }));
  };

  const remove = (record: WarehousingItemConnect) => {
    setCart((cart) => ({
      ...cart,
      successList: cart.successList.filter(
        (item) => item.index !== record.index,
      ),
    }));
  };

  // 입고 수량 합계 계산
  const totalCount = useMemo(
    () => cart.successList.reduce((acc, cur) => acc + cur.count, 0),
    [cart.successList],
  );

  // 금액 합계 계산
  const totalAmount = useMemo(
    () => cart.successList.reduce((acc, cur) => acc + cur.count * cur.price, 0),
    [cart.successList],
  );

  return {
    cart,
    ready,
    saveFile,
    reset,
    updatePrice,
    updateCount,
    updateIsReserved,
    remove,
    totalCount,
    totalAmount,
  };
};

export default useWarehousingCart;
