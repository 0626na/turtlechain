import { useCallback } from 'react';
import {
  ParsedVendor,
  RequestCreate,
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
import { t } from 'i18next';
import { message } from '@utils/message';

type SUCCESS_LIST = 'successList';
type PENDING_LIST = 'pendingList';

const useVendorCart = () => {
  const [cart, setCart] = useRecoilState(vendorCartState);
  /**
   * cart 초기화
   */
  const reset = useCallback(() => {
    setCart({
      successList: [],
      pendingList: [],
      failList: [],
    });
  }, []);

  /**
   * 거래처 데이터 신규추가
   * @param {ResponseVendorInventory} data 파싱된 거래처 데이터 or 하나씩 추가로 생성된 거래처 데이터
   */
  const ready = useCallback((data: ResponseVendorInventory) => {
    const initSuccessList = (vendorList: ParsedVendor[]) =>
      vendorList.map((vendor) => ({
        ...vendor,
        isVatIncluded: false,
        useVendorName: vendor.name,
        memo: undefined,
      }));

    const initPendingList = (vendorList: ParsedVendor[]) =>
      vendorList.map((vendor) => ({
        ...vendor,
        isMatching: false,
        isVatIncluded: false,
        useVendorName: vendor.name,
        memo: undefined,
      }));

    setCart({
      successList: initSuccessList(data.data.success),
      pendingList: initPendingList(data.data.suggest),
      failList: data.data.fail,
    });
  }, []);

  /**
   * 거래처 데이터 하나씩 추가
   * @param {SuccessItem} vendor 새로 추가하는 1개의 거래처
   */
  const addSingleVendor = useCallback((vendor: SuccessItem) => {
    const isAlreadyExist = cart.successList.some(
      (item) => item.vendor_code === vendor.vendor_code,
    );

    if (isAlreadyExist) {
      message.warn(t('message.already exist vendor'));
      return false;
    }

    setCart((cart) => ({
      ...cart,
      successList: [vendor, ...cart.successList],
    }));

    return true;
  }, []);

  /**
   * 부가세 바로전달 처리
   * @param target 부가세 바로전달 처리를 체크한 거래처
   * @param listName 성공/보류/실패 리스트
   */
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

  /**
   * 거래처명 수정
   * @param newVendorName 새 거래처 이름
   * @param target 이름을 바꾸려는 거래처
   * @param listName 성공/보류
   */
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

  /**
   * 거래처 메모내용 수정
   * @param newMemo 새 메모
   * @param target 메모 수정하려는 거래처
   * @param listName 성공/보류
   */
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

  /**
   * 거래처 삭제
   * @param targetVendorCode 삭제라혀는 거래처의 거래처 코드
   */
  const vendorRemove = (targetVendorCode: string) => {
    setCart(() => ({
      ...cart,
      successList: cart.successList.filter(
        (item) => item.vendor_code !== targetVendorCode,
      ),
    }));
  };

  /**
   * 도매처 찾기, 거래처등록에서 보류 상태의 거래처 매칭을 위한 도매처 검색
   * @param wsStoreList
   * @param selectedWsId
   * @returns
   */
  const findWsStore = (wsStoreList: Wholesale[], selectedWsId: number) => {
    const result = wsStoreList.find(
      (wholesale: Wholesale) => wholesale.id === selectedWsId,
    ) as SelectedWholesale;

    return result;
  };

  /**
   * 보류 상태의 거래처 매칭하기
   * @param selectedWsStoreId
   * @param selectedRow
   */
  const handleWholesaleStoreSelecte = (
    selectedWsStoreId: number,
    selectedRow: PendingItem,
  ) => {
    const wsStoreInfo = findWsStore(
      selectedRow.ws_store_info,
      selectedWsStoreId,
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

  /**
   * 보류 탭의 거래처 데이터 성공탭으로 이전
   * @param target
   * @returns
   */
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

  /**
   * 거래처 등록시, api request에 올릴수 있도록 변경
   * @param vendor
   * @param rt_store_id
   * @returns
   */
  const convertToMutateItem = (
    vendor: SuccessItem,
    rt_store_id: number,
  ): RequestCreate => ({
    rt_store_id: rt_store_id,
    vendor_code: vendor.vendor_code,
    vendor_account_id: Number(vendor.ws_store_info[0].store_account[0].id),
    vendor_phone_id: vendor.ws_store_info[0].store_phone[0].id,
    ws_store_id: vendor.ws_store_info[0].id,
    vendor_address: vendor.ws_store_info[0].address,
    vendor_name: vendor.useVendorName,
    memo: vendor.memo ?? '',
    is_vat_included: vendor.isVatIncluded,
  });

  return {
    cart,
    ready,
    reset,
    convertToSuccessItem,
    vatIncludedUpdate,
    memoUpdate,
    handleUseVendorNameUpdate,
    convertToMutateItem,
    vendorRemove,
    handleWholesaleStoreSelecte,
    handleAccountSelecte,
    addSingleVendor,
  };
};

export default useVendorCart;
