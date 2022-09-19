import {
  ResponseConnectInventory,
  WarehousingItemConnect,
} from '@apis/warehousingAPI';
import { warehousingCartState } from '@store/warehousingCartState';
import { RcFile } from 'antd/lib/upload';
import moment from 'moment';
import { useCallback, useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import useStore from './useStore';

const useWarehousingCart = () => {
  const [cart, setCart] = useRecoilState(warehousingCartState);
  const { store } = useStore();

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

  // 쇼핑몰 변경시 상태 초기화
  useEffect(() => {
    reset();
  }, [store.selected, reset]);

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

  const add = (record: WarehousingItemConnect) => {
    const index = 100000; // 단건 추가항목은 100000부터 시작
    const last = cart.successList.slice(-1);

    setCart((cart) => ({
      ...cart,
      successList: [
        ...cart.successList,
        {
          ...record,
          is_reserved: false,
          index: (last.length === 0 ? index : (last[0]?.index as number)) + 1,
          warehousing_date: moment().format('YYYY-MM-DD'),
          store_house: '기본창고',
        },
      ],
    }));
  };

  // 미송입고 상품 존재여부
  const existMaybeReserve = useMemo(
    () => !!cart.successList.find((item) => item.maybe_reserved),
    [cart.successList],
  );

  // 총 거래처 수 중복 제거해서 계산
  const vendorCount = useMemo(() => {
    const set = new Set(cart.successList.map((item) => item.vendor_id));
    const count = Array.from(set).length;
    return count;
  }, [cart.successList]);

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
    add,
    existMaybeReserve,
    vendorCount,
    totalCount,
    totalAmount,
  };
};

export default useWarehousingCart;
