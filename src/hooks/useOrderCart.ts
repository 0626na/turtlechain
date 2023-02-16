import { RcFile } from 'antd/lib/upload';
import {
  StoreOrder,
  StoreOrderItemExcelParsing,
  ResponseCreateOrderItemExcelParsing,
  RequestCreateOrderFormat,
} from '@apis/orderAPI';
import { useCallback, useState } from 'react';
import { orderCartState } from '@store/orderCartState';
import { useRecoilState } from 'recoil';
import moment from 'moment';
import { t } from 'i18next';

/**
 * 발주등록 페이지의 실패 미리보기 테이블에서 사용되는 데이터 구조. 실패 테이블에서는 데이터 depth가 없기에 한번 합쳐줄 필요가 있다.
 */
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
  product_count: number;
  product_price: number;
  order_type: string;
  memo: string;
}

/**
 * 발주서 헤더
 */
export type IorderColumn =
  | 'vendor_name'
  | 'vendor_address'
  | 'vendor_mobile'
  | 'order_type'
  | 'product_count'
  | 'product_name'
  | 'product_option'
  | 'product_price'
  | 'memo';

/**
 * 발주페이지에서 사용되는 custom hook
 *
 */
const useOrderCart = () => {
  const [cart, setCart] = useRecoilState(orderCartState);
  const [uploadFiles, setuploadFiles] = useState<RcFile[]>([]);
  const [orderFormat, setOrderFormat] = useState<RequestCreateOrderFormat>({
    vendor_name: [],
    vendor_address: [],
    vendor_mobile: [],
    product_name: [],
    product_option: [],
    product_count: [],
    product_price: [],
    order_type: [],
    memo: [],
  });

  /**
   * 발주 등록전, 발주 중복 데이터 및 실패 => 성공으로 이전데이터를 통합
   * @returns {StoreOrderItemExcelParsing[]} 최종적으로 발주서로 등록될 발주데이터 array
   */
  const integrationOrderList = () => {
    const organizedList: StoreOrderItemExcelParsing[] = [];
    let comparisonList = cart.successList;
    let orderArrayToMerge: StoreOrder[] = [];

    cart.successList.map((store) => {
      //같은 쇼핑몰을 2개 이상 등록한 경우 탐색
      comparisonList.map((item) => {
        if (item.id !== store.id && item.rt_store_id === store.rt_store_id) {
          orderArrayToMerge = item.orders;
        }
      });

      //이미 병합해서 등록되어 있는지를 탐색
      if (
        !organizedList.find(
          (fStore) => fStore.rt_store_id === store.rt_store_id,
        )
      )
        organizedList.push({
          ...store,
          orders: [...store.orders, ...orderArrayToMerge],
        });

      //병합 끝낸 쇼핑몰 제거
      comparisonList = comparisonList.filter(
        (item) => item.rt_store_id !== store.rt_store_id,
      );
      orderArrayToMerge = [];
    });

    //실패 케이스 데이터
    comparisonList = cart.failList;

    organizedList.map((store) => {
      comparisonList.map((item) => {
        if (item.rt_store_id === store.rt_store_id) {
          orderArrayToMerge = item.orders;
        }
      });

      //이미 존재하는 쇼핑몰의 array index 탐색
      const replaceArrayIndex = organizedList.findIndex(
        (item) => item.rt_store_id === store.rt_store_id,
      );

      //실패케이스에 있는 발주데이터의 쇼핑몰이 없는경우 새로 추가
      if (replaceArrayIndex !== -1) {
        organizedList[replaceArrayIndex] = {
          ...store,
          orders: [...store.orders, ...orderArrayToMerge],
        };
      }
      comparisonList = comparisonList.filter(
        (item) => item.rt_store_id !== store.rt_store_id,
      );
      orderArrayToMerge = [];
    });

    return organizedList;
  };

  /**
   * 발주데이터의 거래처 목록에 id 생성
   * @returns {StoreOrder[]}
   */
  const createOrdersID = (orders: StoreOrder[], type: 'excel' | 'single') => {
    return orders.map<StoreOrder>((order, index) => ({
      ...order,
      creation_type: type,
      order_id: index,
    }));
  };

  /**
   * 발주 데이터에 id 부여, 이 id는 프론트엔드 영역에서만 쓰이며, 실제 api로 데이터 전송시에는 사용하지 않는다.
   * @returns {StoreOrderItemExcelParsing}
   */
  const setStoreListItem = useCallback(
    (
      store: StoreOrderItemExcelParsing,
      id: number,
    ): StoreOrderItemExcelParsing => {
      return {
        ...store,
        orders: createOrdersID(store.orders, 'excel'),
        id,
      };
    },
    [],
  );

  /**
   * 발주데이터 신규추가
   */
  const ready = useCallback(
    (data: ResponseCreateOrderItemExcelParsing) => {
      let id = 0;
      setCart({
        ...cart,
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
        parsingStatus: data.data.parsing_status,
      });
    },
    [cart, setCart, setStoreListItem],
  );

  /**
   * 단건추가시, 해당 단건이 첫번째 발주목록이 되는지를 확인후, id 생성
   */
  const checkSuccessListAndIDCreate = useCallback(() => {
    if (cart.successList.length !== 0)
      return Number(cart.successList[cart.successList.length - 1].id) + 1;

    return 1;
  }, [cart.successList]);

  /**
   * 단건추가 등록(Picker)
   */
  const addSingleOrder = useCallback(
    (data: StoreOrderItemExcelParsing) => {
      setCart({
        ...cart,
        successList: [
          ...cart.successList,
          {
            ...data,
            orders: createOrdersID(data.orders, 'single'),
            id: checkSuccessListAndIDCreate(),
          },
        ],
        failList: cart.failList,
      });
    },
    [cart.failList, cart.successList, checkSuccessListAndIDCreate, setCart],
  );

  /**
   * 기존의 발주배열에 단건으로 새 발주데이터를 추가
   */
  const addOrdersToSingleOrder = (
    orders: StoreOrder[],
    newOrder: StoreOrder,
  ): StoreOrder[] => {
    return [...orders, newOrder];
  };

  /**
   * 단건추가 등록 (쇼핑몰)
   */
  const addSingleOrderForStore = useCallback(
    (data: StoreOrderItemExcelParsing) => {
      setCart({
        ...cart,
        successList: [
          {
            rt_store_id: cart.successList[0].rt_store_id,
            rt_store_name: cart.successList[0].rt_store_name,
            orders: createOrdersID(
              addOrdersToSingleOrder(
                cart.successList[0].orders,
                data.orders[0],
              ),
              'single',
            ),

            type: 'single',
          },
        ],
      });
    },
    [cart.successList],
  );

  /**
   * 실패 케이스 미리보기 출력을 위한 데이터 구조 가공
   */
  const failListOutput = useCallback(() => {
    const failRowList: FailListForOutput[] = [];
    let failOrderId = 1;

    if (cart.failList.length !== 1)
      cart.failList.map((item, index) => {
        if (index !== 0) failOrderId += item.orders.length - 1;
      });

    cart.failList.map((store, storeIndex) => {
      let failRow: FailListForOutput;
      store.orders.map((order, index) => {
        failRow = {
          id: storeIndex === 0 ? index : failOrderId + index,
          rt_store_id: store.rt_store_id,
          rt_store_name: store.rt_store_name,
          order_id: Number(order.order_id),
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

  /**
   * 발주 쇼핑몰 갯수
   */
  const countOrderStores = useCallback(() => {
    return cart.successList.length;
  }, [cart.successList]);

  /**
   * 성공 발주 갯수
   */
  const countSucessOrdersCount = useCallback(() => {
    let count = cart.successList.reduce(
      (acc, store) => acc + store.orders.length,
      0,
    );

    cart.failList.map((store) => {
      store.orders.map((order) => {
        if (order.mobile !== '') count++;
      });
    });
    return count;
  }, [cart.successList, cart.failList]);

  /**
   * 실패데이터 카운팅
   */
  const countFailList = useCallback(() => {
    let count = 0;

    cart.failList.map((store) => {
      count += store.orders.length;
    });

    //실패에서 성공으로 넘어간 케이스 카운트
    cart.failList.map((store) => {
      store.orders.map((order) => {
        if (order.mobile !== '') count--;
      });
    });

    return count;
  }, [cart.failList]);

  /**
   * 발주데이터에서 발주 총 금액
   */
  const calculateTotalPrice = useCallback(() => {
    let total = 0;
    total = cart.successList.reduce(
      (acc, store) =>
        acc +
        store.orders.reduce(
          (acc, order) =>
            acc + Number(order.product_price) * Number(order.product_count),
          0,
        ),
      0,
    );

    total += cart.failList.reduce(
      (acc, store) =>
        acc +
        store.orders.reduce(
          (acc, order) =>
            order.mobile !== ''
              ? acc + Number(order.product_price) * Number(order.product_count)
              : acc,
          0,
        ),
      0,
    );

    return total;
  }, [cart.successList, cart.failList]);

  /**
   * 발주 수량 분류별 계산
   */
  const countOrdersForType = useCallback(() => {
    const orderCount = {
      order: 0,
      reserve: 0,
      takeback: 0,
      exchange: 0,
      sample: 0,
      pickup: 0,
      extra: 0,
      total: 0,
    };
    cart.successList.map((item) => {
      item.orders.map((order) => {
        if (order.order_type === 'order')
          orderCount.order += Number(order.product_count);
        if (order.order_type === 'reserve')
          orderCount.reserve += Number(order.product_count);
        if (order.order_type === 'takeback')
          orderCount.takeback += Number(order.product_count);
        if (order.order_type === 'exchange')
          orderCount.exchange += Number(order.product_count);
        if (order.order_type === 'sample')
          orderCount.sample += Number(order.product_count);
        if (order.order_type === 'pickup')
          orderCount.pickup += Number(order.product_count);
        if (order.order_type === 'extra')
          orderCount.extra += Number(order.product_count);

        orderCount.total += Number(order.product_count);
      });
    });

    cart.failList.map((item) => {
      item.orders.map((order) => {
        if (order.mobile === '') return;

        if (order.order_type === 'order')
          orderCount.order += Number(order.product_count);
        if (order.order_type === 'reserve')
          orderCount.reserve += Number(order.product_count);
        if (order.order_type === 'takeback')
          orderCount.takeback += Number(order.product_count);
        if (order.order_type === 'exchange')
          orderCount.exchange += Number(order.product_count);
        if (order.order_type === 'sample')
          orderCount.sample += Number(order.product_count);
        if (order.order_type === 'pickup')
          orderCount.pickup += Number(order.product_count);
        if (order.order_type === 'extra')
          orderCount.extra += Number(order.product_count);

        orderCount.total += Number(order.product_count);
      });
    });

    return orderCount;
  }, [cart.successList, cart.failList]);

  /**
   * 발주 데이터 초기화
   */
  const reset = useCallback(() => {
    setCart({
      parsingStatus: { fail_count: 0, success_count: 0, error_messages: [] },
      successList: [],
      failList: [],
      selectedDate: moment(),
    });
  }, [setCart]);

  /**
   * 발주서설정, 발주서 헤더 새로 추가
   */
  const addNewOrderColumn = (column: IorderColumn) => {
    setOrderFormat({
      ...orderFormat,
      [column]: [...orderFormat[column], ''],
    });
  };

  /**
   * 발주서설정, 등록되어 있는 발주서 헤더 변경
   */
  const changeOrderColumn = (
    column: IorderColumn,
    id: string,
    newColumn: string,
  ) => {
    setOrderFormat({
      ...orderFormat,
      [column]: orderFormat[column].map((value, index) => {
        if (String(index) === id) return newColumn;
        return value;
      }),
    });
  };

  /**
   * 발주서설정, 등록되어있는 발주서 헤더 제거
   */
  const deleteOrderColumn = (column: IorderColumn, columnName: string) => {
    setOrderFormat({
      ...orderFormat,
      [column]: orderFormat[column].filter(
        (vendorName) => vendorName !== columnName,
      ),
    });
  };

  /**
   * 발주 메모 입력함수
   */
  const inputMemo = (
    store: StoreOrderItemExcelParsing,
    value: string,
    orderRowID: number,
  ) => {
    return store.orders.map<StoreOrder>((order) => ({
      ...order,
      memo: order.order_id === orderRowID ? value : order.memo,
    }));
  };

  /**
   * 메모 입력된 발주데이터 리스트에 추가
   */
  const setSuccessListToMemo = (
    list: StoreOrderItemExcelParsing[],
    rowID: number,
    orderRowID: number,
    memoValue: string,
  ) =>
    list.map<StoreOrderItemExcelParsing>((store) => ({
      ...store,
      orders:
        store.id === rowID
          ? inputMemo(store, memoValue, orderRowID)
          : store.orders,
    }));

  /**
   * 발주 미리보기에서 수량 변경
   * @param orders 변경 하려는 발주 데이터가 속한 발주 array
   * @param value 변경할 수량 데이터
   * @param selectedOrderID 변경할 수량 데이터의 발주데이터의 아이디
   * @returns 변경한 수량데이터가 적용된 발주 array
   */
  const setOrderCount = (
    orders: StoreOrder[],
    value: string,
    selectedOrderID: number,
  ) =>
    orders.map<StoreOrder>((order) => ({
      ...order,
      product_count:
        order.order_id === selectedOrderID && value !== 'null'
          ? Number(value)
          : order.product_count,
    }));

  /**
   * 발주 미리보기에서 수량 변경된 데이터를 리스트에 추가
   * @param list 수량을 변경하려는 발주데이터가 속해있는 발주 쇼핑몰 array
   * @param selectedOrderID 변경하려는 발주 데이터의 아이디
   * @param storeID 변경하려는 발주데이터가 속한 쇼핑몰의 아이디
   * @param value 변경하려는 수량 데이터
   * @returns 변경한 수량 데이터가 반영된 발주 쇼핑몰 array 발주 데이터는 각각의 쇼핑몰 안에 array 형식으로 속해있다.
   */
  const setSuccessListToOrderCount = (
    list: StoreOrderItemExcelParsing[],
    selectedOrderID: number,
    storeID: number,
    value: string,
  ) =>
    list.map<StoreOrderItemExcelParsing>((item) => ({
      ...item,
      orders:
        item.rt_store_id === storeID
          ? setOrderCount(item.orders, String(value), Number(selectedOrderID))
          : item.orders,
    }));

  /**
   * 발주 성공/실패 테이블에 있는 발주 데이터 분류 데이터 변경
   * @param orders 쇼핑몰 오브젝트 안에 있는 발주 array
   * @param value 변경할 분류 데이터
   * @param selectedOrderID 변경하려는 분류 데이터가 속한 발주의 아이디
   * @returns 변경한 분류 데이터가 적용된 발주 array
   */
  const setOrderType = (
    orders: StoreOrder[],
    value: string,
    selectedOrderID: number,
  ) =>
    orders.map<StoreOrder>((order) => ({
      ...order,
      order_type: order.order_id === selectedOrderID ? value : order.order_type,
    }));

  /**
   *  변경한 분류 데이터를 리스트에 적용
   * @list 변경할 분류데이터가 속해있는 쇼핑몰 발주 목록
   * @value 변경한 분류데이터
   * @selectedStoreID 변경하려는 분류데이터의 쇼핑몰 데이터의 ID
   * @selectedOrderID 변경하려는 분류데이터의 발주데이터의 ID
   */
  const setSuccessListToOrderType = (
    list: StoreOrderItemExcelParsing[],
    value: string,
    selectedStoreID: number,
    selectedOrderID: number,
  ) =>
    list.map<StoreOrderItemExcelParsing>((item) => ({
      ...item,
      orders:
        item.rt_store_id === selectedStoreID
          ? setOrderType(item.orders, value, selectedOrderID)
          : item.orders,
    }));

  /**
   * 발주의 분류 데이터에 맞게 한글로 변경
   * @param orderType 발주 분류데이터 (영문)
   * @returns 발주 분류데이터 (한글)
   */
  const translateOrderType = (orderType: string) => {
    if (orderType === 'order') return t('type.orderTypes.order');
    if (orderType === 'reserve') return t('type.orderTypes.reserve');
    if (orderType === 'takeback') return t('type.orderTypes.takeback');
    if (orderType === 'exchange') return t('type.orderTypes.exchange');
    if (orderType === 'sample') return t('type.orderTypes.sample');
    if (orderType === 'pickup') return t('type.orderTypes.pickup');
    if (orderType === 'extra') return t('type.orderTypes.extra');

    return '';
  };

  return {
    cart,
    setCart,
    failListOutput,
    uploadFiles,
    setuploadFiles,
    ready,
    reset,
    integrationOrderList,
    addSingleOrder,
    addSingleOrderForStore,
    countSucessOrdersCount,
    countFailList,
    countOrderStores,
    calculateTotalPrice,
    orderFormat,
    setOrderFormat,
    countOrdersForType,
    addNewOrderColumn,
    changeOrderColumn,
    deleteOrderColumn,
    inputMemo,
    setSuccessListToMemo,
    setOrderCount,
    setSuccessListToOrderCount,
    setSuccessListToOrderType,
    translateOrderType,
  };
};

export default useOrderCart;
