import { RcFile } from 'antd/lib/upload';
import { productCartState } from '@store/productCartState';
import { useRecoilState } from 'recoil';
import { Product, ResponseConnectInventory } from '@apis/productAPI';
import { message } from 'antd';
import { t } from 'i18next';

const useProductCart = () => {
  const [cart, setCart] = useRecoilState(productCartState);

  const ready = (data: ResponseConnectInventory) => {
    setCart((cart) => ({
      // ...cart,
      successList: data.data.success.map((product) => ({
        ...product,
        submit_price: product.price,
        memo_value: product.memo,
        memo_active: !!product.memo,
      })),

      failList: data.data.fail,
      fileList: [],
    }));
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
  };
};

export default useProductCart;
