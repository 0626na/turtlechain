import { ParsedVendor, ResponseVendorInventory } from './../apis/vendorAPI';
import { vendorCartState } from '@store/vendorCartState';
import { useRecoilState } from 'recoil';
const useVendorCart = () => {
  const [cart, setCart] = useRecoilState(vendorCartState);

  const ready = (data: ResponseVendorInventory) => {
    const initSuccessList = (data: ParsedVendor[]) => {
      return data.map((vendor) => ({
        ...vendor,
        isVatIncluded: false,
        useVendorName: vendor.name,
        memo: '',
      }));
    };

    const initPendingList = (data: ParsedVendor[]) => {
      return data.map((vendor) => ({
        ...vendor,
        isMatching: false,
        isVatIncluded: false,
        useVendorName: vendor.name,
        memo: '',
      }));
    };

    setCart({
      successList: initSuccessList(data.data.success),
      pendingList: initPendingList(data.data.suggest),
      failList: data.data.fail,
    });
  };

  return {
    cart,
    setCart,
    ready,
  };
};

export default useVendorCart;
