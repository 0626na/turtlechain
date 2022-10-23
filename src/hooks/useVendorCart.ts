import {
  ParsedVendor,
  ResponseVendorInventory,
  VendorAccount,
  Wholesale,
} from './../apis/vendorAPI';
import {
  PendingItem,
  SelectedWholesale,
  SuccessItem,
  vendorCartState,
} from '@store/vendorCartState';
import { useRecoilState } from 'recoil';

type SUCCESS_LIST = 'successList';
type PENDING_LIST = 'pendingList';

const useVendorCart = () => {
  const [cart, setCart] = useRecoilState(vendorCartState);

  const ready = (data: ResponseVendorInventory) => {
    const initSuccessList = (data: ParsedVendor[]) => {
      return data.map((vendor) => ({
        ...vendor,
        isVatIncluded: false,
        useVendorName: vendor.name,
        memo: undefined,
      }));
    };

    const initPendingList = (data: ParsedVendor[]) => {
      return data.map((vendor) => ({
        ...vendor,
        isMatching: false,
        isVatIncluded: false,
        useVendorName: vendor.name,
        memo: undefined,
      }));
    };

    setCart({
      successList: initSuccessList(data.data.success),
      pendingList: initPendingList(data.data.suggest),
      failList: data.data.fail,
    });
  };

  const vatIncludedUpdate = (
    target: SuccessItem | PendingItem,
    listName: SUCCESS_LIST | PENDING_LIST,
  ) => {
    setCart((cart) => ({
      ...cart,
      [listName]: cart[listName]?.map((item) =>
        item.vendor_code === target.vendor_code
          ? {
              ...target,
              isVatIncluded: !target.isVatIncluded,
            }
          : item,
      ),
    }));
  };

  const handleUseVendorNameUpdate = (
    newVendorName: string,
    target: SuccessItem | PendingItem,
    listName: SUCCESS_LIST | PENDING_LIST,
  ) => {
    setCart((cart) => ({
      ...cart,
      [listName]: cart[listName]?.map((item) =>
        item.vendor_code === target.vendor_code
          ? {
              ...target,
              useVendorName: newVendorName,
            }
          : item,
      ),
    }));
  };

  const memoUpdate = (
    newMemo: string,
    target: PendingItem | SuccessItem,
    listName: SUCCESS_LIST | PENDING_LIST,
  ) => {
    setCart((cart) => ({
      ...cart,
      [listName]: cart[listName]?.map((item) =>
        item.vendor_code === target.vendor_code
          ? {
              ...target,
              memo: newMemo,
            }
          : item,
      ),
    }));
  };

  const vendorRemove = (targetVendorCode: string) => {
    setCart(() => ({
      ...cart,
      successList: cart.successList.filter(
        (item) => item.vendor_code !== targetVendorCode,
      ),
    }));
  };

  const findWsStore = (wsStoreList: Wholesale[], SelectedWsId: number) => {
    const result = wsStoreList.find(
      (wholesale: Wholesale) => wholesale.id === SelectedWsId,
    ) as SelectedWholesale;

    return {
      ...result,
      selectedAccount:
        result?.store_account.length === 1
          ? result.store_account[0]
          : undefined,
    };
  };

  const handleWholesaleStoreSelecte = (
    SelectedWsStoreId: number,
    selectedRow: PendingItem,
  ) => {
    const wsStoreInfo = findWsStore(
      selectedRow.ws_store_info,
      SelectedWsStoreId,
    );

    setCart((cart) => ({
      ...cart,
      pendingList: cart.pendingList.map((item) =>
        item.vendor_code === selectedRow.vendor_code
          ? {
              ...selectedRow,
              selectedWsStoreInfo: wsStoreInfo,
              isMatching: !!wsStoreInfo.selectedAccount,
            }
          : item,
      ),
    }));
  };

  const handleAccountSelecte = (
    selectedAccount: VendorAccount,
    selectedRow: PendingItem,
  ) => {
    setCart((cart) => ({
      ...cart,
      pendingList: cart.pendingList.map((item) =>
        item.vendor_code === selectedRow.vendor_code
          ? {
              ...selectedRow,
              isMatching: true,
              selectedWsStoreInfo: {
                ...(selectedRow.selectedWsStoreInfo as SelectedWholesale),
                selectedAccount,
              },
            }
          : item,
      ),
    }));
  };

  const convertToSuccessItem = (target: PendingItem) => {
    return {
      ...target,
      ws_store_info: [
        {
          ...(target.selectedWsStoreInfo as SelectedWholesale),
          store_account: [
            target.selectedWsStoreInfo?.selectedAccount as VendorAccount,
          ],
        },
      ],
    };
  };

  const convertToMutateItem = (vendor: SuccessItem, rt_store_id: number) => ({
    rt_store_id: rt_store_id,
    vendor_code: vendor.vendor_code,
    vendor_account_id: vendor.ws_store_info[0].store_account[0].id,
    vendor_phone_id: vendor.ws_store_info[0].store_phone[0].id,
    ws_store_id: vendor.ws_store_info[0].id,
    vendor_address: vendor.ws_store_info[0].address,
    vendor_name: vendor.useVendorName,
    memo: vendor.memo,
    is_vat_included: vendor.isVatIncluded,
  });

  return {
    cart,
    setCart,
    ready,
    convertToSuccessItem,
    vatIncludedUpdate,
    memoUpdate,
    handleUseVendorNameUpdate,
    convertToMutateItem,
    vendorRemove,
    handleWholesaleStoreSelecte,
    handleAccountSelecte,
  };
};

export default useVendorCart;
