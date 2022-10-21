import { RcFile } from 'antd/lib/upload';
import {
  StoreOrder,
  StoreOrderItemExcelParsing,
  ResponseCreateOrderItemExcelParsing,
} from '@apis/orderAPI';
import { useCallback, useState } from 'react';
import { orderCartState } from '@store/orderCartState';
import { useRecoilState } from 'recoil';

export interface FailListForOutput {
  id: number;
  order_id: number;
  rt_store_id: number;
  rt_store_name: string;
  vendor_name: string;
  vendor_address: string;
  mobile: string;
  product_name: string;
  product_option: string;
  product_count: string;
  product_price: string;
  order_type: string;
  memo: string;
}

const useOrderCart = () => {
  const [cart, setCart] = useRecoilState(orderCartState);
  const [uploadFiles, setuploadFiles] = useState<RcFile[]>([]);

  //발주 등록 전, 발주 중복 데이터 및 실패=> 성공 이전데이터 통합
  const integrationOrderList = () => {
    let organizedList: StoreOrderItemExcelParsing[] = [];
    let comparisonList = cart.successList;

    // eslint-disable-next-line array-callback-return
    cart.successList.map((store) => {
      // eslint-disable-next-line array-callback-return
      comparisonList.map((item) => {
        if (item.id !== store.id && item.rt_store_id === store.rt_store_id) {
          store.orders.concat(item.orders);
        }
      });

      organizedList.push(store);
      comparisonList = comparisonList.filter(
        (item) => item.rt_store_id !== store.rt_store_id,
      );
    });

    comparisonList = cart.failList;

    // eslint-disable-next-line array-callback-return
    cart.failList.map((store) => {
      // eslint-disable-next-line array-callback-return
      store.orders.map((order) => {
        if (order.mobile !== '') {
          organizedList = organizedList.map((item) => {
            if (item.rt_store_id === store.rt_store_id)
              return {
                ...item,
                orders: [...item.orders, order],
              };

            return item;
          });
        }
      });
    });

    return organizedList;
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

        failList: [
          ...cart.failList.map((store) => {
            id++;
            return setStoreListItem(store, id);
          }),
          ...data.data.fails.map((store) => {
            id++;
            return setStoreListItem(store, id);
          }),
        ],
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
   * 실패 케이스 미리보기 출력을 위한 가공
   */
  const failListOutput = useCallback(() => {
    let failRowList: FailListForOutput[] = [];
    let id = 0;
    // eslint-disable-next-line array-callback-return
    cart.failList.map((store) => {
      let failRow: FailListForOutput;
      // eslint-disable-next-line array-callback-return
      store.orders.map((order) => {
        failRow = {
          id: id++,
          rt_store_id: store.rt_store_id,
          rt_store_name: store.rt_store_name,
          order_id: order.order_id!,
          vendor_name: order.vendor_name,
          vendor_address: order.vendor_address,
          mobile: order.mobile,
          product_name: order.product_name,
          product_option: order.product_option,
          product_count: order.product_count,
          product_price: order.product_price,
          order_type: order.order_type,
          memo: order.memo,
        };
        failRowList.push(failRow);
      });
    });
    return failRowList;
  }, [cart.failList]);

  /*
   * 성공데이터 카운팅
   */

  const countSuccessList = useCallback(() => {
    let count = 0;
    // eslint-disable-next-line array-callback-return
    cart.successList.map((store) => {
      count += store.orders.length;
    });

    //실패에서 성공으로 이전한 경우의 데이터 카운트 (실패에서 휴대전화번호 입력시)
    // eslint-disable-next-line array-callback-return
    cart.failList.map((store) => {
      // eslint-disable-next-line array-callback-return
      store.orders.map((order) => {
        if (order.mobile !== '') count++;
      });
    });

    return count;
  }, [cart.successList, cart.failList]);

  /*
   * 실패데이터 카운팅
   */

  const countFailList = useCallback(() => {
    let count = 0;
    // eslint-disable-next-line array-callback-return
    cart.failList.map((store) => {
      count += store.orders.length;
    });

    //실패에서 성공으로 넘어간 케이스 카운트
    // eslint-disable-next-line array-callback-return
    cart.failList.map((store) => {
      // eslint-disable-next-line array-callback-return
      store.orders.map((order) => {
        if (order.mobile !== '') count--;
      });
    });

    return count;
  }, [cart.failList]);

  const calculateTotalPrice = useCallback(() => {
    let total = 0;
    total = cart.successList.reduce(
      (acc, store) =>
        acc +
        store.orders.reduce(
          (acc, order) => acc + Number(order.product_price),
          0,
        ),
      0,
    );

    total += cart.failList.reduce(
      (acc, store) =>
        acc +
        store.orders.reduce(
          (acc, order) =>
            order.mobile !== '' ? acc + Number(order.product_price) : acc,
          0,
        ),
      0,
    );

    return total;
  }, [cart.successList, cart.failList]);

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
    failListOutput,
    uploadFiles,
    setuploadFiles,
    ready,
    reset,
    integrationOrderList,
    updateSuccess,
    countSuccessList,
    countFailList,
    calculateTotalPrice,
  };
};

export default useOrderCart;
