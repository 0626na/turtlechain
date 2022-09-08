import { ParsedVendor, ResponseVendorInventory } from './../apis/vendorAPI';
import { vendorCartState } from '@store/vendorCartState';
import { useRecoilState } from 'recoil';
const useVendorCart = () => {
  const [cart, setCart] = useRecoilState(vendorCartState);

  const ready = (data: ResponseVendorInventory) => {
    const setSuccess = (data: ParsedVendor[]) => {
      return data.map((vendor) => ({
        ...vendor,
        isVatIncluded: false,
        useVendorName: vendor.name,
        memo: '',
      }));
    };

    const setPending = (data: ParsedVendor[]) => {
      return data.map((vendor) => ({
        ...vendor,
        isMatching: false,
        isVatIncluded: false,
        useVendorName: vendor.name,
        memo: '',
        selectedWsStoreInfo:
          vendor.ws_store_info.length === 1
            ? {
                ...vendor.ws_store_info[0],
                selectedAccount:
                  vendor.ws_store_info[0].store_account.length === 1
                    ? vendor.ws_store_info[0].store_account[0]
                    : undefined,
              }
            : undefined,
      }));
    };

    setCart({
      successList: setSuccess(data.data.success),
      pendingList: setPending(data.data.suggest),
      failList: data.data.fail,
    });
  };

  return {
    cart,
    ready,
  };
};

export default useVendorCart;
