import { RcFile } from 'antd/lib/upload';
import { StoreOrder, StoreOrderItemExcelParsing } from '@apis/orderAPI';
import { ResponseCreateOrderItemExcelParsing } from './../apis/orderAPI';
import { useCallback, useState } from 'react';
import { orderCartState } from '@store/orderCartState';
import { useRecoilState } from 'recoil';

const useOrderCart = () => {
  const [cart, setCart] = useRecoilState(orderCartState);
  const [uploadFiles, setuploadFiles] = useState<RcFile[]>([]);

  const duplicationFilter = (
    store: StoreOrderItemExcelParsing,
    addedStores: StoreOrderItemExcelParsing[],
  ) => {
    const duplicatedStore = addedStores.find(
      (addedStore) => store.rt_store_id === addedStore.rt_store_id,
    );
    return duplicatedStore;
  };

  const duplicatedStoreFilter = (
    stores: StoreOrderItemExcelParsing[],
    duplicatedStore: StoreOrderItemExcelParsing,
  ) => {
    return stores.filter(
      (item) => item.rt_store_id !== duplicatedStore.rt_store_id,
    );
  };

  /*
   * 발주데이터의 거래처 목록에 id 생성
   */
  const createOrdersID = (orders: StoreOrder[]) => {
    return orders.map((order, index) => ({
      ...order,
      order_id: index,
    }));
  };

  /*
   * 발주 데이터 초기가공
   */
  const setStoreListItem = useCallback(
    (store: StoreOrderItemExcelParsing, id: number) => {
      return {
        ...store,
        orders: createOrdersID(store.orders),
        id,
      };
    },
    [],
  );

  /*
   * 데이터 신규추가
   */
  const ready = useCallback(
    (data: ResponseCreateOrderItemExcelParsing) => {
      let id = 0;
      setCart({
        successList: [
          //기존 쇼핑몰
          ...cart.successList.map((store) => {
            id++;
            return setStoreListItem(store, id);
          }),
          //새로 추가하는 쇼핑몰
          ...data.data.successes.map((store) => {
            id++;
            return setStoreListItem(store, id);
          }),
        ],

        failList: [...cart.failList, ...data.data.fails],
      });
    },
    [cart.failList, cart.successList, setCart, setStoreListItem],
  );

  /*
   * 단건추가시, 해당 단건이 첫번째 발주목록이 되는지를 확인후, id 생성
   */
  const checkSuccessListAndIDCreate = useCallback(() => {
    if (cart.successList.length !== 0)
      return cart.successList[cart.successList.length - 1].id! + 1;

    return 1;
  }, [cart.successList]);

  /*
   * 단건추가 등록
   */
  const updateSuccess = useCallback(
    (data: StoreOrderItemExcelParsing) => {
      setCart({
        successList: [
          ...cart.successList,
          {
            ...data,
            orders: createOrdersID(data.orders),
            id: checkSuccessListAndIDCreate(),
          },
        ],
        failList: cart.failList,
      });
    },
    [cart.failList, cart.successList, checkSuccessListAndIDCreate, setCart],
  );

  /*
   * 발주 데이터 초기화
   */
  const reset = useCallback(() => {
    setCart({
      successList: [],
      failList: [],
    });
  }, [setCart]);

  return {
    cart,
    setCart,
    uploadFiles,
    setuploadFiles,
    ready,
    reset,
    updateSuccess,
  };
};

export default useOrderCart;
