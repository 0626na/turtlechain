import { useCallback, useEffect } from 'react';
import { RcFile } from 'antd/lib/upload';
import { productCartState } from '@store/productCartState';
import { useRecoilState } from 'recoil';
import { Product, ResponseConnectInventory } from '@apis/productAPI';
import { message } from 'antd';
import { t } from 'i18next';
import useStore from './useStore';

const useProductCart = () => {
  const [cart, setCart] = useRecoilState(productCartState);
  const { store } = useStore();

  const resetCart = useCallback(() => {
    setCart({
      successList: [],
      failList: [],
      fileList: [],
    });
  }, [setCart]);

  // 쇼핑몰 변경시 상태 초기화
  useEffect(() => {
    resetCart();
  }, [store.selected, resetCart]);

  const ready = (data: ResponseConnectInventory) => {
    setCart({
      successList: data.data.success.map((product) => ({
        ...product,
        submit_price: product.price,
        memo_value: product.memo,
        memo_active: !!product.memo,
      })),

      failList: data.data.fail,
      fileList: [],
    });

    message.info(
      `이미 등록된 상품이 ${data.data.count.duplicated_count}건 있습니다.`,
    );
  };

  const saveFile = (file: RcFile) => {
    setCart((cart) => ({
      ...cart,
      fileList: [file],
    }));
  };

  const updatePrice = (record: Product, value: number) => {
    setCart((cart) => ({
      ...cart,
      successList: cart.successList.map((product) =>
        product.product_code === record.product_code
          ? {
              ...product,
              price: value,
              need_update: true,
            }
          : product,
      ),
    }));
  };

  const deleteProduct = (record: Product) => {
    setCart((cart) => ({
      ...cart,
      successList: cart.successList.filter(
        (item) => item.product_code !== record.product_code,
      ),
    }));
  };

  const addProduct = (record: Product) => {
    if (
      cart.successList.find(
        (product) => product.product_code === record.product_code,
      )
    ) {
      message.warn(t('message.already exist product'));

      return false;
    }
    setCart((cart) => ({
      ...cart,
      successList: [
        {
          ...record,
          price: record.price,
          need_update: false,
        },
        ...cart.successList,
      ],
    }));

    return true;
  };

  return {
    cart,
    ready,
    saveFile,
    updatePrice,
    deleteProduct,
    addProduct,
    resetCart,
  };
};

export default useProductCart;
