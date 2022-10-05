import { RcFile } from 'antd/lib/upload';
import { StoreOrderItemExcelParsing } from '@apis/orderAPI';
import { ResponseCreateOrderItemExcelParsing } from './../apis/orderAPI';
import { useCallback, useState, useMemo } from 'react';
import { orderCartState } from '@store/orderCartState';
import { useRecoilState } from 'recoil';

interface FailListState {
  id: number;
  store_id: number;
  store_name: string;
  vendor_name: string;
  vendor_address: string;
  phone: string;
  vendor_product: string;
  product_option: string;
  type: string;
  count: string;
  price: string;
  memo: string;
}

const useOrderCart = () => {
  const [cart, setCart] = useRecoilState(orderCartState);
  const [failList, setFailList] = useState<FailListState[]>([]);
  const [uploadFiles, setuploadFiles] = useState<RcFile[]>([]);

  const ready = useCallback(
    (data: ResponseCreateOrderItemExcelParsing) => {
      setCart({
        successList: [...cart.successList, ...data.data.successes],
        failList: data.data.fails,
      });
    },
    [cart.successList, setCart],
  );

  const updateSuccess = useCallback(
    (data: StoreOrderItemExcelParsing) => {
      setCart({
        successList: [...cart.successList, data],
        failList: cart.failList,
      });
    },
    [cart.failList, cart.successList, setCart],
  );

  const findSuccess = useCallback(
    (data: StoreOrderItemExcelParsing) => {
      if (
        cart.successList.find((store) => store.rt_store_id === data.rt_store_id)
      ) {
        const findStore = cart.successList.find(
          (store) => store.rt_store_id === data.rt_store_id,
        );

        //이미 등록되어 있는 상품인경우
        if (
          findStore?.orders.find(
            (order) => order.product_name === data.orders[0].product_name,
          )
        ) {
          setCart({
            successList: [
              ...cart.successList.map((store) => {
                if (store.rt_store_id === findStore.rt_store_id) {
                  return {
                    rt_store_id: findStore.rt_store_id,
                    rt_store_name: findStore.rt_store_name,
                    orders: [
                      ...findStore.orders.map((order) => {
                        if (
                          order.product_name === data.orders[0].product_name
                        ) {
                          order = {
                            ...order,
                            product_count: `${
                              Number(order.product_count) +
                              Number(data.orders[0].product_count)
                            }`,
                          };
                        }

                        return order;
                      }),
                    ],
                  };
                }

                return store;
              }),
            ],

            failList: [...cart.failList],
          });

          return true;
        }

        findStore &&
          setCart({
            successList: [
              ...cart.successList.filter(
                (store) => store.rt_store_id !== findStore.rt_store_id,
              ),
              {
                rt_store_id: findStore.rt_store_id,
                rt_store_name: findStore.rt_store_name,
                orders: [...findStore.orders, data.orders[0]],
              },
            ],
            failList: [...cart.failList],
          });

        return true;
      }
      return false;
    },
    [cart, setCart],
  );

  const reset = useCallback(() => {
    setCart({
      successList: [],
      failList: [],
    });
  }, [setCart]);

  //실패 케이스 데이터 생성
  useMemo(() => {
    cart.failList.map((failitem) =>
      setFailList([
        ...failitem.orders.map<FailListState>((value, index) => {
          return {
            id: index,
            store_id: failitem.rt_store_id,
            store_name: failitem.rt_store_name,
            vendor_name: value.vendor_name,
            vendor_address: value.vendor_address,
            phone: value.vendor_mobile,
            vendor_product: value.product_name,
            product_option: value.product_option,
            type: value.order_type,
            count: value.product_count,
            price: value.product_price,
            memo: value.memo,
          };
        }),
      ]),
    );
  }, [cart.failList]);

  return {
    cart,
    setCart,
    failList,
    uploadFiles,
    setuploadFiles,
    ready,
    reset,
    updateSuccess,
    findSuccess,
  };
};

export default useOrderCart;
