import { RcFile } from 'antd/lib/upload';
import { productCartState } from '@store/productCartState';
import { useRecoilState } from 'recoil';
import { Product, ResponseConnectInventory } from '@apis/productAPI';

const useProductCart = () => {
  const [cart, setCart] = useRecoilState(productCartState);

  const ready = (data: ResponseConnectInventory) => {
    setCart((cart) => ({
      // ...cart,
      successList: [
        ...data.data.success.map((product) => ({
          ...product,
          submit_price: product.price,
          memo_value: product.memo,
          memo_active: !!product.memo,
        })),
        ...cart.successList,
      ],
      failList: [...data.data.fail, ...cart.failList],
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

  return {
    cart,
    ready,
    saveFile,
    updatePrice,
    deleteProduct,
  };
};

export default useProductCart;
